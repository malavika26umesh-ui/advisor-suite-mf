import json
import httpx
from bs4 import BeautifulSoup
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from app.core.config import settings

EXTRACTION_SYSTEM_PROMPT = """You extract factual mutual fund scheme data from a webpage's text content.

RULES:
1. Only extract a value if it is explicitly stated in the provided text. Never infer, estimate, or use outside knowledge.
2. If a field is not present in the text, its value MUST be null.
3. Do not include any commentary, ranking, or comparison language anywhere in your output.

Respond with JSON only, exactly these keys:
{"nav_value": number or null, "nav_date": string or null, "aum_value": string or null, "exit_load_text": string or null}
"""


async def fetch_page_text(url: str) -> str:
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, follow_redirects=True)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style"]):
            tag.decompose()
        return soup.get_text(separator=" ", strip=True)


def extract_scheme_parameters(page_text: str, scheme_name: str) -> dict:
    groq_api_key = settings.GROQ_API_KEY
    empty = {"nav_value": None, "nav_date": None, "aum_value": None, "exit_load_text": None}
    if not groq_api_key:
        return empty

    llm = ChatGroq(
        model_name="llama-3.1-8b-instant",
        groq_api_key=groq_api_key,
        model_kwargs={"response_format": {"type": "json_object"}},
    )
    messages = [
        SystemMessage(content=EXTRACTION_SYSTEM_PROMPT),
        HumanMessage(content=f"Scheme: {scheme_name}\n\nPage text:\n{page_text[:8000]}"),
    ]
    try:
        response = llm.invoke(messages)
        data = json.loads(response.content)
        return {
            "nav_value": data.get("nav_value"),
            "nav_date": data.get("nav_date"),
            "aum_value": data.get("aum_value"),
            "exit_load_text": data.get("exit_load_text"),
        }
    except Exception as e:
        print(f"Scheme data extraction failed for {scheme_name}: {e}")
        return empty


def build_parameter_sentences(scheme_name: str, parsed: dict) -> list[dict]:
    sentences = []

    nav_value = parsed.get("nav_value")
    nav_date = parsed.get("nav_date")
    if nav_value is not None:
        date_part = f"As of {nav_date}, " if nav_date else ""
        sentences.append({
            "parameter": "nav",
            "text": f"{date_part}the NAV of {scheme_name} is {nav_value}.",
        })

    aum_value = parsed.get("aum_value")
    if aum_value:
        sentences.append({
            "parameter": "aum",
            "text": f"The AUM of {scheme_name} is {aum_value}.",
        })

    exit_load_text = parsed.get("exit_load_text")
    if exit_load_text:
        sentences.append({
            "parameter": "exit_load",
            "text": f"Exit load for {scheme_name}: {exit_load_text}",
        })

    return sentences
