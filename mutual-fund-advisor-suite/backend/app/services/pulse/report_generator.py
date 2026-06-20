import json
import os
import re
from typing import List, Optional, Tuple

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

from app.core.config import settings
from app.models.pulse_schemas import PulseInputData, PulseReportData
from app.services.scheduler.pii_guard import PIIGuard

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")

# Scheme-name + return-figure/recommendation language together is exactly the
# Screen 6.5 design-review violation (Stitch review, Product Pulse fund-recommendation
# section) — Pulse must never imply a fund recommendation, even indirectly.
RECOMMEND_LANGUAGE_PATTERN = re.compile(
    r"\b(recommend(ed|s)?|should invest|better than|outperform(s|ed)?|best choice|"
    r"buy now|invest in|guaranteed returns?)\b",
    re.IGNORECASE,
)
PERCENTAGE_PATTERN = re.compile(r"\d+(\.\d+)?\s*%")

MAX_SECTIONS_1_4_WORDS = 250
MAX_KEY_OBSERVATION_WORDS = 100
REQUIRED_RECOMMENDATION_COUNT = 3

SYSTEM_PROMPT = """You are generating a weekly intelligence report for SEBI-registered investment advisors about investor queries on a mutual fund information platform.

RULES:
- All investor quotes must be anonymised: replace any name with [Investor], any scheme name with [Scheme]
- Key observation must be <= 100 words
- Sections 1-4 (top_themes + user_quotes + key_observation + fee_spotlight_term) combined must be <= 250 words
- Include EXACTLY 3 product_recommendations — these are recommendations for the PLATFORM/CONTENT team (e.g. "add an FAQ entry about X"), never investment or fund recommendations
- product_recommendations must NEVER name a specific mutual fund scheme, NEVER include a percentage/return figure, and NEVER use language like "recommend", "should invest", "better than", "outperform", or "buy now"
- No forward-looking investment claims of any kind
- No PII in any output field (no names, emails, PAN, Aadhaar, account numbers)

Respond with JSON only, with exactly these keys:
{"top_themes": [string, string, string], "user_quotes": [string, ...], "key_observation": string, "fee_spotlight_term": string, "product_recommendations": [string, string, string]}
"""


def _load_top20_scheme_names() -> List[str]:
    path = os.path.join(
        os.path.dirname(__file__), "../../../corpus/sources/top20_schemes.json"
    )
    try:
        with open(path, "r") as f:
            data = json.load(f)
        names = []
        for scheme in data.get("schemes", []):
            names.append(scheme["name"])
            names.extend(scheme.get("aliases", []))
        return names
    except FileNotFoundError:
        return []


TOP20_SCHEME_NAMES = _load_top20_scheme_names()


def count_words(text: str) -> int:
    return len(text.split())


def scan_for_pii(text: str) -> Tuple[bool, Optional[str]]:
    guard = PIIGuard()
    has_pii, pii_type = guard.detect_pii(text)
    if has_pii:
        return True, pii_type
    if EMAIL_PATTERN.search(text):
        return True, "Email"
    return False, None


def scan_for_scheme_recommendation_violation(text: str) -> bool:
    """True if a Top 20 scheme name appears alongside a percentage or recommend-style phrase."""
    text_lower = text.lower()
    scheme_mentioned = any(name.lower() in text_lower for name in TOP20_SCHEME_NAMES)
    if not scheme_mentioned:
        return False
    return bool(PERCENTAGE_PATTERN.search(text) or RECOMMEND_LANGUAGE_PATTERN.search(text))


def _all_fields(data: dict) -> List[str]:
    fields = list(data.get("top_themes", [])) + list(data.get("user_quotes", []))
    fields.append(data.get("key_observation", ""))
    fields.append(data.get("fee_spotlight_term", ""))
    fields.extend(data.get("product_recommendations", []))
    return fields


def validate(data: dict) -> Tuple[bool, Optional[str]]:
    recs = data.get("product_recommendations", [])
    if len(recs) != REQUIRED_RECOMMENDATION_COUNT:
        return False, f"expected exactly {REQUIRED_RECOMMENDATION_COUNT} product_recommendations, got {len(recs)}"

    if len(data.get("user_quotes", [])) < 1:
        return False, "user_quotes must contain at least 1 entry"

    if len(data.get("top_themes", [])) < 1:
        return False, "top_themes must contain at least 1 entry"

    sections_1_4_text = " ".join(
        list(data.get("top_themes", []))
        + list(data.get("user_quotes", []))
        + [data.get("key_observation", ""), data.get("fee_spotlight_term", "")]
    )
    word_count = count_words(sections_1_4_text)
    if word_count > MAX_SECTIONS_1_4_WORDS:
        return False, f"sections 1-4 word count {word_count} exceeds {MAX_SECTIONS_1_4_WORDS}"

    if count_words(data.get("key_observation", "")) > MAX_KEY_OBSERVATION_WORDS:
        return False, "key_observation exceeds 100 words"

    for field in _all_fields(data):
        has_pii, pii_type = scan_for_pii(field)
        if has_pii:
            return False, f"PII detected ({pii_type}) in field: {field!r}"
        if scan_for_scheme_recommendation_violation(field):
            return False, f"scheme-name + recommendation/return language detected in field: {field!r}"

    return True, None


def _top_n(distribution: dict, n: int) -> List[Tuple[str, int]]:
    return sorted(distribution.items(), key=lambda kv: kv[1], reverse=True)[:n]


def build_deterministic_report(input_data: PulseInputData) -> dict:
    """Guaranteed-compliant report built directly from aggregated counts, no LLM.

    Used both as the full fallback when no GROQ_API_KEY is configured, and as the
    final safety net if the LLM output fails validation twice — the report MUST
    always be produced, and it MUST always pass `validate()` by construction.
    """
    top_topics = _top_n(input_data.topic_distribution, 3)
    top_themes = [
        f"{topic.replace('_', ' ').title()} queries — {count} this week"
        for topic, count in top_topics
    ] or ["No FAQ queries recorded this week"]

    user_quotes = [f'"{q}"' for q in input_data.top_queries[:3]] or [
        "No representative queries available this week."
    ]

    top_fee_term = _top_n(input_data.fee_term_counts, 1)
    fee_spotlight_term = top_fee_term[0][0] if top_fee_term and top_fee_term[0][1] > 0 else "TER"
    fee_count = top_fee_term[0][1] if top_fee_term else 0

    key_observation = (
        f"This week the platform logged {input_data.total_queries} factual queries. "
        f"{fee_spotlight_term} was the most-asked fee concept, appearing in {fee_count} queries. "
        f"Booking activity spanned {len(input_data.booking_topic_distribution)} topic categories."
    )

    top_booking_topic = _top_n(input_data.booking_topic_distribution, 1)
    booking_topic_name = top_booking_topic[0][0] if top_booking_topic else "general"
    booking_topic_count = top_booking_topic[0][1] if top_booking_topic else 0

    product_recommendations = [
        f"Add a dedicated FAQ shortcut for {fee_spotlight_term} — asked in {fee_count} queries this week.",
        f"Expand Education Hub content on {booking_topic_name.replace('_', ' ')} topics — "
        f"{booking_topic_count} advisor bookings this week were tagged with this category.",
        f"Review the FAQ Centre's top-of-page suggestions to surface {fee_spotlight_term} "
        f"content earlier, given {fee_count} related queries this week.",
    ]

    data = {
        "top_themes": top_themes[:3] if len(top_themes) >= 3 else top_themes + ["No further themes this week"] * (3 - len(top_themes)),
        "user_quotes": user_quotes,
        "key_observation": key_observation,
        "fee_spotlight_term": fee_spotlight_term,
        "product_recommendations": product_recommendations,
    }
    return _enforce_word_limit(data)


def _sections_1_4_word_count(data: dict) -> int:
    text = " ".join(
        list(data["top_themes"]) + list(data["user_quotes"])
        + [data["key_observation"], data["fee_spotlight_term"]]
    )
    return count_words(text)


def _enforce_word_limit(data: dict) -> dict:
    """Real investor query text has unbounded length — guarantee the 250-word cap
    structurally by trimming quotes (then themes) rather than trusting input size."""
    while _sections_1_4_word_count(data) > MAX_SECTIONS_1_4_WORDS and data["user_quotes"]:
        data["user_quotes"].pop()
    while _sections_1_4_word_count(data) > MAX_SECTIONS_1_4_WORDS and len(data["top_themes"]) > 1:
        data["top_themes"].pop()
    if not data["user_quotes"]:
        data["user_quotes"] = ["No representative queries available this week."]
    if _sections_1_4_word_count(data) > MAX_SECTIONS_1_4_WORDS:
        words = data["key_observation"].split()
        data["key_observation"] = " ".join(words[: max(1, MAX_SECTIONS_1_4_WORDS // 2)])
    return data


class PulseReportGenerator:
    def __init__(self):
        # NOTE: existing services (triage classifier, FAQ answer_builder) read
        # `os.environ.get("GROQ_API_KEY", ...)`, but pydantic-settings only loads
        # .env into `settings`, not into the real OS environment — so that pattern
        # silently always hits the mock fallback. Using `settings.GROQ_API_KEY`
        # here so Pulse generation actually calls the real LLM when configured.
        groq_api_key = settings.GROQ_API_KEY
        if groq_api_key:
            # NOTE: `llama3-8b-8192` (the model name used elsewhere in this codebase,
            # e.g. triage classifier, FAQ answer_builder) has been decommissioned by
            # Groq. Using a currently-supported model for this new service.
            self.llm = ChatGroq(
                model_name="llama-3.1-8b-instant",
                groq_api_key=groq_api_key,
                model_kwargs={"response_format": {"type": "json_object"}},
            )
        else:
            self.llm = None

    def _call_llm(self, input_data: PulseInputData, strict: bool = False) -> Optional[dict]:
        if self.llm is None:
            return None

        prompt = (
            f"This week's aggregated platform data (counts only, no raw investor data):\n"
            f"- Week: {input_data.week_start} to {input_data.week_end}\n"
            f"- FAQ topic distribution: {input_data.topic_distribution}\n"
            f"- Booking topic distribution: {input_data.booking_topic_distribution}\n"
            f"- Fee term query counts: {input_data.fee_term_counts}\n"
            f"- Feedback rating counts: {input_data.feedback_counts}\n"
            f"- Total queries: {input_data.total_queries}\n"
            f"- Representative (already PII-filtered) query strings: {input_data.top_queries}\n"
            f"- Real user app reviews highlighting pain points: {input_data.app_reviews}\n"
        )
        if strict:
            prompt += (
                "\nYour previous attempt failed validation. Re-generate, being stricter about: "
                "exactly 3 product_recommendations, all words combined in top_themes+user_quotes+"
                "key_observation+fee_spotlight_term under 250 words, and absolutely no scheme names, "
                "percentages, or recommendation language in product_recommendations."
            )

        try:
            messages = [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=prompt)]
            response = self.llm.invoke(messages)
            return json.loads(response.content)
        except Exception as e:
            print(f"Pulse report LLM generation error: {e}")
            return None

    def generate(self, input_data: PulseInputData) -> PulseReportData:
        data = self._call_llm(input_data, strict=False)
        if data is not None:
            is_valid, _ = validate(data)
            if not is_valid:
                data = self._call_llm(input_data, strict=True)
                if data is not None:
                    is_valid, _ = validate(data)
                    if not is_valid:
                        data = None
        if data is None:
            data = build_deterministic_report(input_data)
            is_valid, reason = validate(data)
            assert is_valid, f"Deterministic fallback report failed its own validation: {reason}"

        sections_1_4_text = " ".join(
            list(data["top_themes"]) + list(data["user_quotes"])
            + [data["key_observation"], data["fee_spotlight_term"]]
        )

        return PulseReportData(
            top_themes=data["top_themes"],
            user_quotes=data["user_quotes"],
            key_observation=data["key_observation"],
            fee_spotlight_term=data["fee_spotlight_term"],
            product_recommendations=data["product_recommendations"],
            sections_1_4_word_count=count_words(sections_1_4_text),
        )
