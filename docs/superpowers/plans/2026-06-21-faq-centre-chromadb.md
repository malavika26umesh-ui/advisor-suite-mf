# FAQ Centre ChromaDB Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the FAQ Centre's retrieval backend with ChromaDB populated by a daily scrape of scheme URLs, so the FAQ Centre answers NAV/AUM/Exit Load questions from live, daily-refreshed data instead of static Pinecone content.

**Architecture:** A new scraper+LLM-extractor pulls NAV/AUM/Exit Load text from scheme URLs, writes one upserted document per `(scheme, parameter)` into a local persistent ChromaDB collection (Chroma's default local embedding, no API key). A new `ChromaRetriever` (same interface as `PineconeRetriever`) is swapped into `FAQPipeline`. A daily 10:00 IST APScheduler job re-runs the scrape+upsert. Education Hub is untouched — it keeps using Pinecone.

**Tech Stack:** chromadb (local `PersistentClient`, default embedding function), BeautifulSoup4 (already installed), httpx (already installed), langchain-groq `ChatGroq` (already used elsewhere for LLM extraction), APScheduler (already used for the pulse job).

## Global Constraints

- Per `CLAUDE.md`: never recommend/rank/imply preference between funds — extracted sentences must be pure factual statements (a number, a date, a disclosed exit-load structure), never comparative language.
- Per `CLAUDE.md`: the Top 20 scheme list (`backend/corpus/sources/top20_schemes.json`) is locked — never invent or substitute scheme names. `scheme_urls.json` entries must use `id`/`name` values that exist in `top20_schemes.json`.
- Per `CLAUDE.md`: never accept or store PAN, Aadhaar, folio, or account numbers — not applicable to scraped scheme pages, but extractor must never echo such data if a scraped page happens to contain it (defensive null-out, not expected in practice).
- Education Hub's RAG (`app/services/education/qa_service.py`) must NOT be modified — only `FAQPipeline` swaps retrievers.
- One bad/unreachable scheme URL must never abort the daily refresh job for other schemes (matches `corpus/scripts/refresh_nav.py`'s existing defensive per-scheme try/except pattern).
- `RetrievedChunk`'s shape (`text, score, source_url, doc_type, scheme_name, page_number`) must be preserved exactly so `FAQAnswerBuilder` requires zero changes.

---

### Task 1: Add `chromadb` dependency and `scheme_urls.json` data file

**Files:**
- Modify: `mutual-fund-advisor-suite/backend/requirements.txt`
- Create: `mutual-fund-advisor-suite/backend/corpus/sources/scheme_urls.json`

**Interfaces:**
- Produces: `corpus/sources/scheme_urls.json` with shape `{"schemes": [{"id": int, "name": str, "url": str}]}` — consumed by Task 3's scraper and Task 6's scheduler job.

- [ ] **Step 1: Add chromadb to requirements.txt**

Append to `mutual-fund-advisor-suite/backend/requirements.txt`:
```
chromadb==1.5.9
```

- [ ] **Step 2: Confirm it's installed in the project venv**

`chromadb==1.5.9` was already installed into `.venv` during planning. Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pip show chromadb`
Expected: `Version: 1.5.9`. If missing, run `pip install -r requirements.txt`.

- [ ] **Step 3: Create the scheme URL config file (Top 10 pilot)**

This pilot covers the first 10 of the locked Top 20 schemes (`top20_schemes.json` ids 1–10), using the Groww URLs provided in `URL_Schemes.md`, in the same order. `id`/`name` are copied verbatim from `top20_schemes.json` — never substituted — per the locked-scheme-list rule in `CLAUDE.md`.

Create `mutual-fund-advisor-suite/backend/corpus/sources/scheme_urls.json`:
```json
{
  "schemes": [
    { "id": 1, "name": "Parag Parikh Flexi Cap Fund", "url": "https://groww.in/mutual-funds/parag-parikh-long-term-value-fund-direct-growth" },
    { "id": 2, "name": "SBI Bluechip Fund", "url": "https://groww.in/mutual-funds/sbi-large-cap-direct-plan-growth" },
    { "id": 3, "name": "ICICI Prudential Bluechip Fund", "url": "https://groww.in/mutual-funds/icici-prudential-us-bluechip-equity-fund-direct-growth" },
    { "id": 4, "name": "HDFC Flexi Cap Fund", "url": "https://groww.in/mutual-funds/hdfc-equity-fund-direct-growth" },
    { "id": 5, "name": "ICICI Prudential Value Discovery Fund", "url": "https://groww.in/mutual-funds/icici-prudential-value-direct-growth" },
    { "id": 6, "name": "Nippon India Large Cap Fund", "url": "https://groww.in/mutual-funds/nippon-india-large-cap-fund-direct-growth" },
    { "id": 7, "name": "Nippon India Small Cap Fund", "url": "https://groww.in/mutual-funds/nippon-india-small-cap-fund-direct-growth" },
    { "id": 8, "name": "SBI Small Cap Fund", "url": "https://groww.in/mutual-funds/sbi-small-midcap-fund-direct-growth" },
    { "id": 9, "name": "HDFC Mid-Cap Opportunities Fund", "url": "https://groww.in/mutual-funds/hdfc-mid-cap-fund-direct-growth" },
    { "id": 10, "name": "Kotak Emerging Equity Fund", "url": "https://groww.in/mutual-funds/kotak-emerging-equity-scheme-direct-growth" }
  ]
}
```

Schemes 11–20 have no entry yet and simply aren't covered by live data in this pilot (no error, no fabricated data) — add them the same way once their URLs are provided.

- [ ] **Step 4: Commit**

```bash
git add mutual-fund-advisor-suite/backend/requirements.txt mutual-fund-advisor-suite/backend/corpus/sources/scheme_urls.json
git commit -m "feat: add chromadb dependency and scheme_urls.json config"
```

---

### Task 2: ChromaDB store wrapper

**Files:**
- Create: `mutual-fund-advisor-suite/backend/app/services/rag/chroma_store.py`
- Test: `mutual-fund-advisor-suite/backend/tests/test_chroma_store.py`

**Interfaces:**
- Produces:
  - `SchemeLiveDataStore.__init__(self, persist_path: str = "chroma_store")`
  - `SchemeLiveDataStore.upsert_parameter(self, scheme_id: int, scheme_name: str, parameter: str, text: str, source_url: str, fetched_at: str) -> None`
  - `SchemeLiveDataStore.query(self, query_text: str, scheme_name: str | None = None, top_k: int = 5) -> dict` — returns the raw Chroma query result dict (`ids`, `documents`, `metadatas`, `distances`, each a list-of-lists per Chroma's API).
  - `SchemeLiveDataStore.count(self) -> int`
- Consumed by: Task 3 (writes via `upsert_parameter`), Task 4 (`ChromaRetriever` reads via `query`/`count`), Task 6 (scheduler calls `upsert_parameter` per scraped field).

- [ ] **Step 1: Write the failing test**

Create `mutual-fund-advisor-suite/backend/tests/test_chroma_store.py`:
```python
import shutil
import tempfile
import pytest
from app.services.rag.chroma_store import SchemeLiveDataStore


@pytest.fixture
def store():
    tmp_dir = tempfile.mkdtemp()
    s = SchemeLiveDataStore(persist_path=tmp_dir)
    yield s
    shutil.rmtree(tmp_dir, ignore_errors=True)


def test_upsert_and_query_by_scheme(store):
    store.upsert_parameter(
        scheme_id=1,
        scheme_name="Parag Parikh Flexi Cap Fund",
        parameter="exit_load",
        text="Exit load for Parag Parikh Flexi Cap Fund: 1% if redeemed within 365 days.",
        source_url="https://example.com/ppfas",
        fetched_at="2026-06-21T10:00:00Z",
    )

    result = store.query("exit load", scheme_name="Parag Parikh Flexi Cap Fund", top_k=5)

    assert len(result["documents"][0]) == 1
    assert "Exit load" in result["documents"][0][0]
    assert result["metadatas"][0][0]["scheme_name"] == "Parag Parikh Flexi Cap Fund"
    assert result["metadatas"][0][0]["parameter"] == "exit_load"
    assert result["metadatas"][0][0]["source_url"] == "https://example.com/ppfas"


def test_upsert_overwrites_same_id(store):
    store.upsert_parameter(1, "Scheme A", "nav", "old nav text", "https://a.com", "2026-06-20T10:00:00Z")
    store.upsert_parameter(1, "Scheme A", "nav", "new nav text", "https://a.com", "2026-06-21T10:00:00Z")

    assert store.count() == 1
    result = store.query("nav", scheme_name="Scheme A", top_k=5)
    assert result["documents"][0][0] == "new nav text"


def test_query_no_results_for_unknown_scheme(store):
    result = store.query("anything", scheme_name="Nonexistent Fund", top_k=5)
    assert result["documents"][0] == []
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_chroma_store.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'app.services.rag.chroma_store'`

- [ ] **Step 3: Write the implementation**

Create `mutual-fund-advisor-suite/backend/app/services/rag/chroma_store.py`:
```python
import chromadb

COLLECTION_NAME = "scheme_live_data"


class SchemeLiveDataStore:
    def __init__(self, persist_path: str = "chroma_store"):
        self.client = chromadb.PersistentClient(path=persist_path)
        self.collection = self.client.get_or_create_collection(name=COLLECTION_NAME)

    def upsert_parameter(
        self,
        scheme_id: int,
        scheme_name: str,
        parameter: str,
        text: str,
        source_url: str,
        fetched_at: str,
    ) -> None:
        doc_id = f"{scheme_id}_{parameter}"
        self.collection.upsert(
            ids=[doc_id],
            documents=[text],
            metadatas=[
                {
                    "scheme_id": scheme_id,
                    "scheme_name": scheme_name,
                    "parameter": parameter,
                    "source_url": source_url,
                    "fetched_at": fetched_at,
                }
            ],
        )

    def query(self, query_text: str, scheme_name: str | None = None, top_k: int = 5) -> dict:
        where = {"scheme_name": scheme_name} if scheme_name else None
        return self.collection.query(
            query_texts=[query_text],
            n_results=top_k,
            where=where,
        )

    def count(self) -> int:
        return self.collection.count()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_chroma_store.py -v`
Expected: PASS (3 passed)

- [ ] **Step 5: Commit**

```bash
git add mutual-fund-advisor-suite/backend/app/services/rag/chroma_store.py mutual-fund-advisor-suite/backend/tests/test_chroma_store.py
git commit -m "feat: add ChromaDB-backed scheme live data store"
```

---

### Task 3: Scheme data scraper + LLM extractor

**Files:**
- Create: `mutual-fund-advisor-suite/backend/app/services/rag/scheme_data_scraper.py`
- Test: `mutual-fund-advisor-suite/backend/tests/test_scheme_data_scraper.py`

**Interfaces:**
- Consumes: none from earlier tasks (standalone scraping/extraction logic).
- Produces:
  - `extract_scheme_parameters(page_text: str, scheme_name: str) -> dict` — calls Groq LLM, returns `{"nav_value": float | None, "nav_date": str | None, "aum_value": str | None, "exit_load_text": str | None}`.
  - `build_parameter_sentences(scheme_name: str, parsed: dict) -> list[dict]` — returns a list of `{"parameter": str, "text": str}` for each non-null field (no LLM call, pure formatting — keep separate from extraction so it's independently testable).
  - `async fetch_page_text(url: str) -> str` — fetches a URL with httpx and returns visible text via BeautifulSoup.
- Consumed by: Task 6 (scheduler job calls `fetch_page_text`, `extract_scheme_parameters`, `build_parameter_sentences` in sequence per scheme).

- [ ] **Step 1: Write the failing tests for sentence-building (no LLM/network involved)**

Create `mutual-fund-advisor-suite/backend/tests/test_scheme_data_scraper.py`:
```python
from app.services.rag.scheme_data_scraper import build_parameter_sentences


def test_build_parameter_sentences_all_fields_present():
    parsed = {
        "nav_value": 85.32,
        "nav_date": "2026-06-20",
        "aum_value": "Rs. 12,345 Cr",
        "exit_load_text": "1% if redeemed within 365 days, nil thereafter.",
    }

    sentences = build_parameter_sentences("Parag Parikh Flexi Cap Fund", parsed)

    by_param = {s["parameter"]: s["text"] for s in sentences}
    assert "nav" in by_param
    assert "85.32" in by_param["nav"]
    assert "2026-06-20" in by_param["nav"]
    assert "Parag Parikh Flexi Cap Fund" in by_param["nav"]
    assert "aum" in by_param
    assert "Rs. 12,345 Cr" in by_param["aum"]
    assert "exit_load" in by_param
    assert "1% if redeemed within 365 days" in by_param["exit_load"]
    assert len(sentences) == 3


def test_build_parameter_sentences_skips_null_fields():
    parsed = {"nav_value": 85.32, "nav_date": "2026-06-20", "aum_value": None, "exit_load_text": None}

    sentences = build_parameter_sentences("Parag Parikh Flexi Cap Fund", parsed)

    assert len(sentences) == 1
    assert sentences[0]["parameter"] == "nav"


def test_build_parameter_sentences_all_null_returns_empty():
    parsed = {"nav_value": None, "nav_date": None, "aum_value": None, "exit_load_text": None}

    sentences = build_parameter_sentences("Parag Parikh Flexi Cap Fund", parsed)

    assert sentences == []
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_scheme_data_scraper.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'app.services.rag.scheme_data_scraper'`

- [ ] **Step 3: Write the implementation**

Create `mutual-fund-advisor-suite/backend/app/services/rag/scheme_data_scraper.py`:
```python
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_scheme_data_scraper.py -v`
Expected: PASS (3 passed)

- [ ] **Step 5: Commit**

```bash
git add mutual-fund-advisor-suite/backend/app/services/rag/scheme_data_scraper.py mutual-fund-advisor-suite/backend/tests/test_scheme_data_scraper.py
git commit -m "feat: add scheme data scraper and LLM-based NAV/AUM/Exit Load extractor"
```

---

### Task 4: ChromaRetriever

**Files:**
- Create: `mutual-fund-advisor-suite/backend/app/services/rag/chroma_retriever.py`
- Test: `mutual-fund-advisor-suite/backend/tests/test_chroma_retriever.py`

**Interfaces:**
- Consumes: `SchemeLiveDataStore` from Task 2 (`upsert_parameter`, `query`, `count`); `RetrievedChunk` model from `app/services/rag/retriever.py` (already defined: `text, score, source_url, doc_type, scheme_name, page_number`).
- Produces:
  - `ChromaRetriever.__init__(self, persist_path: str = "chroma_store")`
  - `ChromaRetriever.retrieve(self, query: str, namespace: str, top_k: int = 5) -> list[RetrievedChunk]` (`namespace` accepted for interface parity, unused)
  - `ChromaRetriever.retrieve_with_scheme_filter(self, query: str, scheme_name: str, top_k: int = 5) -> list[RetrievedChunk]`
- Consumed by: Task 5 (`FAQPipeline` swaps `PineconeRetriever()` for `ChromaRetriever()`).

- [ ] **Step 1: Write the failing test**

Create `mutual-fund-advisor-suite/backend/tests/test_chroma_retriever.py`:
```python
import shutil
import tempfile
import pytest
from app.services.rag.chroma_retriever import ChromaRetriever
from app.services.rag.retriever import RetrievedChunk


@pytest.fixture
def retriever():
    tmp_dir = tempfile.mkdtemp()
    r = ChromaRetriever(persist_path=tmp_dir)
    yield r
    shutil.rmtree(tmp_dir, ignore_errors=True)


def test_retrieve_with_scheme_filter_returns_seeded_chunk(retriever):
    retriever.store.upsert_parameter(
        scheme_id=1,
        scheme_name="Parag Parikh Flexi Cap Fund",
        parameter="exit_load",
        text="Exit load for Parag Parikh Flexi Cap Fund: 1% if redeemed within 365 days.",
        source_url="https://example.com/ppfas",
        fetched_at="2026-06-21T10:00:00Z",
    )

    chunks = retriever.retrieve_with_scheme_filter("exit load", "Parag Parikh Flexi Cap Fund", top_k=5)

    assert len(chunks) == 1
    assert isinstance(chunks[0], RetrievedChunk)
    assert chunks[0].scheme_name == "Parag Parikh Flexi Cap Fund"
    assert chunks[0].doc_type == "Live Scheme Data"
    assert chunks[0].source_url == "https://example.com/ppfas"
    assert chunks[0].page_number is None


def test_retrieve_with_scheme_filter_falls_back_to_mock_when_empty(retriever):
    chunks = retriever.retrieve_with_scheme_filter("exit load", "Some Fund", top_k=5)

    assert len(chunks) == 1
    assert chunks[0].doc_type == "Live Scheme Data"


def test_retrieve_general_falls_back_to_mock_when_empty(retriever):
    chunks = retriever.retrieve("Who won the cricket world cup?", namespace="regulatory", top_k=5)

    assert len(chunks) == 1
    assert chunks[0].doc_type == "Live Scheme Data"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_chroma_retriever.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'app.services.rag.chroma_retriever'`

- [ ] **Step 3: Write the implementation**

Create `mutual-fund-advisor-suite/backend/app/services/rag/chroma_retriever.py`:
```python
from app.services.rag.chroma_store import SchemeLiveDataStore
from app.services.rag.retriever import RetrievedChunk

MOCK_CHUNK = RetrievedChunk(
    text="Mock factual answer about mutual funds. Exit load is 1%.",
    score=0.9,
    source_url="https://amc.mock.com/sid",
    doc_type="Live Scheme Data",
    scheme_name="Parag Parikh Flexi Cap Fund",
    page_number=None,
)


class ChromaRetriever:
    def __init__(self, persist_path: str = "chroma_store"):
        self.store = SchemeLiveDataStore(persist_path=persist_path)

    def retrieve(self, query: str, namespace: str, top_k: int = 5) -> list[RetrievedChunk]:
        return self._do_retrieve(query, scheme_name=None, top_k=top_k)

    def retrieve_with_scheme_filter(self, query: str, scheme_name: str, top_k: int = 5) -> list[RetrievedChunk]:
        return self._do_retrieve(query, scheme_name=scheme_name, top_k=top_k)

    def _do_retrieve(self, query: str, scheme_name: str | None, top_k: int) -> list[RetrievedChunk]:
        if self.store.count() == 0:
            return [MOCK_CHUNK]

        try:
            result = self.store.query(query, scheme_name=scheme_name, top_k=top_k)
        except Exception as e:
            print(f"Chroma retrieval failed ({e}); falling back to mock results.")
            return [MOCK_CHUNK]

        documents = result.get("documents", [[]])[0]
        if not documents:
            return [MOCK_CHUNK]

        metadatas = result.get("metadatas", [[]])[0]
        distances = result.get("distances", [[]])[0] if result.get("distances") else [0.0] * len(documents)

        chunks = []
        for text, metadata, distance in zip(documents, metadatas, distances):
            chunks.append(
                RetrievedChunk(
                    text=text,
                    score=1.0 - distance,
                    source_url=metadata.get("source_url", ""),
                    doc_type="Live Scheme Data",
                    scheme_name=metadata.get("scheme_name"),
                    page_number=None,
                )
            )
        return chunks
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_chroma_retriever.py -v`
Expected: PASS (3 passed)

- [ ] **Step 5: Commit**

```bash
git add mutual-fund-advisor-suite/backend/app/services/rag/chroma_retriever.py mutual-fund-advisor-suite/backend/tests/test_chroma_retriever.py
git commit -m "feat: add ChromaRetriever with mock fallback for empty collection"
```

---

### Task 5: Swap FAQPipeline to ChromaRetriever

**Files:**
- Modify: `mutual-fund-advisor-suite/backend/app/services/rag/pipeline.py:5,15`

**Interfaces:**
- Consumes: `ChromaRetriever` from Task 4.
- Produces: no new interface — `FAQPipeline.query()` signature and `FAQResponse` shape are unchanged. Existing `tests/test_faq.py` is the verification surface for this task.

- [ ] **Step 1: Confirm the existing FAQ test suite passes before changing anything (baseline)**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_faq.py -v`
Expected: PASS (all tests pass, establishing the baseline this task must not break)

- [ ] **Step 2: Swap the retriever import and instantiation**

In `mutual-fund-advisor-suite/backend/app/services/rag/pipeline.py`, change line 5 from:
```python
from app.services.rag.retriever import PineconeRetriever
```
to:
```python
from app.services.rag.chroma_retriever import ChromaRetriever
```

And change line 15 from:
```python
        self.retriever = PineconeRetriever()
```
to:
```python
        self.retriever = ChromaRetriever()
```

- [ ] **Step 3: Run the FAQ test suite to verify nothing broke**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_faq.py -v`
Expected: PASS (same tests pass as the Step 1 baseline — `ChromaRetriever`'s mock fallback behaves equivalently to `PineconeRetriever`'s for an empty/unconfigured backend)

- [ ] **Step 4: Commit**

```bash
git add mutual-fund-advisor-suite/backend/app/services/rag/pipeline.py
git commit -m "feat: swap FAQPipeline retriever from Pinecone to ChromaDB"
```

---

### Task 6: Daily scheme data refresh scheduler job

**Files:**
- Create: `mutual-fund-advisor-suite/backend/app/services/scheduler/scheme_data_refresh.py`
- Modify: `mutual-fund-advisor-suite/backend/app/services/scheduler/cron_jobs.py:26-28`
- Test: `mutual-fund-advisor-suite/backend/tests/test_scheme_data_refresh.py`

**Interfaces:**
- Consumes: `fetch_page_text`, `extract_scheme_parameters`, `build_parameter_sentences` from Task 3; `SchemeLiveDataStore.upsert_parameter` from Task 2.
- Produces:
  - `async run_daily_scheme_data_refresh() -> None`
  - `register_scheme_data_refresh_job(scheduler) -> None`
- Consumed by: `cron_jobs.py`'s `start_scheduler()`.

- [ ] **Step 1: Write the failing test**

Create `mutual-fund-advisor-suite/backend/tests/test_scheme_data_refresh.py`:
```python
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_scheme_data_refresh.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'app.services.scheduler.scheme_data_refresh'`

- [ ] **Step 3: Write the implementation**

Create `mutual-fund-advisor-suite/backend/app/services/scheduler/scheme_data_refresh.py`:
```python
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
            parsed = extract_scheme_parameters(page_text, scheme_name)
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest tests/test_scheme_data_refresh.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Register the job in cron_jobs.py**

In `mutual-fund-advisor-suite/backend/app/services/scheduler/cron_jobs.py`, change:
```python
    from app.services.pulse.scheduler import register_pulse_job
    register_pulse_job(scheduler)
```
to:
```python
    from app.services.pulse.scheduler import register_pulse_job
    register_pulse_job(scheduler)

    from app.services.scheduler.scheme_data_refresh import register_scheme_data_refresh_job
    register_scheme_data_refresh_job(scheduler)
```

- [ ] **Step 6: Verify the app starts and both jobs are registered**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && python -c "from app.services.scheduler.cron_jobs import start_scheduler; start_scheduler()"`
Expected: prints `[scheduler] started with jobs: ['delete_expired_transcripts', 'weekly_product_pulse', 'daily_scheme_data_refresh']` (order may vary)

- [ ] **Step 7: Commit**

```bash
git add mutual-fund-advisor-suite/backend/app/services/scheduler/scheme_data_refresh.py mutual-fund-advisor-suite/backend/app/services/scheduler/cron_jobs.py mutual-fund-advisor-suite/backend/tests/test_scheme_data_refresh.py
git commit -m "feat: register daily 10:00 IST scheme data refresh job"
```

---

### Task 7: Full FAQ test suite regression check

**Files:**
- None created or modified — verification-only task.

**Interfaces:**
- Consumes: all of Tasks 1–6.
- Produces: nothing — confirms the migration didn't regress any existing behavior.

- [ ] **Step 1: Run the full backend test suite**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && pytest -v`
Expected: PASS — all tests pass, including `tests/test_faq.py`, `tests/test_chroma_store.py`, `tests/test_scheme_data_scraper.py`, `tests/test_chroma_retriever.py`, `tests/test_scheme_data_refresh.py`, and every pre-existing test file (`test_education_qa.py`, `test_pulse.py`, `test_advisor.py`, `test_scheduler.py`, `test_compliance.py`).

`pytest-asyncio==0.23.7` is already installed in `.venv` and already used by `tests/test_pulse.py`/`tests/test_advisor.py` via `@pytest.mark.asyncio`, so Task 6's async tests need no new setup.

---

### Task 8: Manual pilot run against the real Top 10 URLs

**Files:**
- None created or modified — this exercises the real pipeline end-to-end against the live `groww.in` URLs from Task 1, instead of waiting for the next scheduled 10:00 IST run.

**Interfaces:**
- Consumes: `run_daily_scheme_data_refresh()` from Task 6, `scheme_urls.json` from Task 1.
- Produces: a populated `chroma_store/` collection with real data for the 10 piloted schemes, used to manually sanity-check the FAQ Centre end-to-end.

- [ ] **Step 1: Confirm `GROQ_API_KEY` is set**

Run: `cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && python -c "from app.core.config import settings; print(bool(settings.GROQ_API_KEY))"`
Expected: `True`. If `False`, the extractor (Task 3) will return all-null fields for every scheme and no documents will be written — set `GROQ_API_KEY` in `.env` before continuing.

- [ ] **Step 2: Run the refresh once manually**

Run:
```bash
cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && python -c "import asyncio; from app.services.scheduler.scheme_data_refresh import run_daily_scheme_data_refresh; asyncio.run(run_daily_scheme_data_refresh())"
```
Expected: one `Refreshed N parameter(s) for <scheme>` line per scheme (or a `Scheme data refresh failed for ...` line if `groww.in` blocks the scrape or changes markup — that scheme is skipped, the run continues for the rest, no exception propagates).

- [ ] **Step 3: Inspect what landed in Chroma**

Run:
```bash
cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && python -c "
from app.services.rag.chroma_store import SchemeLiveDataStore
store = SchemeLiveDataStore()
print('Total documents:', store.count())
result = store.collection.get()
for doc_id, meta in zip(result['ids'], result['metadatas']):
    print(doc_id, '->', meta)
"
```
Expected: up to 30 documents (10 schemes x up to 3 parameters), each with `scheme_name`, `parameter`, `source_url`, `fetched_at` metadata. Some schemes may have fewer than 3 if the LLM couldn't find a given field on the page — this is expected behavior, not a bug, per the "never fabricate" rule.

- [ ] **Step 4: Sanity-check one real FAQ query through the live pipeline**

Run:
```bash
cd mutual-fund-advisor-suite/backend && source .venv/Scripts/activate && python -c "
import asyncio
from app.services.rag.pipeline import FAQPipeline
from app.core.database import async_session_maker

async def main():
    pipeline = FAQPipeline()
    async with async_session_maker() as db:
        response = await pipeline.query('What is the exit load for SBI Bluechip Fund?', 'manual-test-session', db)
        print(response.status)
        print(response.answer.answer_text if response.answer else None)
        print(response.answer.source_urls if response.answer else None)

asyncio.run(main())
"
```
Expected: `status` is `answered`, `answer_text` references the real exit load text scraped from the SBI Bluechip Fund's groww.in page (not the "We don't have verified information..." fallback), and `source_urls` contains the real groww.in URL.

- [ ] **Step 5: Note any scraping gaps for follow-up**

If Step 2 logged any `Scheme data refresh failed` lines, or Step 3 shows fewer than 3 parameters for a scheme, note which scheme/field is missing — this is the signal for whether `groww.in`'s markup needs a scraper tweak (e.g. JS-rendered content `httpx`+`BeautifulSoup` can't see) before expanding past the Top 10 pilot to all 20 schemes. No code change is required as part of this task; this step is diagnostic only.
