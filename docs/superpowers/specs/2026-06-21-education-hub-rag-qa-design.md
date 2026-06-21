# Education Hub RAG-Powered "Ask a Question" Mode — Design

## Context

The Mutual Fund Advisor Intelligence Suite has two information features with distinct purposes per the PRD:

- **F2 — FAQ Centre:** RAG-powered, reactive, answers specific factual questions about the 20 pre-selected schemes (scheme-specific facts like exit load).
- **F3 — Education Hub:** a proactive, structured, SEBI-compliant library of curated articles about mutual funds as a concept (currently a static `education_articles` table, browsable by category, with a keyword search).

During Sprint 19 production verification, it became clear that:
1. FAQ Centre's scheme-specific facts (exit load, NAV, AUM) are currently running on **mock data** (`source_urls: ["https://amc.mock.com/sid"]`) because the real per-scheme SID/KIM/factsheet PDFs were never sourced (Sprint 6B, "Real Scheme & Regulatory Corpus Sourcing," is still `PENDING`).
2. The corpus that *is* real and indexed in Pinecone — 4 general education PDFs (FAQs on MFs, Investor Awareness, Intro to MFs, Understanding MFs) plus a live Zerodha Varsity scraping tool-call — is general mutual-fund-concept content, not scheme-specific. This content is currently only reachable through FAQ Centre's pipeline when the triage classifier buckets a query as `"educational"`.
3. Education Hub's own search has no RAG/LLM component at all — it's plain SQL keyword matching (`ILIKE`) over the 39 static articles, fixed earlier in this sprint to replace a broken SQLite-only FTS5 query.

This spec covers adding a new, additive "ask a question" Q&A mode to Education Hub, reusing the FAQ pipeline's real, working components (triage classifier, Pinecone retriever, answer builder) rather than duplicating them — so Education Hub gets real RAG-powered answers for general mutual fund concept questions, without touching FAQ Centre's existing behavior and without needing the still-missing per-scheme documents.

**Out of scope for this spec** (tracked separately, to be brainstormed next): FAQ Centre's re-scoping to 4 specific facts (NAV/AUM/Exit Load/Market-Cap-as-AUM) and real-data sourcing for AUM and Exit Load.

## Goals

- Education Hub gains a new "ask a question" input that returns a real, RAG-grounded answer (with citations) for general mutual fund concept questions.
- The existing static article browsing (39 curated articles, 5 categories) and the existing keyword search stay exactly as they are — this is additive, not a replacement.
- The same compliance behavior FAQ Centre has for advice-seeking queries applies here too — a query like "should I invest in an ELSS fund?" must be deflected, not answered, regardless of which feature surfaces it.
- No scheme-specific scope-checking — Education Hub's new Q&A mode is general-concept-only, by design. Scheme-specific questions are out of scope for this feature (FAQ Centre's problem, not this one).
- Zero risk to Product Pulse's existing weekly-theme aggregation (which reads from `session_faq_log`).

## Non-Goals

- Re-scoping FAQ Centre (separate spec).
- Sourcing real per-scheme documents (separate, larger effort — Sprint 6B).
- Building a new Pinecone namespace or re-ingesting content — the existing `"education"` namespace (already populated with the 4 real PDFs) is reused as-is.
- Changing FAQ Centre's pipeline, routes, or behavior in any way.

## Architecture

A new `EducationQAService`, composed from the same underlying components `FAQPipeline` already uses — not a subclass of `FAQPipeline`, not a copy-paste duplicate, but the same shared building blocks, individually reused:

```
EducationQAService
├── TriageClassifier        (reused, unmodified — compliance bucket classification)
├── PineconeRetriever        (reused, unmodified — retrieve(query, namespace="education", top_k=5))
└── FAQAnswerBuilder         (reused, unmodified — includes the Varsity live tool-call already wired in)
```

Why not modify `FAQPipeline` itself (e.g., a `mode="education"` flag)? `FAQPipeline.query()` is tightly coupled to scheme-scope-checking (`CorpusChecker.is_in_scope()`) and scheme-filtered retrieval branches that Education Hub explicitly does not need. Branching one class on a mode flag would mean every future FAQ-specific change has to reason about whether it also affects Education Hub's mode, and vice versa — exactly the kind of unclear-boundary growth this project has already been bitten by once (Sprint 17's `os.environ` vs `settings` bug existed in three separate files because compliance-sensitive logic wasn't centralized). Keeping the compliance-critical piece (`TriageClassifier`) shared, while keeping each service's *flow* separate and simple, is the safer shape.

### Flow

```
POST /api/education/ask  { query, session_id }
        │
        ▼
TriageClassifier.classify(query, session_id)
        │
        ├─ bucket == "advice_seeking" ──► return EducationQAResponse(status="advice_deflected")
        │
        ▼
PineconeRetriever.retrieve(query, namespace="education", top_k=5)
        │
        ▼
FAQAnswerBuilder.build(query, chunks, scheme_detected=None)
        │   (includes the Varsity live tool-call, unmodified)
        ▼
status = "answered" | "no_answer" | "clarification_needed"
        │
        ▼
Write to education_query_log (NOT session_faq_log)
        │
        ▼
return EducationQAResponse(status, answer, session_log_id)
```

No `CorpusChecker.is_in_scope()` call anywhere in this flow — Education Hub's Q&A mode does not do scheme detection or out-of-scope-scheme rejection. If a user asks about a specific scheme here, the retriever will simply search the general "education" namespace and most likely return `no_answer` or a generic concept-level answer, which is acceptable: scheme-specific questions are FAQ Centre's responsibility, not this feature's.

## Components

### Backend

**`app/models/education_schemas.py`** (extend existing file):
- `EducationQARequest(query: str, session_id: str)`
- `EducationQAAnswer(answer_text: str, source_badges: list[str], source_urls: list[str], clarification_needed: bool, clarification_question: str | None)`
- `EducationQAResponse(status: Literal["answered", "advice_deflected", "no_answer", "clarification_needed"], answer: EducationQAAnswer | None, session_log_id: str | None)`

**`app/models/education_models.py`** (extend existing file):
- `EducationQueryLog` ORM model — mirrors `SessionFaqLog`'s shape (id, session_id, query, answer_text, bucket, timestamp, expires_at) but is its own table, `education_query_log`. Same 7-day `expires_at` convention as `SessionFaqLog`.

**New Alembic migration:** `add_education_query_log_table` — creates `education_query_log` with the columns above plus indexes on `session_id` and `id` (matching `session_faq_log`'s existing index pattern).

**`app/services/education/qa_service.py`** (new file):
```python
class EducationQAService:
    def __init__(self):
        self.triage_classifier = TriageClassifier()
        self.retriever = PineconeRetriever()
        self.answer_builder = FAQAnswerBuilder()

    async def ask(self, query: str, session_id: str, db) -> EducationQAResponse:
        # triage -> deflect if advice_seeking -> retrieve("education" namespace) ->
        # build answer -> log to education_query_log -> return
```

**`app/api/routes/education.py`** (extend existing file):
- `POST /api/education/ask` → `EducationQAService.ask(...)`, alongside the existing `/sections`, `/articles`, `/search`, `/articles/{slug}`, `/related/{slug}` routes (all unchanged).

### Frontend

**`EducationHub.tsx`** (extend existing page): add a new "Ask a question" input section, additive to the existing category browsing and keyword search — not replacing either. Visually consistent with FAQ Centre's pattern: reuse or closely adapt the existing `FAQAnswerCard`/`DisclaimerBlock` components for the answer display (source badges, citation links, compliance disclaimer), since the response shape is structurally similar to `FAQResponse`.

A new `educationQAService.ts` (or extend the existing `education.service.ts`) calling `POST /api/education/ask`.

## Data Flow Example

```
User types: "How does a SIP work?" into Education Hub's new ask box
  → POST /api/education/ask {"query": "How does a SIP work?", "session_id": "..."}
  → TriageClassifier buckets this as "educational" (not advice_seeking)
  → PineconeRetriever.retrieve(query, namespace="education", top_k=5)
      → retrieves real chunks from the indexed "Introduction to Mutual Funds Investing" PDF
  → FAQAnswerBuilder.build(...) generates a grounded answer, possibly also invoking
    scrape_varsity if the LLM decides a Varsity citation strengthens the answer
  → status="answered", source_badges=["AMFI", "Varsity"] (real sources, not mocked)
  → logged to education_query_log
  → returned to frontend, rendered with source badges + disclaimer
```

```
User types: "Should I invest in an ELSS fund?" into the same box
  → TriageClassifier buckets this as "advice_seeking"
  → returns EducationQAResponse(status="advice_deflected") immediately —
    no retrieval, no LLM call, same compliance behavior as FAQ Centre
```

## Error Handling

- Same patterns already proven in `FAQPipeline`: if Pinecone retrieval fails, `PineconeRetriever` already has its own fallback behavior (currently mock-on-failure for FAQ Centre too — this is an existing, separate, already-known gap, not something this spec introduces or needs to fix).
- If the triage classifier itself fails (e.g., Groq API error), this should surface as a clear 500 rather than silently miscategorizing a query as non-advice-seeking — matching how `verify_otp`/other compliance-sensitive paths in this codebase are expected to fail loudly rather than fail open.

## Testing

New `tests/test_education_qa.py` (or extend `tests/test_education.py`), mirroring `test_faq.py`'s existing compliance-deflection test pattern:
- A general concept question ("What is a SIP?") → `status == "answered"`, has source badges; the frontend renders it with the exact same primary compliance disclaimer text mandated in `ImplementationPlan.md` → "Shared Constants" (reusing the existing `DisclaimerBlock` component, not a new/different disclaimer).
- An advice-seeking question ("Should I invest in X?") → `status == "advice_deflected"`, no retrieval/LLM call made (mockable/assertable).
- Confirm `education_query_log` receives a row and `session_faq_log` does not, for an Education Hub query.
- Confirm existing `test_education.py` tests (sections, articles, search, related) still pass unmodified — this is additive, nothing in the existing static-article path changes.

## Migration & Rollout

1. Write and apply the new Alembic migration locally (SQLite dev), confirm `education_query_log` table exists.
2. Implement `EducationQAService`, schemas, route, tests — verify locally against the real local Pinecone index (already configured, same as FAQ Centre uses).
3. Frontend: add the ask-a-question UI to `EducationHub.tsx`.
4. Once verified locally end-to-end (a real concept question returns a real, non-mocked answer with citations), run the new migration against production Postgres (same pattern already used this sprint: override `DATABASE_URL` and run `alembic upgrade head` from a local machine, since Render's free tier has no Shell access).
5. Deploy via the existing Render/Vercel auto-deploy-on-push pipeline (Sprint 19's existing CI/CD).
