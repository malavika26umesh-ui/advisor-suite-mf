# FAQ Centre: ChromaDB-backed live NAV/AUM/Exit Load data

## Context

The FAQ Centre's stated purpose is to show live, daily-updated NAV, AUM, and Exit Load data for selected mutual fund schemes. The current implementation (`app/services/rag/pipeline.py`) retrieves from Pinecone over `education`/`regulatory` namespaces or a scheme-filtered namespace, which doesn't match this purpose — there's no live-data ingestion behind it.

This replaces the FAQ Centre's retrieval backend with ChromaDB, populated by a daily scrape of user-provided scheme URLs. **Education Hub's RAG (`app/services/education/qa_service.py`) is out of scope and keeps using Pinecone** — only `FAQPipeline` changes.

## Scope

In scope:
- New `corpus/sources/scheme_urls.json` mapping scheme → URL (subset of Top 20, grows as URLs are provided).
- Scraper + LLM-based extractor for NAV, AUM, Exit Load from each URL.
- ChromaDB persistent local store, one upserted document per `(scheme, parameter)`.
- New `ChromaRetriever` swapped into `FAQPipeline` in place of `PineconeRetriever`.
- Daily 10:00 IST (04:30 UTC) APScheduler job that re-scrapes and re-upserts.

Out of scope:
- Education Hub retrieval (`qa_service.py`) — untouched, stays on Pinecone.
- Regulatory/general FAQ content not tied to NAV/AUM/Exit Load — if no parameter is found for a scheme, no document is written for it; the FAQ pipeline's existing "no answer" / out-of-scope / advice-deflection paths handle the gap, unchanged.
- Removing the Pinecone dependency/package from the project (left in place for Education Hub).

## Architecture

### 1. `corpus/sources/scheme_urls.json`
```json
{
  "schemes": [
    { "id": 1, "name": "Parag Parikh Flexi Cap Fund", "url": "https://..." }
  ]
}
```
Same id space as `top20_schemes.json` (`id` matches `top20_schemes.json`'s scheme id). Starts with whichever URLs are provided; schemes without a URL here simply aren't covered by live data yet.

### 2. `app/services/rag/scheme_data_scraper.py`
- `httpx.AsyncClient` fetches each URL's HTML (timeout + per-scheme try/except — one bad URL must not abort the run, matching `refresh_nav.py`'s defensive style).
- `BeautifulSoup` strips HTML to visible text (script/style stripped).
- Page text is sent to the existing Groq LLM (`ChatGroq`, `llama-3.1-8b-instant`, JSON response mode — same construction as `answer_builder.py`/`corpus_refresher.py`) with a system prompt instructing it to extract:
  - `nav_value` (number or null), `nav_date` (string or null)
  - `aum_value` (string incl. unit, e.g. "₹12,345 Cr", or null)
  - `exit_load_text` (full exit load structure as stated on the page, or null)
  - Rule: never invent a value not present in the page text; null if absent.
- For each non-null field, build one natural-language factual sentence with the scheme name and as-of date/context baked in (this sentence is what gets embedded — not raw HTML), e.g.:
  - `"As of {nav_date}, the NAV of {scheme_name} is ₹{nav_value}."`
  - `"The AUM of {scheme_name} is {aum_value}."`
  - `"Exit load for {scheme_name}: {exit_load_text}"`
- Returns a list of `{scheme_id, scheme_name, parameter, text, source_url, fetched_at}` dicts (only for fields actually found).

### 3. `app/services/rag/chroma_store.py`
- `chromadb.PersistentClient(path="chroma_store/")` (path relative to backend working dir, alongside `pulse_data.csv` etc.).
- Collection `scheme_live_data`, created with `get_or_create_collection`, using Chroma's default local embedding function (ONNX MiniLM, no API key, offline).
- `upsert_parameter(scheme_id, scheme_name, parameter, text, source_url, fetched_at)`: id = `f"{scheme_id}_{parameter}"`, metadata = `{scheme_name, parameter, source_url, fetched_at}`, document = `text`. Upsert (not add) so the daily job overwrites in place — collection size stays bounded at (number of schemes × 3 parameters), no stale duplicates accumulate.
- `query(query_text, scheme_name=None, top_k=5)`: Chroma `.query()`, with `where={"scheme_name": scheme_name}` when given.

### 4. `app/services/rag/chroma_retriever.py`
- `ChromaRetriever` class with the same two public methods as `PineconeRetriever` (`retrieve`, `retrieve_with_scheme_filter`), returning the same `RetrievedChunk` pydantic model (text, score, source_url, doc_type, scheme_name, page_number) so `FAQAnswerBuilder` needs no changes.
- `doc_type` is set to `"Live Scheme Data"` for these chunks (distinguishes them from SID/KIM-sourced chunks in the answer's source badges).
- `page_number` is always `None` (not page-based content).
- `namespace` param accepted for interface compatibility but ignored — Chroma has one collection here.

### 5. `FAQPipeline` change (`app/services/rag/pipeline.py`)
- `self.retriever = ChromaRetriever()` instead of `PineconeRetriever()`. No other pipeline logic changes — corpus check, triage classification, advice deflection, answer building, session logging, education-article linking all stay as-is.

### 6. Daily scheduler job
- New `app/services/scheduler/scheme_data_refresh.py` (or colocated function near `pulse/scheduler.py`'s pattern):
  - `run_daily_scheme_data_refresh()`: loads `scheme_urls.json`, scrapes+extracts each scheme (errors per-scheme logged and skipped, never raised), upserts each found parameter into the Chroma store.
  - `register_scheme_data_refresh_job(scheduler)`: `scheduler.add_job(..., CronTrigger(hour=4, minute=30, timezone="UTC"), id="daily_scheme_data_refresh", replace_existing=True)`.
- Registered alongside the existing pulse job wherever `AsyncIOScheduler` is started in `app/main.py`.

## Compliance

Extracted sentences are pure factual statements (a number, a date, a disclosed exit-load structure) — no ranking, no comparison, no recommendation language. This doesn't interact with the out-of-scope / advice-deflection branches already in `pipeline.py`, which run before retrieval.

## Testing

- Unit test the extractor against a fixture HTML page (mocked Groq response) — verifies it builds correct sentences and skips null fields.
- Unit test `ChromaRetriever` against a Chroma collection seeded with known documents — verifies scheme-filtered queries return the right chunks.
- Integration test: `FAQPipeline.query()` for a known scheme + parameter (e.g. "What is the exit load for X?") returns an `answered` status sourced from the live-data doc_type, using a pre-seeded test Chroma collection (no network calls in tests).
- Scheduler job test: mock the scraper, assert `chroma_store.upsert_parameter` is called once per discovered field per scheme, and that one scheme raising an exception doesn't stop the others.

## Dependencies

Add to `requirements.txt`: `chromadb`, `beautifulsoup4` (httpx and the Groq/langchain stack are already present).
