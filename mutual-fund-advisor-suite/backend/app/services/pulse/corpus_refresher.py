import json
from datetime import date
from typing import List, Optional

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.faq_models import FeeExplainer
from app.services.pulse.report_generator import scan_for_pii, scan_for_scheme_recommendation_violation

SYSTEM_PROMPT = """You are writing investor-education content for an Indian mutual fund information platform's Fee Explainer panel.

RULES:
- Output exactly 6 short bullet points explaining the given fee term, factually, sourced from SEBI/AMFI conventions
- Output exactly 2 source links: one to a SEBI/AMFI-style URL
- No investment advice, no fund recommendations, no specific scheme names, no performance claims
- No PII of any kind

Respond with JSON only: {"bullets": [string x6], "source_links": [string x2]}
"""

DEFAULT_SOURCE_LINKS = [
    "https://www.amfiindia.com/investor-corner",
    "https://www.sebi.gov.in",
]


def _deterministic_bullets(fee_term: str) -> List[str]:
    return [
        f"{fee_term} is a cost concept referenced in SEBI/AMFI mutual fund disclosures.",
        f"Every mutual fund scheme's SID and KIM disclose its {fee_term} terms in detail.",
        f"{fee_term} terms can vary by scheme, plan type, and holding period.",
        f"Always check the scheme's current SID/KIM for the exact {fee_term} structure before investing.",
        f"{fee_term} disclosures are reviewed periodically by AMCs as part of regulatory compliance.",
        f"For personalised guidance on how {fee_term} affects your specific investment, speak to a SEBI-registered advisor.",
    ]


class CorpusRefresher:
    def __init__(self):
        groq_api_key = settings.GROQ_API_KEY
        if groq_api_key:
            self.llm = ChatGroq(
                model_name="llama-3.1-8b-instant",
                groq_api_key=groq_api_key,
                model_kwargs={"response_format": {"type": "json_object"}},
            )
        else:
            self.llm = None

    def _generate_content(self, fee_term: str) -> dict:
        if self.llm is not None:
            try:
                messages = [
                    SystemMessage(content=SYSTEM_PROMPT),
                    HumanMessage(content=f"Fee term: {fee_term}"),
                ]
                response = self.llm.invoke(messages)
                data = json.loads(response.content)
                bullets = data.get("bullets", [])
                source_links = data.get("source_links", [])
                if (
                    len(bullets) == 6
                    and len(source_links) == 2
                    and not any(scan_for_pii(b)[0] for b in bullets)
                    and not any(scan_for_scheme_recommendation_violation(b) for b in bullets)
                ):
                    return {"bullets": bullets, "source_links": source_links}
            except Exception as e:
                print(f"Corpus refresher LLM generation error: {e}")

        return {"bullets": _deterministic_bullets(fee_term), "source_links": DEFAULT_SOURCE_LINKS}

    async def trigger_fee_explainer_update(
        self, db: AsyncSession, fee_term: str, week_start: date
    ) -> int:
        result = await db.execute(select(FeeExplainer.version).order_by(FeeExplainer.version.desc()))
        current_max = result.scalars().first() or 0
        new_version = current_max + 1

        content = self._generate_content(fee_term)

        new_explainer = FeeExplainer(
            version=new_version,
            fee_term=fee_term,
            bullets_json=content["bullets"],
            source_links_json=content["source_links"],
        )
        db.add(new_explainer)
        await db.commit()
        await db.refresh(new_explainer)

        return new_version
