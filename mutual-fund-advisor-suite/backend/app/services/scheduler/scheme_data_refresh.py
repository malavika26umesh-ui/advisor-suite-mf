import asyncio
import json
import os
from datetime import datetime, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.services.rag.chroma_store import SchemeLiveDataStore
from app.services.rag.scheme_data_scraper import (
    build_parameter_sentences,
    extract_scheme_parameters,
    fetch_page_text,
)

SCHEME_DATA_REFRESH_JOB_ID = "daily_scheme_data_refresh"

_SCHEME_URLS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "corpus", "sources", "scheme_urls.json"
)


def _load_scheme_urls() -> list[dict]:
    with open(_SCHEME_URLS_PATH, "r") as f:
        data = json.load(f)
    return data.get("schemes", [])


async def run_daily_scheme_data_refresh() -> None:
    schemes = _load_scheme_urls()
    store = SchemeLiveDataStore()
    fetched_at = datetime.now(timezone.utc).isoformat()

    for scheme in schemes:
        scheme_id = scheme["id"]
        scheme_name = scheme["name"]
        url = scheme["url"]
        try:
            page_text = await fetch_page_text(url)
            # extract_scheme_parameters makes a blocking, synchronous Groq API
            # call. Run it on a worker thread so it can't stall the event loop
            # and freeze every other request the server is handling.
            parsed = await asyncio.to_thread(extract_scheme_parameters, page_text, scheme_name)
            sentences = build_parameter_sentences(scheme_name, parsed)
            for sentence in sentences:
                store.upsert_parameter(
                    scheme_id=scheme_id,
                    scheme_name=scheme_name,
                    parameter=sentence["parameter"],
                    text=sentence["text"],
                    source_url=url,
                    fetched_at=fetched_at,
                )
            print(f"Refreshed {len(sentences)} parameter(s) for {scheme_name}")
        except Exception as e:
            print(f"Scheme data refresh failed for {scheme_name} ({url}): {e}")


def register_scheme_data_refresh_job(scheduler: AsyncIOScheduler) -> None:
    # 04:30 UTC = 10:00 IST (UTC+5:30).
    scheduler.add_job(
        run_daily_scheme_data_refresh,
        CronTrigger(hour=4, minute=30, timezone="UTC"),
        id=SCHEME_DATA_REFRESH_JOB_ID,
        replace_existing=True,
    )
