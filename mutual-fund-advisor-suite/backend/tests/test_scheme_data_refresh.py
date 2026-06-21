import asyncio
import threading
from unittest.mock import AsyncMock, patch
import pytest
from app.services.scheduler.scheme_data_refresh import run_daily_scheme_data_refresh


@pytest.mark.asyncio
async def test_refresh_upserts_one_call_per_discovered_field():
    schemes_payload = {"schemes": [{"id": 1, "name": "Scheme A", "url": "https://a.com"}]}
    parsed = {"nav_value": 100.0, "nav_date": "2026-06-21", "aum_value": None, "exit_load_text": "1% within 1 year."}

    with patch("app.services.scheduler.scheme_data_refresh._load_scheme_urls", return_value=schemes_payload["schemes"]), \
         patch("app.services.scheduler.scheme_data_refresh.fetch_page_text", new=AsyncMock(return_value="page text")), \
         patch("app.services.scheduler.scheme_data_refresh.extract_scheme_parameters", return_value=parsed), \
         patch("app.services.scheduler.scheme_data_refresh.SchemeLiveDataStore") as mock_store_cls:
        mock_store = mock_store_cls.return_value
        await run_daily_scheme_data_refresh()

        assert mock_store.upsert_parameter.call_count == 2
        called_params = {call.kwargs["parameter"] for call in mock_store.upsert_parameter.call_args_list}
        assert called_params == {"nav", "exit_load"}


@pytest.mark.asyncio
async def test_refresh_skips_failing_scheme_and_continues():
    schemes_payload = [
        {"id": 1, "name": "Scheme A", "url": "https://a.com"},
        {"id": 2, "name": "Scheme B", "url": "https://b.com"},
    ]
    parsed = {"nav_value": 50.0, "nav_date": "2026-06-21", "aum_value": None, "exit_load_text": None}

    async def fetch_side_effect(url):
        if url == "https://a.com":
            raise Exception("network error")
        return "page text"

    with patch("app.services.scheduler.scheme_data_refresh._load_scheme_urls", return_value=schemes_payload), \
         patch("app.services.scheduler.scheme_data_refresh.fetch_page_text", new=AsyncMock(side_effect=fetch_side_effect)), \
         patch("app.services.scheduler.scheme_data_refresh.extract_scheme_parameters", return_value=parsed), \
         patch("app.services.scheduler.scheme_data_refresh.SchemeLiveDataStore") as mock_store_cls:
        mock_store = mock_store_cls.return_value
        await run_daily_scheme_data_refresh()

        assert mock_store.upsert_parameter.call_count == 1
        assert mock_store.upsert_parameter.call_args.kwargs["scheme_name"] == "Scheme B"


@pytest.mark.asyncio
async def test_refresh_runs_extraction_off_the_event_loop_thread():
    schemes_payload = [{"id": 1, "name": "Scheme A", "url": "https://a.com"}]
    main_thread = threading.current_thread()
    extraction_thread = {}

    def capture_thread_extract(page_text, scheme_name):
        extraction_thread["thread"] = threading.current_thread()
        return {"nav_value": 1.0, "nav_date": "2026-06-21", "aum_value": None, "exit_load_text": None}

    with patch("app.services.scheduler.scheme_data_refresh._load_scheme_urls", return_value=schemes_payload), \
         patch("app.services.scheduler.scheme_data_refresh.fetch_page_text", new=AsyncMock(return_value="page text")), \
         patch("app.services.scheduler.scheme_data_refresh.extract_scheme_parameters", side_effect=capture_thread_extract), \
         patch("app.services.scheduler.scheme_data_refresh.SchemeLiveDataStore"):
        await run_daily_scheme_data_refresh()

    # extract_scheme_parameters makes a blocking, synchronous network call
    # (ChatGroq.invoke). If it were called directly instead of via
    # asyncio.to_thread, it would run on the event loop's own thread and
    # block every other request the server is handling for the call's full
    # duration -- in production, this freezes the entire site during the
    # daily refresh. Running it on a worker thread is what we're verifying.
    assert extraction_thread["thread"] is not main_thread
