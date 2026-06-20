# Starting Prompts — Mutual Fund Advisor Intelligence Suite
# One prompt per Claude Code session (Sprint 1 through Sprint 20)

---

## HOW TO USE THIS FILE

1. Copy the **entire prompt block** for the sprint you are starting.
2. Paste it as your **first message** in a new Claude Code session.
3. Do NOT summarise or paraphrase — paste the full prompt so Claude Code has complete context.
4. At the END of each session, Claude Code will run that sprint's test cases from `TEST_CASES.md`, report a pass/fail/missed summary, and only then update `ImplementationPlan.md` with the sprint's completed work and handover notes before you close the session. A sprint is not allowed to be marked complete while any of its tests are failing — if you see a failing test reported, do not move on to the next sprint's prompt until it's resolved.

---

## SPRINT 1 STARTING PROMPT

```
You are Claude Code working on a greenfield project: the Mutual Fund Advisor Intelligence Suite, an AI-powered Indian fintech web platform for retail investors and SEBI-registered investment advisors.

Your task for this session is Sprint 1: Project Scaffold & Environment Setup.

READ FIRST: The full project context is in these two files in the working directory:
- PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md (product requirements)
- ImplementationPlan.md (this is your master plan — read the entire file before starting)

SPRINT 1 GOAL: Create the full monorepo skeleton so that both the React frontend (port 5173) and the Python FastAPI backend (port 8000) run locally with hot-reload. No feature code in this sprint — infrastructure only.

TECH STACK:
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS 3 + Zustand + React Router v6 + Axios + @phosphor-icons/react
- Backend: Python 3.11 + FastAPI + SQLAlchemy 2.0 + Alembic + LangChain + Pinecone + pdfplumber + SendGrid + APScheduler
- State: Zustand (frontend), SQLite dev / PostgreSQL prod

EXACT DELIVERABLES (from ImplementationPlan.md Sprint 1):
1. Monorepo root: mutual-fund-advisor-suite/ with .gitignore, .env.example (listing all env vars), README.md
2. Frontend: scaffold with Vite react-ts template, all packages installed, tailwind.config.ts with ALL design tokens from DESIGN.md §2 (colors, fonts, spacing), vite.config.ts with /api proxy to :8000, src/router.tsx with placeholder routes, src/utils/compliance.ts with the 4 exact compliance text strings from PRD §4.3
3. Backend: app/main.py (FastAPI + CORS + /health endpoint), app/core/config.py (pydantic-settings), app/core/database.py (SQLAlchemy async), all 6 route stub files (triage/faq/education/scheduler/advisor/pulse) each returning {"message": "not yet implemented"}, requirements.txt with exact versions from ImplementationPlan.md
4. corpus/sources/top20_schemes.json: all 20 schemes from PRD Appendix A with name, category, AMC, and aliases array
5. .github/workflows/ci.yml: lint + typecheck + pytest on PR

CRITICAL COMPLIANCE CONSTANTS (put these exact strings in src/utils/compliance.ts):
- PRIMARY_DISCLAIMER: "This is factual information sourced from official AMFI/SEBI/AMC documents. It does not constitute investment advice. For personalised guidance, speak to a SEBI-registered investment advisor."
- PERFORMANCE_DISCLAIMER: "Past performance is not indicative of future returns. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing."
- ADVISOR_REFERRAL: "Need personalised advice? Book a call with a SEBI-registered advisor on this platform."

DEFINITION OF DONE: Both servers run (npm run dev, uvicorn app.main:app --reload), /health returns 200, tailwind.config.ts has all design tokens.

AT THE END OF THIS SESSION, before closing:
1. Open TEST_CASES.md and run every test case under "SPRINT 1" (TC-1.1 through TC-1.8). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
2. Report a one-line summary of the results, e.g. "8/8 passed" or "6/8 passed — TC-1.4 and TC-1.7 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
3. Mark Sprint 1 as COMPLETED in the Sprint Progress Log table in ImplementationPlan.md
4. Fill in the "Completed In This Sprint" and "Handover Notes" sections under Sprint 1 in ImplementationPlan.md
5. List every file you created

Do not start Sprint 2 work. This session ends when Sprint 1's tests all pass and ImplementationPlan.md is updated.
```

---

## SPRINT 2 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — specifically the Sprint 1 Handover Notes and the Sprint 2 specification. The Sprint 1 handover notes will tell you exactly what was built and any decisions made.

SPRINT 2 GOAL: Build ALL reusable UI components from DESIGN.md §5. These components are imported by every future sprint — getting them right here prevents rework in every later session.

CONTEXT: The project is a React 18 + TypeScript + Tailwind CSS frontend. All design tokens (colors, fonts, spacing) are already in tailwind.config.ts from Sprint 1. The project lives in mutual-fund-advisor-suite/frontend/.

COMPONENTS TO BUILD (all in frontend/src/components/ui/):
1. Button.tsx — 4 variants: primary (saffron #E8922A), secondary (navy outline), ghost (teal text), destructive (red). Loading spinner state. TypeScript props interface.
2. Card.tsx — 3 variants: default (white shadow), feature (query builder intent cards with icon slot + hover border), brief (navy left accent border for advisor cards)
3. SourceBadge.tsx — pill badge, #EFF6FF bg, #1E40AF text, always a clickable link with ArrowSquareOut icon from @phosphor-icons/react, opens new tab
4. DisclaimerBlock.tsx — MUST use exact compliance strings from src/utils/compliance.ts. Never hardcode disclaimer text. 2 variants: primary, performance. Optional "Book a call" CTA ghost link prop.
5. ComplianceDeflectionCard.tsx — amber card (#FEF3C7 bg, #D97706 border), ShieldCheck icon, advice-seeking deflection state
6. OutOfScopeCard.tsx — gray DASHED border card (visually distinct from ComplianceDeflectionCard — different visual language: neutral/gray vs amber/warning), for corpus coverage limitation messaging
7. TopicPill.tsx — pill buttons, selected = navy filled, unselected = white with neutral border
8. StepIndicator.tsx — n-step horizontal indicator, filled navy for active, green checkmark for complete, outline for inactive, connecting lines
9. BookingCodeDisplay.tsx — JetBrains Mono 28px bold #1B3F7E, bordered box, copy-to-clipboard with 2s success state
10. VoiceMicButton.tsx — 72px circle, 3 states: idle/listening/processing. Listening state has CSS keyframe pulsing rings animation. Separate Waveform sub-component (5 animated bars).
11. Input.tsx — 44px height, teal focus ring, label above, error message below via aria-describedby
12. Textarea.tsx — extends Input with maxLength + character counter
13. Skeleton.tsx — shimmer animation via CSS keyframes in tailwind.config.ts
14. Toast.tsx + useToast hook — slide-up from bottom-right, 3 variants
15. Modal.tsx — portal, focus trap, ESC key close, backdrop click close
16. Badge.tsx — 4 status variants for meeting queue: confirmed (green), pending (amber), cancelled (red), completed (gray)
17. src/components/ui/index.ts — barrel export for all components

IMPORTANT RULES:
- DisclaimerBlock MUST import from src/utils/compliance.ts — never hardcode the disclaimer text string
- OutOfScopeCard must be visually distinct from ComplianceDeflectionCard (gray dashed vs amber solid — they represent different things: corpus limitation vs compliance refusal)
- All Tailwind classes must reference design tokens from tailwind.config.ts, not raw hex values
- No `any` TypeScript types anywhere

AT THE END OF THIS SESSION, before closing:
1. Open TEST_CASES.md and run every test case under "SPRINT 2" (TC-2.1 through TC-2.9). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
2. Report a one-line summary of the results, e.g. "9/9 passed" or "7/9 passed — TC-2.5 and TC-2.8 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
3. Mark Sprint 2 as COMPLETED in the Sprint Progress Log in ImplementationPlan.md
4. Fill in Sprint 2 Handover Notes with: any component API decisions, any deviations from the plan, any known issues
5. Do not start Sprint 3 work
```

---

## SPRINT 3 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprint 1 and Sprint 2 Handover Notes, then the Sprint 3 specification. Check what was built in previous sprints.

SPRINT 3 GOAL: Build the full public-facing Home page, NavBar, Footer, and the PageLayout wrapper used by all investor-facing pages.

CONTEXT: All UI components are built in frontend/src/components/ui/ (from Sprint 2). Use them — do not re-implement buttons, cards, badges, or disclaimer blocks.

WHAT TO BUILD:

1. frontend/src/components/layout/NavBar.tsx
   - #1B3F7E background, 64px height, position sticky, z-50
   - Logo: white "AdvisorSuite MF" + Phosphor ChartBar icon
   - Desktop nav: "FAQ Centre" → /faq | "Education Hub" → /education | "Book Advisor Call" → /schedule (saffron pill button)
   - Advisor login: far right, 13px white text → /advisor/login
   - Mobile: hamburger, slide-in drawer with stacked links
   - Active link: underline or accent indicator using useLocation()

2. frontend/src/components/layout/Footer.tsx
   - #1B3F7E bg, white text
   - Logo left, nav links center, privacy + sources right
   - Full compliance text at bottom: 12px, white 60% opacity (import from compliance.ts)

3. frontend/src/components/layout/PageLayout.tsx
   - NavBar + <Outlet /> + Footer wrapper
   - Used as a React Router layout route

4. frontend/src/pages/Home.tsx — Full landing page:
   - Hero: 2-column (55/45 desktop, stacked mobile). Left: "SEBI-Compliant · AMFI-Grounded" tag chip, H1 headline "Clear, factual information about mutual funds — no advice, no guesswork.", subheadline, two CTAs ("Start with a Question" → /query-builder, "Browse Education Hub" → /education), trust bar (3 items: source-cited answers, no investment advice, SEBI-compliant)
   - "How It Works": 3 cards (Ask Question / Learn / Book Advisor) with icons
   - Featured Topics Strip: #F0FAFB background, 4 clickable topic pills that navigate to /faq?topic=[topic]
   - Compliance footer strip: #FFF8E1 background, compliance text (IMPORT from compliance.ts — exact PRD text)

5. frontend/src/pages/Sources.tsx
   - Static sources/transparency page
   - Section headings for AMFI, SEBI, AMC documents, mfapi.in
   - Table of Top 20 schemes (import top20_schemes.json or fetch from /api/faq/covered-schemes)
   - Source refresh policy text

6. frontend/src/router.tsx — Update to wire PageLayout as layout route around all investor-facing routes

MOBILE REQUIREMENT: Home page must be fully responsive at 375px minimum. Hero stacks to single column. 3 cards stack vertically.

AT THE END OF THIS SESSION, before closing:
1. Open TEST_CASES.md and run every test case under "SPRINT 3" (TC-3.1 through TC-3.8). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
2. Report a one-line summary of the results, e.g. "8/8 passed" or "5/8 passed — TC-3.2, TC-3.5, TC-3.6 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
3. Mark Sprint 3 COMPLETED in ImplementationPlan.md Sprint Progress Log
4. Fill Sprint 3 Handover Notes
5. Do not start Sprint 4
```

---

## SPRINT 4 STARTING PROMPT

```
You are Antigravity continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprint 1–3 Handover Notes, then Sprint 4 specification. The frontend is built but Sprint 4 is entirely backend.

SPRINT 4 GOAL: Build the F4 Triage & Routing Engine — the compliance gatekeeper that classifies every investor query before it reaches the FAQ Centre, Education Hub, or Advisor booking.

CONTEXT: Work is in mutual-fund-advisor-suite/backend/. FastAPI app is already scaffolded. The Top 20 scheme list is at corpus/sources/top20_schemes.json.

WHAT TO BUILD (all in backend/):

1. app/services/triage/signals.py
   - ADVICE_PHRASE_SIGNALS: list of exact phrases that ALWAYS trigger advice-seeking classification (no LLM needed): ["should i", "is it good", "recommend", "best for me", "what should i do", "will it give returns", "is this safe for me", "is this good", "which is better for me", "what do you suggest"]
   - PERSONAL_SITUATION_PATTERNS: regex patterns for rupee amounts (₹\d+), age mentions, goal mentions, third-party portfolio ("my father", "my mother", etc.)
   - COMPARISON_WITH_INTENT_PATTERNS: regex for fund A vs fund B + selection intent

2. app/services/triage/classifier.py
   - TriageResult dataclass: bucket (factual|educational|advice_seeking|edge), confidence (float), routing_destination, scheme_out_of_scope (bool), scheme_name_detected (str|None), escalation_flag (bool, True if confidence < 0.75)
   - TriageClassifier.classify(query: str, session_id: str) -> TriageResult
   - CLASSIFICATION ORDER (strictly in this order):
     a. scheme scope check: parse query for scheme names, check against top20_schemes.json (including aliases), if non-Top-20 scheme detected → return immediately with scheme_out_of_scope=True
     b. hard-coded signal check: check against signals.py patterns → if match, return advice_seeking with confidence 1.0 (NO LLM call)
     c. LLM classification: call Gemini 1.5 Pro with structured prompt for factual/educational/edge classification + confidence score
     d. escalation flag: if confidence < 0.75, set escalation_flag=True
   - LLM prompt must ONLY classify factual/educational/edge — never classify advice_seeking (that is done by hard-coded signals before LLM is called)

3. app/services/triage/logger.py
   - Log every classification to triage_log DB table

4. Database: triage_log table migration
   - Fields: id, session_id, query_text, bucket, confidence, scheme_detected, out_of_scope, escalation_flag, timestamp

5. app/api/routes/triage.py
   - POST /api/triage/classify → body: {query: str, session_id: str} → TriageResult
   - GET /api/triage/logs → list of triage logs (used by Pulse in Sprint 15)

6. tests/test_triage.py — ALL 7 test cases MUST pass:
   - "What is the exit load for Parag Parikh Flexi Cap Fund?" → factual (Top 20 scheme: in scope)
   - "What is a flexi cap fund?" → educational
   - "Should I invest in ELSS?" → advice_seeking (signal phrase match)
   - "I'm 35 years old, should I put my savings in index funds?" → advice_seeking (personal situation regex)
   - "HDFC vs Axis which is better for me?" → advice_seeking (comparison + intent)
   - "What is the exit load for Reliance Growth Fund?" → scheme_out_of_scope=True (not in Top 20)
   - "xyzabc12345" → edge

HARD RULE: The hard-coded signal check must NEVER invoke the LLM. It is pure Python string/regex matching. This is a compliance requirement.

AT THE END OF THIS SESSION, before closing:
1. Run pytest tests/test_triage.py — all 7 tests must pass before marking complete
2. Open TEST_CASES.md and run every test case under "SPRINT 4" (TC-4.1 through TC-4.10 — these map 1:1 to the pytest cases above plus a few extra checks). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
3. Report a one-line summary, e.g. "10/10 passed" or "8/10 passed — TC-4.3 and TC-4.10 failed: [reason]". TC-4.3, 4.4, 4.5, 4.10 are P0 compliance tests — a single failure on any of these blocks the sprint regardless of the rest; fix before proceeding.
4. Mark Sprint 4 COMPLETED in ImplementationPlan.md
5. Fill Sprint 4 Handover Notes including: Gemini client setup details, any fuzzy matching decisions for scheme name detection
```

---

## SPRINT 5 STARTING PROMPT

```
You are Antigravity continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–4 Handover Notes, then Sprint 5 specification.

SPRINT 5 GOAL: Build the F1 Guided Query Builder — the investor's 3-step intent classification flow with F4 Triage integration for free-text queries.

CONTEXT: All UI components are available in frontend/src/components/ui/. The F4 Triage backend runs at /api/triage/classify (built in Sprint 4). The frontend runs at localhost:5173 with /api proxy to :8000.

WHAT TO BUILD (all in frontend/src/):

1. stores/queryBuilderStore.ts (Zustand)
   State: currentStep (1|2|3), intentSelection, topicSelection, freeTextQuery, triageResult, isLoading
   Actions: setStep, setIntent, setTopic, setFreeText, setTriageResult, reset

2. services/triage.service.ts
   classifyQuery(query: string, sessionId: string): Promise<TriageResult>
   (calls POST /api/triage/classify)

3. components/features/query-builder/IntentStep.tsx (Step 1)
   - 3 intent cards using Card variant="feature" from Sprint 2
   - Card 1: MagnifyingGlass icon (teal, #EFF6FF bg) → "I have a specific question about a fund or fee" → subtext about fees/NAV/exit loads
   - Card 2: BookOpen icon (navy, #EEF2FF bg) → "I want to learn about mutual funds" → subtext about categories/SIPs
   - Card 3: CalendarBlank icon (saffron, #FFF7ED bg) → "I need to speak to an investment advisor" → immediately navigate to /schedule (no step 2 for this path)
   - Each card: right ArrowRight icon, hover changes border color to match icon color

4. components/features/query-builder/TopicStep.tsx (Step 2)
   - Props: mode: 'specific' | 'learn'
   - mode='specific' shows 5 TopicPill components: "Fees & charges", "Scheme details", "Processes", "Regulatory questions", "Something else"
   - mode='learn' shows 5 TopicPill components: "Types of mutual funds", "How SIPs work", "Tax implications", "Understanding fees and costs", "My rights as an investor"
   - "Something else" pill: when selected, Textarea component reveals below with 300ms height animation
   - Continue button (Button primary): disabled until selection made

5. Free-text triage integration:
   When "Something else" selected and Continue clicked:
   - Show loading state
   - Call classifyQuery() 
   - advice_seeking result → navigate to Step 3 with advice warning state
   - factual/educational/edge → navigate to Step 3 with routing transition state

6. components/features/query-builder/RoutingStep.tsx (Step 3)
   - advice_seeking state: renders ComplianceDeflectionCard (from Sprint 2 ui/) with two buttons: "Book a call with an advisor" (→ /schedule) and "Continue to FAQ anyway" (→ /faq)
   - routing transition state: success animation circle + "Taking you to [destination]..." + auto-navigate after 1500ms
   - edge state: OutOfScopeCard style message with routing note and "Book a call" ghost link

7. pages/QueryBuilder.tsx
   - Renders StepIndicator (3 steps) + current step component
   - Back button: restores previous step + state (do NOT reset queryBuilderStore on back)
   - "🔒 No login required · No personal information collected" note
   - Routing: Step 2A "Fees & charges" → /faq?topic=fees | "Scheme details" → /faq?topic=scheme | etc.
   - Routing: Step 2B "Types of mutual funds" → /education?category=fund_categories | etc.

8. Wire into router.tsx: /query-builder → QueryBuilder page. Update Home "Start with a Question" CTA to link to /query-builder.

MOBILE: All 3 steps must work at 375px. Cards stack full-width. Buttons are full-width on mobile.

AT THE END OF THIS SESSION:
1. Test the full 3-step flow manually: specific question path, learning path, and something-else path with a known advice-seeking query
2. Open TEST_CASES.md and run every test case under "SPRINT 5" (TC-5.1 through TC-5.9). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
3. Report a one-line summary, e.g. "9/9 passed" or "7/9 passed — TC-5.6 and TC-5.7 failed: [reason]". If TC-5.7 is BLOCKED because the Sprint 4 backend isn't reachable, note it and re-test before Sprint 7 starts. Do not mark the sprint complete if any non-blocked test fails — fix it first.
4. Mark Sprint 5 COMPLETED in ImplementationPlan.md
5. Fill Sprint 5 Handover Notes with: any routing decisions, any UX deviations, query param format used for /faq and /education
```

---

## SPRINT 6 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–5 Handover Notes, then Sprint 6 specification.

SPRINT 6 GOAL: Build the complete RAG corpus ingestion pipeline — extract text from SID/KIM PDFs, chunk, embed, and upload to Pinecone. This is the knowledge base that powers the FAQ Centre (Sprint 7).

CONTEXT: Work is entirely in backend/corpus/. The Pinecone index needs to be created manually before this sprint if not done already. The top20_schemes.json is at corpus/sources/.

IMPORTANT: For this sprint, if real SID/KIM PDFs are not available, create a representative sample corpus of at least 5 schemes with realistic content (use publicly known facts about those schemes — NAV, exit load, TER from official sources). The pipeline architecture must handle real PDFs when they are available.

WHAT TO BUILD:

1. corpus/sources/source_manifest.json
   Structure: {"scheme_documents": [{scheme_name, documents: [{type: SID|KIM|factsheet, filename, source_url, last_verified}]}], "regulatory_documents": [{type, title, url, filename}]}
   Include all 20 schemes + at least 30 regulatory/educational document entries (SEBI circulars, AMFI pages, Zerodha Varsity links)

2. corpus/ingestion/pdf_extractor.py
   Uses pdfplumber. Preserves table structure as pipe-delimited text. Returns list of ExtractedPage objects: {page_number, text, source_file, document_type, scheme_name}

3. corpus/ingestion/chunker.py
   - Chunk size: 500 tokens (~375 words), overlap: 100 tokens
   - Respect paragraph/section boundaries (no mid-sentence cuts)
   - Each Chunk carries metadata: scheme_name, doc_type, source_url, page_number, section_heading (if detectable)

4. corpus/ingestion/embedder.py
   Uses OpenAI text-embedding-3-small (1536 dimensions). Batches 100 chunks per API call. Returns EmbeddedChunk with vector + all metadata fields.

5. Pinecone setup:
   - Index: mf-advisor-suite, dimension 1536, metric cosine
   - Namespace "scheme_docs" for SID/KIM/factsheets
   - Namespace "regulatory" for SEBI/AMFI documents

6. corpus/scripts/ingest_corpus.py
   CLI: python ingest_corpus.py --source scheme_docs | --source regulatory | --verify
   --verify: prints vector count per namespace, confirms index exists

7. corpus/scripts/refresh_nav.py
   Fetches latest NAV from https://api.mfapi.in/mf for each Top 20 scheme code. Stores in nav_data DB table: {scheme_id, scheme_name, nav_value, nav_date, fetched_at}. Create Alembic migration for nav_data.

8. backend/app/services/rag/retriever.py
   PineconeRetriever.retrieve(query: str, namespace: str, top_k: int = 5) -> list[RetrievedChunk]
   PineconeRetriever.retrieve_with_scheme_filter(query: str, scheme_name: str, top_k: int = 5) -> list[RetrievedChunk]
   Each RetrievedChunk: {text, score, source_url, doc_type, scheme_name, page_number}

SMOKE TEST: After ingestion, run a sample query "What is the exit load for Parag Parikh Flexi Cap Fund?" and verify retriever returns chunks with score > 0.7 and source URL populated.

AT THE END OF THIS SESSION:
1. Run python ingest_corpus.py --verify and include vector count in Handover Notes
2. Include smoke test result (query + top result score) in Handover Notes
3. Open TEST_CASES.md and run every test case under "SPRINT 6" (TC-6.1 through TC-6.8). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
4. Report a one-line summary, e.g. "8/8 passed" or "6/8 passed — TC-6.4 and TC-6.5 failed: [reason]". TC-6.1–6.3 are infrastructure prerequisites for every later RAG-dependent sprint — do not proceed if any of those three fail.
5. Mark Sprint 6 COMPLETED in ImplementationPlan.md
6. Fill Sprint 6 Handover Notes with: number of documents ingested per namespace, any chunking decisions, embedding model confirmed, Pinecone index name
```

---

## SPRINT 7 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–6 Handover Notes, then Sprint 7 specification. The Sprint 6 Handover Notes will tell you the Pinecone index name, namespace names, and retriever setup.

SPRINT 7 GOAL: Build the complete FAQ Centre backend — RAG pipeline, compliance enforcement, answer formatting, and all API endpoints.

CONTEXT: The Triage classifier (Sprint 4) and Pinecone retriever (Sprint 6) are already built. This sprint assembles them into the full FAQ pipeline.

WHAT TO BUILD (all in backend/):

1. app/services/rag/corpus_check.py
   CorpusChecker.is_in_scope(query: str) -> (bool, str | None)
   - Loads top20_schemes.json on init
   - Fuzzy-matches scheme names + aliases in query
   - Returns (True, None) if no scheme or in-scope scheme
   - Returns (False, "scheme_name") if out-of-scope scheme detected
   - This check runs BEFORE any LLM call

2. app/services/rag/answer_builder.py
   FAQAnswerBuilder using Claude Sonnet:
   - System prompt must include: "Maximum 3 sentences. No investment advice. If answer not in provided documents, say 'We don't have verified information about this in our knowledge base.' NEVER hallucinate fees, NAV values, or scheme details."
   - Returns FAQAnswer: {answer_text, source_badges, source_urls, has_nav_data, clarification_needed, clarification_question}
   - has_nav_data=True if answer includes NAV numbers (triggers performance disclaimer on frontend)

3. app/services/rag/fee_explainer.py
   FeeExplainerService: get_current_explainer() -> FeeExplainerContent
   - Reads from fee_explainer DB table (version, fee_term, bullets_json, source_links_json, updated_at)
   - Seed with a default "What is TER?" explainer (6 bullets, 2 sources) if table is empty

4. DB tables + Alembic migrations:
   - session_faq_log: id, session_id, query, answer_text, bucket, scheme_name, timestamp (7-day TTL)
   - fee_explainer: id, version, fee_term, bullets_json (array of 6), source_links_json (array of 2), updated_at

5. app/services/rag/pipeline.py (main FAQ orchestrator)
   FAQPipeline.query(query: str, session_id: str) -> FAQResponse
   EXECUTION ORDER (enforce strictly):
   1. corpus_check.is_in_scope() — if False: return status="out_of_scope"
   2. triage_classifier.classify() — if advice_seeking: return status="advice_deflected"
   3. retriever.retrieve_with_scheme_filter() or retrieve() — top 5 chunks
   4. answer_builder.build() — generate answer
   5. Log to session_faq_log
   6. Return FAQResponse with status="answered"
   FAQResponse: {status: answered|out_of_scope|advice_deflected|no_answer|clarification_needed, answer: FAQAnswer|None, out_of_scope_scheme: str|None, session_log_id: str}

6. app/api/routes/faq.py
   POST /api/faq/query → {query: str, session_id: str} → FAQResponse
   GET /api/faq/fee-explainer → FeeExplainerContent
   GET /api/faq/covered-schemes → list[str] (scheme names from top20_schemes.json)
   GET /api/faq/session-queries/{session_id} → list[str] (for Pre-Meeting Brief in Sprint 13)

7. tests/test_faq.py — ALL must pass:
   - Parag Parikh exit load query → status="answered", source_badges populated, answer ≤ 3 sentences
   - Non-Top-20 scheme query → status="out_of_scope"
   - "Should I invest in ELSS?" → status="advice_deflected"
   - 5 adversarial prompts (all recommendation-seeking) → all status="advice_deflected"
   - Query with no corpus answer → status="no_answer", answer_text contains "We don't have verified information"
   - GET /api/faq/fee-explainer → returns object with bullets array of length 6

HARD RULE: The "no_answer" response must use the EXACT text "We don't have verified information about this in our knowledge base." — no variation.

AT THE END OF THIS SESSION:
1. Run pytest tests/test_faq.py — all tests must pass
2. Open TEST_CASES.md and run every test case under "SPRINT 7" (TC-7.1 through TC-7.10). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
3. Report a one-line summary, e.g. "10/10 passed" or "8/10 passed — TC-7.4 and TC-7.5 failed: [reason]". TC-7.4, 7.5, 7.6 are P0 — any failure blocks the sprint and must be fixed before Sprint 8 starts, since Sprint 8's frontend depends on these statuses being correct.
4. Mark Sprint 7 COMPLETED in ImplementationPlan.md
5. Fill Sprint 7 Handover Notes with: LLM model used, any prompt tuning decisions, clarifying question logic details, session_faq_log TTL implementation details
```

---

## SPRINT 8 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–7 Handover Notes, then Sprint 8 specification. Sprint 5 Handover Notes have the query param format for /faq?topic=. Sprint 7 Handover Notes have the exact FAQResponse shape.

SPRINT 8 GOAL: Build the complete FAQ Centre frontend — all answer states (answered, deflected, out-of-scope, no-answer), sidebar panels, fee explainer view, and mobile layout.

CONTEXT: UI components from Sprint 2 are in frontend/src/components/ui/. The FAQ backend from Sprint 7 is at /api/faq/. Wire them together.

WHAT TO BUILD (all in frontend/src/):

1. services/faq.service.ts
   queryFAQ(query: string, sessionId: string): Promise<FAQResponse>
   getFeeExplainer(): Promise<FeeExplainerContent>
   getCoveredSchemes(): Promise<string[]>

2. components/features/faq/FAQSearchBar.tsx
   52px height, white bg, search icon left, microphone icon right, "Ask" button right (saffron)
   On submit: calls queryFAQ, emits result up to parent via callback
   Reads ?topic= query param on mount and pre-populates topic chip

3. components/features/faq/FAQAnswerCard.tsx
   - User question displayed in #F7F8FA rounded bubble at top
   - Answer text: 16px Inter, 1.6 line height (max 3 sentences from API)
   - Source row: one or more SourceBadge components + URL link with ArrowSquareOut icon
   - DisclaimerBlock primary variant (ALWAYS shown — never hidden)
   - If has_nav_data=true: show additional DisclaimerBlock performance variant below
   - "Book a call" ghost link at bottom (CTA, not primary action)

4. components/features/faq/FAQDeflectionCard.tsx
   Renders ComplianceDeflectionCard from Sprint 2 ui/. Props: onBookAdvisor (→ /schedule), onContinueToFaq (re-enables search bar). Suggestion chips for related factual topics.

5. components/features/faq/FAQOutOfScopeCard.tsx
   Renders OutOfScopeCard from Sprint 2 ui/. "View covered schemes" fetches getCoveredSchemes() and renders expandable list.

6. components/features/faq/FeeExplainerPanel.tsx (sidebar)
   Fetches getFeeExplainer() on mount. Shows: "📌 Fee Explainer — This Week" chip, fee term H3, 6 bullet points (teal left border card), 2 SourceBadge links, "Last checked: [date]", "Version v[N]"

7. components/features/faq/CoveredSchemesPanel.tsx (sidebar)
   Expandable panel, max-height 200px with overflow scroll, 12px scheme names in teal. "Why only 20 schemes?" tooltip explaining corpus coverage.

8. pages/FAQCentre.tsx
   - 2-column layout: 65% main, 35% sidebar (desktop) / single column (mobile)
   - State machine: idle → loading → answered | deflected | out_of_scope | no_answer | clarification_needed
   - Loading: Skeleton component from Sprint 2 (3 lines)
   - Follow-up question input below answer card (calls queryFAQ again with same session_id)
   - Read ?topic= param on mount, pre-populate FAQSearchBar

9. pages/FeeExplainerDetail.tsx
   Full-page explainer view. Breadcrumb → 6 numbered bullet cards → 2 SourceBadges → DisclaimerBlock

COMPLIANCE RULE: DisclaimerBlock must appear on EVERY answer state — it must be impossible to see an FAQ answer without the disclaimer. Never hide it for visual reasons.

MOBILE: At 375px — sidebar panels become accordions below main content. Search bar + answer card go full width.

AT THE END OF THIS SESSION:
1. Test in browser: search for "What is the exit load for Parag Parikh Flexi Cap Fund?" — verify answer appears with source badge and disclaimer
2. Test: search for "Should I invest in ELSS?" — verify amber deflection card appears
3. Open TEST_CASES.md and run every test case under "SPRINT 8" (TC-8.1 through TC-8.9). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
4. Report a one-line summary, e.g. "9/9 passed" or "7/9 passed — TC-8.2 and TC-8.4 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
5. Mark Sprint 8 COMPLETED in ImplementationPlan.md
6. Fill Sprint 8 Handover Notes with: session_id generation strategy on frontend, any state management decisions
```

---

## SPRINT 9 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–8 Handover Notes, then Sprint 9 specification.

SPRINT 9 GOAL: Build the F3 Education Hub backend — content data model, seed all 5 content sections, and expose search/filter APIs.

CONTEXT: Work is in backend/. No new LLM calls needed — Education Hub content is static/seeded. The vector store from Sprint 6 has regulatory documents that can inform content.

WHAT TO BUILD (all in backend/):

1. DB model: education_articles table
   Fields: id, slug (unique), title, category (enum: fund_categories|key_concepts|fee_education|investor_processes|investor_rights), section_order (int), body_markdown (text), source_citations_json (array of {label, url, citation_text}), last_reviewed_date, version, scheme_example_id (nullable, FK to top20 scheme), is_published

2. Alembic migration for education_articles

3. corpus/scripts/seed_education.py
   Seeds ALL articles across 5 sections. Minimum article counts:
   - fund_categories: 8 equity + 6 debt + 3 hybrid + 2 solution = 19 articles
   - key_concepts: 6 articles (NAV, SIP, SWP/STP, Direct vs Regular, AUM, Riskometer)
   - fee_education: 5 articles (TER, Exit Load, Stamp Duty, STT, Distributor vs Direct)
   - investor_processes: 5 articles (Start SIP, Redeem, CG Statement, Update KYC, File Complaint via SEBI SCORES)
   - investor_rights: 4 articles (SID/KIM access, Account statements, Nomination, SEBI grievance)
   Each article body must be factually accurate, sourced from official documents (SEBI/AMFI/SID)
   Each article must have at least 1 source_citations_json entry with a real verifiable URL
   Fund category articles: set scheme_example_id to a relevant Top 20 scheme where applicable
   TER and Exit Load articles: set a "most_misunderstood: true" flag (add column to table)

4. Full-text search: Enable SQLite FTS5 virtual table over education_articles (title + body_markdown)
   Create FTS5 shadow table + triggers to keep in sync

5. app/api/routes/education.py
   GET /api/education/sections → list of sections with article count per section
   GET /api/education/articles → all published articles (query params: ?category=, ?search=)
   GET /api/education/articles/{slug} → full article with body_markdown + source_citations
   GET /api/education/related/{slug} → 3 related articles (same category)
   GET /api/education/search?q= → FTS5 search, returns [{slug, title, category, excerpt (150 chars)}]

6. app/services/rag/pipeline.py — add Education Hub routing:
   When triage returns "educational" bucket, attach relevant Education Hub articles to the FAQ response (so frontend can suggest "Read more in Education Hub" links)

AT THE END OF THIS SESSION:
1. Run: GET /api/education/sections — verify all 5 sections with correct counts
2. Run: GET /api/education/articles/what-is-ter — verify article has body_markdown + source_citations
3. Run: GET /api/education/search?q=exit+load — verify search returns results
4. Open TEST_CASES.md and run every test case under "SPRINT 9" (TC-9.1 through TC-9.7). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
5. Report a one-line summary, e.g. "7/7 passed" or "5/7 passed — TC-9.3 and TC-9.7 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
6. Mark Sprint 9 COMPLETED in ImplementationPlan.md
7. Fill Sprint 9 Handover Notes with: total article count seeded, any slug naming convention used, FTS5 setup details
```

---

## SPRINT 10 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–9 Handover Notes, then Sprint 10 specification. Sprint 9 Handover Notes have the article slug format and API endpoint details.

SPRINT 10 GOAL: Build the full Education Hub frontend — hub home page with 5 content sections, individual article view with sidebar, search, and full mobile responsiveness.

CONTEXT: All UI components from Sprint 2 are available. Education Hub API from Sprint 9 is at /api/education/.

WHAT TO BUILD (all in frontend/src/):

1. services/education.service.ts
   Type-safe API client for all 5 education endpoints from Sprint 9

2. pages/EducationHub.tsx (Hub Home)
   - Hero: navy-teal gradient, search bar (calls /api/education/search)
   - Section 1 — Fund Categories: card grid (4 cols desktop, 2 tablet, 1 mobile). Each card: category icon, title, "Equity"/"Debt"/"Hybrid" pill, SEBI source ref, hover to /education/[slug]
   - Section 2 — Key Concepts: 3×2 grid, each: icon + title + one-line description
   - Section 3 — Fees & Costs: 3-col grid + "⚠️ Most misunderstood" amber badge on TER and Exit Load cards
   - Section 4 — Investor Processes: cards with step-flow right-arrow visual cue
   - Section 5 — Investor Rights: cards with ShieldCheck icon in #2D8653
   - Full-width compliance strip above footer: "All content sourced from SEBI circulars, AMFI publications..." (import from compliance.ts — DO NOT hardcode)
   - ?category= query param: auto-scrolls to that section and briefly highlights it

3. pages/EducationArticle.tsx (Article View)
   Fetches /api/education/articles/{slug}. Layout: 70/30 two-column desktop.
   - Breadcrumb: Education Hub > [Section] > [Article Title]
   - Header: category tag pill, H1 title, source badges row, "Last reviewed: [date]"
   - Left column (70%): body_markdown rendered with react-markdown (install it). Custom renderers:
     - blockquote → definition callout box (teal left border, #F0FAFB bg)
     - code block → worked example box (dashed border, "Example" label, uses Top 20 scheme if available)
   - Inline source numbers: render as SourceBadge clickable pills
   - DisclaimerBlock primary at bottom of article (always)
   - If article slug contains "nav" or "returns": also show DisclaimerBlock performance
   - CTA strip: "Still have questions? Ask in FAQ Centre →" (ghost teal) + "Book a call with an advisor →" (ghost teal)
   - Right sidebar (30%): sticky TOC (link to each H2/H3 in article), Related Articles (3 cards from /api/education/related/{slug}), FeeExplainerPanel component (from Sprint 8)
   - Mobile: sidebar collapses, TOC becomes top accordion

4. Search results UI in EducationHub.tsx
   Results appear below search bar as cards: title, category pill, 150-char excerpt, "Read more →"

5. Wire /education/:slug route in router.tsx → EducationArticle page

IMPORTANT: Every article page must show DisclaimerBlock. Never suppress it for visual reasons. Source badges must be clickable with external links.

MOBILE at 375px: All grids collapse to single column. Article TOC becomes top accordion. Sidebar panels stack below article.

AT THE END OF THIS SESSION:
1. Open Education Hub in browser, verify all 5 sections render with cards
2. Click a fund category card, verify article renders with source badges and disclaimer
3. Test search: "exit load" → results appear
4. Open TEST_CASES.md and run every test case under "SPRINT 10" (TC-10.1 through TC-10.8). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
5. Report a one-line summary, e.g. "8/8 passed" or "6/8 passed — TC-10.3 and TC-10.7 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
6. Mark Sprint 10 COMPLETED in ImplementationPlan.md
7. Fill Sprint 10 Handover Notes with: react-markdown version installed, any custom renderers built, mobile layout decisions
```

---

## SPRINT 11 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–10 Handover Notes, then Sprint 11 specification.

SPRINT 11 GOAL: Build the complete F5 Voice Appointment Scheduler backend — booking logic, slot management, PII detection, email sending, and all CRUD API endpoints.

CONTEXT: Work is in backend/. The Triage classifier (Sprint 4) is reused for topic classification. SendGrid is configured in .env. The booking code format is MF-[4 alphanumeric uppercase characters].

WHAT TO BUILD (all in backend/):

1. Alembic migration for these new tables:
   - advisors: id, email, name, sebi_registration_number, is_active
   - advisor_slots: id, advisor_id, start_time (datetime), end_time (datetime), is_recurring, day_of_week (nullable 0-6), is_blocked
   - bookings: id, booking_code (unique MF-XXXX format), advisor_id, slot_id, topic_category, investor_email_hash (SHA-256 of email), investor_context_encrypted (nullable), session_id, status (confirmed|cancelled|completed|rescheduled), created_at, slot_datetime
   - voice_transcripts: id, booking_id, transcript_text, created_at, expires_at (= created_at + 7 days)
   
2. Seed script: seed 2-3 sample advisors + sample availability slots for next 7 days (for frontend testing)

3. app/services/scheduler/booking.py
   BookingService:
   - generate_booking_code() → "MF-" + 4 random alphanumeric uppercase chars, unique check against DB
   - create_booking(slot_id, topic_category, session_id, email, context=None) → Booking
   - cancel_booking(booking_code, email) → bool (requires both code AND email match, cancellations ≥ 2h before slot)
   - reschedule_booking(booking_code, email, new_slot_id) → Booking
   - mark_complete(booking_id) → bool (triggers feedback email)
   - get_booking_by_code(booking_code, email) → Booking | None (email verification required)

4. app/services/scheduler/slots.py
   SlotManager:
   - get_available_slots(days_ahead=7) → list[AvailableSlot] (max 3 for voice scheduler display)
   - set_advisor_availability(advisor_id, start_time, end_time, is_recurring, day_of_week) → AdvisorSlot
   - block_slot(slot_id) → bool (if existing booking in that slot: trigger re-booking notification to investor)

5. app/services/scheduler/pii_guard.py
   PIIGuard:
   - PII_PATTERNS dict: PAN (regex AAAAA1234A format), Aadhaar (12 consecutive digits), folio (folio number patterns), account numbers
   - detect_pii(text: str) -> (bool, matched_type: str)
   - deflection_message: "For security, please don't share account or identity details here. Your advisor will have a secure channel for that during your call."

6. app/services/scheduler/email_sender.py
   EmailSender using SendGrid:
   - send_booking_confirmation(email, booking) → bool. Email must include: booking_code in large text, topic_category, slot_datetime, advisor name, reschedule/cancel instructions
   - send_cancellation_confirmation(email, booking) → bool
   - send_post_meeting_feedback(email, booking) → bool. Single question: "How useful was your call?" with 3 clickable options
   - send_advisor_otp(advisor_email, otp) → bool (used by Sprint 13 advisor auth)

7. APScheduler job: delete expired voice_transcripts daily at 2AM UTC

8. app/api/routes/scheduler.py
   GET  /api/scheduler/slots                   → list[AvailableSlot] (3 slots)
   POST /api/scheduler/bookings                → create booking, send confirmation email, return Booking with booking_code
   POST /api/scheduler/classify-topic         → triage query, return topic_category string
   POST /api/scheduler/pii-check              → {text: str} → {has_pii: bool, matched_type: str, deflection_message: str}
   GET  /api/scheduler/bookings/{code}?email= → lookup by code + email
   PUT  /api/scheduler/bookings/{code}/reschedule
   DELETE /api/scheduler/bookings/{code}?email=
   POST /api/scheduler/bookings/{id}/complete  (advisor auth required — add auth dependency)

9. tests/test_scheduler.py — ALL must pass:
   - Booking code is always "MF-" + 4 uppercase alphanumeric
   - PII detection: PAN format → detected, Aadhaar 12 digits → detected, "folio number 123456" → detected
   - Cancellation with wrong email → 403 Forbidden
   - Cancellation within 2h of slot → rejected with clear error message
   - mark_complete triggers feedback email (mock SendGrid)

AT THE END OF THIS SESSION:
1. Run pytest tests/test_scheduler.py — all tests must pass
2. Open TEST_CASES.md and run every test case under "SPRINT 11" (TC-11.1 through TC-11.9). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
3. Report a one-line summary, e.g. "9/9 passed" or "7/9 passed — TC-11.2 and TC-11.5 failed: [reason]". TC-11.2, 11.3, 11.4 (PII detection) and TC-11.5 (cancellation security) are P0 — any failure blocks the sprint.
4. Mark Sprint 11 COMPLETED in ImplementationPlan.md
5. Fill Sprint 11 Handover Notes with: encryption method for investor_context, email_hash method (SHA-256 confirmed), seed data details (advisor IDs, slot IDs for Sprint 12 to use)
```

---

## SPRINT 12 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–11 Handover Notes, then Sprint 12 specification. Sprint 11 Handover Notes have seed advisor and slot IDs for testing.

SPRINT 12 GOAL: Build the complete F5 Voice Appointment Scheduler frontend — the full 6-step voice booking flow plus the reschedule/cancel page.

CONTEXT: VoiceMicButton and BookingCodeDisplay components are in Sprint 2's ui/. Scheduler backend APIs are at /api/scheduler/ (Sprint 11). This is a voice-first UI but must have text fallback at every step.

WHAT TO BUILD (all in frontend/src/):

1. hooks/useVoiceInput.ts
   Wraps Web Speech API (SpeechRecognition). Falls back to showing text input if API unavailable.
   Returns: {isListening, transcript, startListening, stopListening, error, isSupported}

2. stores/schedulerStore.ts (Zustand)
   State for all 6 steps: currentStep, pulseTheme, voiceTranscript, topicCategory, triageResult, selectedSlot, investorContext, investorEmail, booking (confirmed booking object), isLoading

3. services/scheduler.service.ts
   Type-safe client for all scheduler API endpoints from Sprint 11

4. components/features/scheduler/GreetingStep.tsx (Step 1)
   - Fetches /api/pulse/current-theme on mount (may not exist yet — handle gracefully: show generic greeting if 404 or empty)
   - If pulse theme available: #EFF6FF banner with "💡 This week, many investors are asking about: [theme]"
   - Voice agent card: abstract avatar icon (navy circle with waveform icon), speech bubble with greeting text
   - VoiceMicButton (idle state) — clicking starts voice capture
   - Divider "— or —" with text input fallback below
   - PII notice at bottom: "🔒 Please don't share account numbers, PAN, Aadhaar, or portfolio details here."

5. components/features/scheduler/TopicCaptureStep.tsx (Step 2)
   - VoiceMicButton in listening state with pulsing rings CSS animation
   - Waveform visualization component (5 animated bars, teal color)
   - Live transcript display card below button (text appears as it's captured)
   - On stop: calls POST /api/scheduler/classify-topic with transcript
   - If triage result = "factual": show amber suggestion card ("This sounds like something our FAQ Centre might answer — try that first?") with "Take me to FAQ" primary button + "I'd still like to speak to an advisor" secondary button
   - If advice_seeking or educational: booking proceeds to Step 3

6. components/features/scheduler/SlotSelectionStep.tsx (Step 3)
   - Fetches GET /api/scheduler/slots
   - 3 slot cards, radio selection: CalendarBlank icon + day/date + time + timezone
   - Selected state: #F0FAFB bg + #0F7B8C border
   - "Continue →" disabled until slot selected

7. components/features/scheduler/ContextCaptureStep.tsx (Step 4)
   - Optional Textarea (maxLength=300, character counter)
   - Real-time PII check: on blur, POST /api/scheduler/pii-check with textarea content
   - If PII detected: inline amber warning block "🔒 For your security, please don't share your PAN, Aadhaar, folio number, or account details here."
   - "Add context & Continue" primary + "Skip — Continue without context" ghost link

8. components/features/scheduler/EmailCaptureStep.tsx (Step 5)
   - Email Input with label, validation
   - Consent text: "We'll only use this to send your confirmation email and a brief feedback request after your call. Not for marketing. Not shared with third parties."
   - "Confirm Booking →" button: on click, POST /api/scheduler/bookings → transitions to Step 6

9. components/features/scheduler/ConfirmationStep.tsx (Step 6)
   - Animated success checkmark: CSS keyframe (scale from 0 to 1, opacity 0 to 1, duration 400ms)
   - BookingCodeDisplay component with copy-to-clipboard
   - Booking details card: code, topic_category, slot_datetime formatted, advisor name
   - #F0FAF4 success strip: "📧 A confirmation email has been sent to [email]"
   - "Return to Home" ghost + "Browse Education Hub →" ghost

10. pages/VoiceScheduler.tsx
    - StepIndicator (6 steps) at top
    - Renders current step based on schedulerStore.currentStep
    - Back button (ghost, all steps except 6)
    - Centered max-width 640px

11. pages/RescheduleCancel.tsx
    - Form: Booking Code input (monospace, uppercase) + Email input
    - "Look up booking" → GET /api/scheduler/bookings/{code}?email=
    - Shows booking details, "Reschedule" (reuse SlotSelectionStep component) + "Cancel" buttons
    - Cancel: Modal confirmation → DELETE request

MOBILE: All 6 steps work at 375px. Buttons full-width on mobile.

AT THE END OF THIS SESSION:
1. Test full flow in browser: go through all 6 steps to booking confirmation
2. Verify booking code displays correctly in BookingCodeDisplay
3. Open TEST_CASES.md and run every test case under "SPRINT 12" (TC-12.1 through TC-12.9). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
4. Report a one-line summary, e.g. "9/9 passed" or "7/9 passed — TC-12.5 and TC-12.6 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
5. Mark Sprint 12 COMPLETED in ImplementationPlan.md
6. Fill Sprint 12 Handover Notes with: voice API browser support findings, any step navigation edge cases
```

---

## SPRINT 13 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–12 Handover Notes, then Sprint 13 specification. Sprint 11 Handover Notes have DB table structures. Sprint 7 Handover Notes have the session_faq_log structure.

SPRINT 13 GOAL: Build the F6 Advisor Dashboard backend — email + OTP authentication with 30-minute session JWT, meeting queue management, pre-meeting brief assembly, and availability calendar APIs.

CONTEXT: Work is in backend/. The bookings, advisor_slots, session_faq_log, and advisors tables already exist (Sprints 7, 11). Email sending via SendGrid is ready (Sprint 11 email_sender.py).

WHAT TO BUILD (all in backend/):

1. DB additions + migrations:
   - otp_store: id, email, otp_hash (bcrypt), expires_at (10 min from creation), used (bool)

2. app/services/advisor/auth.py
   AdvisorAuth:
   - request_otp(email: str) → True if advisor found, False if not. Generate 6-digit OTP, store bcrypt hash + expires_at in otp_store. Send via email_sender.send_advisor_otp().
   - verify_otp(email: str, otp: str) → JWT token string or None. Check otp_store: hash match + not expired + not used. On success: mark used=True, generate JWT (HS256, SECRET_KEY, 30min expiry). 
   - validate_token(token: str) → Advisor | None. Decode JWT, return advisor if valid.
   - get_current_advisor dependency: FastAPI dependency that reads Bearer token from Authorization header.

3. app/services/advisor/queue_manager.py
   MeetingQueueManager:
   - get_queue(advisor_id, filters: QueueFilters) → list[MeetingQueueItem]
   - QueueFilters: status (enum|None), date (date|None), topic_category (str|None)
   - MeetingQueueItem: booking_code, topic_category, slot_datetime, status, brief_preview_available
   - confirm_booking(booking_id, advisor_id) → bool
   - reschedule_booking(booking_id, new_slot_id, reason) → bool (sends investor notification email)
   - mark_complete(booking_id) → bool (triggers email_sender.send_post_meeting_feedback)

4. app/services/advisor/brief_builder.py
   BriefBuilder.build(booking_id: int) → PreMeetingBrief
   Assembly:
   - From bookings table: booking_code, topic_category, investor_context (decrypt if set)
   - From session_faq_log WHERE session_id = booking.session_id: list of query strings (max 3)
   - From pulse_reports table: top theme from latest report (may be None if no Pulse yet)
   - From education_articles WHERE category matches topic_category: 2 relevant article slugs + titles
   PreMeetingBrief fields: booking_code, topic_category, investor_context, session_faq_queries, pulse_top_theme, relevant_education_articles
   MANDATORY: No PII fields. No AI-generated advisory recommendation. Assert these fields are absent before returning.

5. app/api/routes/advisor.py
   All routes except auth endpoints require get_current_advisor dependency:
   POST /api/advisor/auth/request-otp  → {email: str}
   POST /api/advisor/auth/verify-otp   → {email: str, otp: str} → {token: str}
   GET  /api/advisor/me                → Advisor profile
   GET  /api/advisor/meetings          → list[MeetingQueueItem] (?status=, ?date=, ?topic=)
   GET  /api/advisor/meetings/{id}/brief → PreMeetingBrief
   PUT  /api/advisor/meetings/{id}/confirm
   PUT  /api/advisor/meetings/{id}/complete → triggers feedback email
   PUT  /api/advisor/meetings/{id}/reschedule → {new_slot_id, reason}
   GET  /api/advisor/slots             → advisor's current availability calendar
   POST /api/advisor/slots             → add availability slot
   PUT  /api/advisor/slots/{id}/block
   DELETE /api/advisor/slots/{id}

6. tests/test_advisor.py — ALL must pass:
   - OTP request for valid advisor email → otp_store row created
   - Wrong OTP → 401
   - Expired OTP (manipulate expires_at) → 401
   - Valid token → 200 on GET /api/advisor/me
   - Brief for a booking: assert fields [booking_code, topic_category, session_faq_queries, pulse_top_theme, relevant_education_articles] present
   - Brief: assert fields [pan, aadhaar, folio, account_number, portfolio, advisory_recommendation] NOT present (KeyError or None)
   - mark_complete → feedback email triggered (mock SendGrid)

AT THE END OF THIS SESSION:
1. Run pytest tests/test_advisor.py — all tests must pass
2. Open TEST_CASES.md and run every test case under "SPRINT 13" (TC-13.1 through TC-13.8). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
3. Report a one-line summary, e.g. "8/8 passed" or "6/8 passed — TC-13.6 and TC-13.7 failed: [reason]". TC-13.7 is the single most important compliance test in the advisor track — any failure here is an automatic sprint block.
4. Mark Sprint 13 COMPLETED in ImplementationPlan.md
5. Fill Sprint 13 Handover Notes with: JWT expiry implementation (sliding vs absolute), OTP storage TTL cleanup job if added, advisor seed data used for testing
```

---

## SPRINT 14 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–13 Handover Notes, then Sprint 14 specification. Sprint 13 Handover Notes have JWT token structure and advisor API details.

SPRINT 14 GOAL: Build the complete F6 Advisor Dashboard frontend — login page, dashboard layout, meeting queue, pre-meeting brief, and availability calendar.

CONTEXT: All UI components from Sprint 2 are available. Advisor backend APIs from Sprint 13 are at /api/advisor/. Badge and Modal components from Sprint 2 are needed for this sprint.

WHAT TO BUILD (all in frontend/src/):

1. hooks/useAdvisorAuth.ts
   Manages OTP flow and session. Stores JWT in sessionStorage (NOT localStorage for security).
   Returns: {advisor, isAuthenticated, requestOTP, verifyOTP, logout, sessionTimeRemaining}
   Session timer: decrement every second. At 5 minutes remaining: show warning toast. At 0: auto-logout and redirect to /advisor/login.

2. pages/AdvisorLogin.tsx
   Split-screen desktop (50/50):
   - Left: #1B3F7E bg, white logo, 3 value prop items, "For SEBI-registered Investment Advisors only" 12px bottom
   - Right: white, H1 "Advisor Log In", 2-phase form:
     Phase 1: email input + "Send OTP" button (calls requestOTP)
     Phase 2 (after OTP sent): 6-digit OTP input (single Input component with large monospace, or 6 individual boxes) + "Log In" button (calls verifyOTP) + "Resend OTP" ghost link with 30-second countdown timer
   - Session note: 12px neutral: "Sessions time out after 30 minutes of inactivity for your security."
   Mobile: hide left panel, white form with logo at top

3. components/features/advisor/DashboardLayout.tsx
   Fixed sidebar 240px (#1B3F7E navy) + main content area:
   - Sidebar: logo, nav items (Meeting Queue, Availability Calendar, Product Pulse, Settings) with active indicator (3px white left border + 20% white bg)
   - Bottom: advisor name, "RIA" green badge pill, logout link
   - Main content: top bar (page title as H2 + session timer "Session: Xm remaining" + notification bell icon)
   - Mobile: sidebar collapses to hamburger → slide-in drawer

4. pages/AdvisorDashboard.tsx (Meeting Queue)
   - Pulse pinned card at top: #EFF6FF bg, ChartBar icon, top theme text, "Read full Pulse →" teal ghost link (fetches GET /api/pulse/current — if 404 or null, hide card gracefully)
   - Filter bar: status pills (All | Confirmed | Pending | Completed | Cancelled) + date input + topic dropdown
   - Meeting queue table:
     Columns: Booking Code (monospace, teal, #1B3F7E) | Topic (category pill) | Scheduled Time | Status (Badge component) | Actions ("View Brief" ghost | "Reschedule" gray ghost | "Complete" green outline)
   - "Complete" button: opens confirmation modal, then PUT /api/advisor/meetings/{id}/complete

5. pages/AdvisorBrief.tsx
   Fetches GET /api/advisor/meetings/{id}/brief:
   - Breadcrumb: "Meeting Queue > Pre-Meeting Brief: MF-XXXX"
   - Brief header card: booking_code in monospace + status Badge + slot_datetime. If meeting within 30 min: amber "Meeting starts soon" inline warning
   - 5 content sections with #F3F4F6 horizontal dividers:
     1. TOPIC CATEGORY: display topic_category
     2. INVESTOR'S CONTEXT: investor_context text in italic speech bubble — OR "Not shared" in neutral-400
     3. FAQ QUERIES FROM SESSION: map session_faq_queries to TopicPill chips — OR "None recorded"
     4. PULSE TOP THEME: pulse_top_theme text, "Common context — not investor-specific" chip
     5. RELEVANT ARTICLES: link list of relevant_education_articles with ArrowSquareOut icon
   - Bottom: gray info box "This brief does not contain: PAN, Aadhaar, folio number, portfolio details, or AI-generated advisory recommendations."
   - Actions: "Mark as Complete" saffron primary | "Reschedule" outline | "Back to Queue" ghost

6. pages/AdvisorCalendar.tsx
   - 5-day week view header (Mon–Fri, current week), time rows 8AM–7PM, 30-min slots
   - Color coding: available (#F0FAFB, teal left border 3px, "Open" label), booked (#EFF6FF, navy left border 3px, Booking Code label), blocked (striped pattern via CSS, "Blocked" label)
   - "Add time block" button → Modal with: day pills (Mon–Sun), time range pickers (from/to), recurring toggle → POST /api/advisor/slots
   - Clicking a booked slot → link to /advisor/brief/{id}

7. AdvisorRoute.tsx protected route wrapper
   If !isAuthenticated → redirect to /advisor/login. Wrap all /advisor/* routes.

MOBILE: Dashboard sidebar collapses. Meeting queue renders as stacked cards (not table) on mobile.

AT THE END OF THIS SESSION:
1. Log in with a seeded advisor in browser, navigate through all 4 sections
2. Open a pre-meeting brief — verify all 5 sections show, PII note at bottom visible
3. Open TEST_CASES.md and run every test case under "SPRINT 14" (TC-14.1 through TC-14.9). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
4. Report a one-line summary, e.g. "9/9 passed" or "7/9 passed — TC-14.7 and TC-14.9 failed: [reason]". TC-14.7 and TC-14.9 directly enforce the privacy requirement found broken during design review (Screen 6.2/6.4) — do not let these regress; fix before proceeding.
5. Mark Sprint 14 COMPLETED in ImplementationPlan.md
6. Fill Sprint 14 Handover Notes with: session storage key name used, any layout decisions for mobile queue view
```

---

## SPRINT 15 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–14 Handover Notes, then Sprint 15 specification. Sprint 7 Handover Notes have session_faq_log structure. Sprint 11 has voice_transcripts and bookings tables. Sprint 13 has post_meeting_feedback (if added) or this needs to be added now.

SPRINT 15 GOAL: Build the complete F7 Product Pulse backend — data aggregation pipeline, LLM report generation, Monday 9AM IST scheduling, and the Fee Explainer corpus refresh trigger.

CONTEXT: Work is in backend/. LLM is Claude Sonnet (Anthropic). APScheduler is already in requirements.txt. The fee_explainer table exists (Sprint 7).

WHAT TO BUILD (all in backend/):

1. DB additions + migrations:
   - pulse_reports: id, week_start_date, top_themes_json, user_quotes_json, key_observation (text), fee_spotlight_term, product_recommendations_json, corpus_refresh_version, corpus_refresh_confirmed_at, created_at, sections_1_4_word_count
   - post_meeting_feedback: id, booking_id, rating (enum: very_useful|somewhat_useful|not_useful), created_at (no investor PII stored)

2. app/services/pulse/aggregator.py
   PulseAggregator.aggregate(week_start: date, week_end: date) → PulseInputData
   Aggregates (all anonymised, no PII):
   - FAQ query topic distribution from session_faq_log (GROUP BY topic, COUNT)
   - Top query strings (for representative quotes — strip any PII patterns before returning)
   - Booking topic distribution from bookings table
   - Post-meeting feedback aggregated ratings count per rating type
   - Fee term frequency: count queries in session_faq_log WHERE query ILIKE '%TER%' OR '%exit load%' etc.
   Returns: PulseInputData (structured counts only — no raw PII text)

3. app/services/pulse/report_generator.py
   PulseReportGenerator.generate(input_data: PulseInputData) → PulseReport
   Uses Claude Sonnet. System prompt:
   "Generate a weekly intelligence report for SEBI-registered investment advisors about investor queries on a mutual fund information platform. RULES: All investor quotes must be anonymised (names → [Investor], scheme names → [Scheme]). Key observation must be ≤ 100 words. Sections 1-4 combined must be ≤ 250 words. Include EXACTLY 3 product recommendations, each tied to a specific query count. No forward-looking investment claims. No PII in any output field."
   After generation: validate word count (recount Sections 1-4), validate exactly 3 recommendations, validate no PII patterns (PAN/Aadhaar/email regex scan). If validation fails: regenerate with stricter prompt.

4. app/services/pulse/corpus_refresher.py
   CorpusRefresher.trigger_fee_explainer_update(fee_term: str, week_start: date) → int (new version)
   1. Generate 6-bullet fee explainer content for fee_term using Claude Sonnet (same format as existing fee_explainer table)
   2. Insert new row in fee_explainer table: version = current_max_version + 1
   3. Return new version number
   Must complete within 24 hours of Pulse generation (monitored by corpus_refresh_confirmed_at timestamp)

5. app/services/pulse/scheduler.py
   APScheduler CronTrigger: every Monday at 03:30 UTC (= 09:00 IST)
   run_weekly_pulse() function:
   1. PulseAggregator.aggregate(last 7 days)
   2. PulseReportGenerator.generate(input_data)
   3. Save pulse_report to DB
   4. CorpusRefresher.trigger_fee_explainer_update(fee_spotlight_term)
   5. Update pulse_report.corpus_refresh_confirmed_at and corpus_refresh_version
   6. Send Pulse email to all active advisors + product team email
   Register job in app/main.py startup event.

6. app/api/routes/pulse.py
   GET /api/pulse/current            → latest pulse_report (public — used by F5 greeting + advisor dashboard)
   GET /api/pulse/current-theme      → {"theme": "top theme string"} (public — used by voice scheduler)
   GET /api/pulse/history            → list of past reports (advisor auth required)
   GET /api/pulse/{id}               → specific report (advisor auth required)
   POST /api/pulse/trigger           → manual trigger (no auth in dev, add basic API key check)
   POST /api/pulse/feedback          → {booking_id: int, rating: str} → saves to post_meeting_feedback (no auth, no PII)

7. tests/test_pulse.py — ALL must pass:
   - Aggregator with mock faq_log returns correct topic counts
   - Generator output: exactly 3 product_recommendations in list
   - Generator output: sections_1_4_word_count ≤ 250 (count words in top_themes + user_quotes + key_observation + fee_spotlight_term)
   - Generator output: no PII pattern detected (scan output with pii_guard patterns from Sprint 11)
   - CorpusRefresher increments version (version N+1 after update)
   - POST /api/pulse/feedback saves correctly, rating field is valid enum

AT THE END OF THIS SESSION:
1. Run POST /api/pulse/trigger manually, verify report saved to DB
2. Run GET /api/pulse/current-theme — verify returns theme string
3. Run pytest tests/test_pulse.py — all pass
4. Open TEST_CASES.md and run every test case under "SPRINT 15" (TC-15.1 through TC-15.8). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
5. Report a one-line summary, e.g. "8/8 passed" or "6/8 passed — TC-15.2 and TC-15.6 failed: [reason]". TC-15.2, 15.3, 15.6 are P0 — TC-15.6 in particular must never regress, since this was the exact compliance violation found in the Stitch design review (Product Pulse fund-recommendation section).
6. Mark Sprint 15 COMPLETED in ImplementationPlan.md
7. Fill Sprint 15 Handover Notes with: APScheduler registration details, PII scan method used in validation, word count enforcement implementation
```

---

## SPRINT 16 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–15 Handover Notes, then Sprint 16 specification. Sprint 14 Handover Notes have the advisor dashboard layout. Sprint 15 has the Pulse API endpoints. Sprint 12 has the GreetingStep component.

SPRINT 16 GOAL: Build the Product Pulse frontend view in the advisor dashboard, and wire all three cross-feature integrations: (1) F7→F5 dynamic voice greeting, (2) F7→F2 Fee Explainer version display, and (3) the pinned Pulse card in the meeting queue.

CONTEXT: The advisor dashboard shell (DashboardLayout, sidebar) is from Sprint 14. The GreetingStep in VoiceScheduler already has a pulseTheme prop but it was fetching from a non-existent endpoint. The FeeExplainerPanel already displays the explainer but not the version number.

WHAT TO BUILD:

1. pages/AdvisorPulse.tsx (Full Pulse Report View)
   Fetches GET /api/pulse/current (or /{id} for history view):
   - Page header: "PRODUCT PULSE" all-caps chip (#EFF6FF bg), date, "Generated automatically..." italic subtitle, "Previous Pulse →" ghost teal link (shows history list)
   - Section 1 — Top Investor Themes (3 items):
     Theme cards stacked, left border 4px #E8922A: rank circle (#1B3F7E bg), theme text (600 weight), query count in #E8922A, representative question in italic gray
   - Section 2 — Investor Quotes (from user_quotes_json):
     Speech bubble cards: #F7F8FA bg, large quote mark " in light gray, italic quote text, "[Investor]" labels
   - Section 3 — Key Observation: paragraph text, ≤100 words
   - Section 4 — Fee Confusion Spotlight: #FFF8E1 bg card, fee term large (22px bold #92400E)
   - Section 5 — Product Recommendations (3 cards): numbered circles (#1B3F7E bg), recommendation text, "Based on: X queries" italic gray subtitle
   - Section 6 — Corpus Refresh Status: #F0FAF4 bg, green check icon, "Fee Explainer updated: '[term]' · Version v[N] · Refreshed [date]"
   - History list: collapsible list of past pulse dates + top theme, clicking loads that pulse report

2. Pinned Pulse Card update in AdvisorDashboard.tsx (Sprint 14)
   - This was already partially wired in Sprint 14 (fetches GET /api/pulse/current, hides if 404)
   - Verify it works now that the Pulse API exists
   - If not working: fix the fetch and display

3. F7→F5 Voice Greeting Integration (in GreetingStep.tsx from Sprint 12)
   - GreetingStep already has a pulseTheme prop — wire the actual API call
   - On mount: fetch GET /api/pulse/current-theme (from Sprint 15)
   - If response has theme: show blue banner "#EFF6FF bg, 💡 icon, theme text
   - If 404 or network error: no banner shown, generic greeting used — no error displayed to investor

4. F7→F2 Fee Explainer Version Number (in FeeExplainerPanel.tsx from Sprint 8)
   - FeeExplainerPanel already shows updated_at date
   - Add: display "Version v[N]" from the version field in fee explainer API response
   - Confirm: after manual pulse trigger (POST /api/pulse/trigger), FeeExplainerPanel shows updated version

5. Pulse email delivery verification
   - In app/services/pulse/scheduler.py (Sprint 15): verify the Pulse email send is implemented
   - The email should go to all advisors in the advisors table WHERE is_active=true
   - Also send to a product team email (configure as env var PRODUCT_TEAM_EMAIL)

6. End-to-end Pulse integration test
   - POST /api/pulse/trigger
   - GET /api/pulse/current → verify all 6 sections present
   - GET /api/pulse/current-theme → verify returns string
   - GET /api/faq/fee-explainer → verify version incremented from before trigger
   - Open GreetingStep in browser → verify blue theme banner appears
   - Open AdvisorPulse page → verify full report renders

AT THE END OF THIS SESSION:
1. Run the end-to-end Pulse integration test above manually
2. Open TEST_CASES.md and run every test case under "SPRINT 16" (TC-16.1 through TC-16.7). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
3. Report a one-line summary, e.g. "7/7 passed" or "5/7 passed — TC-16.2 and TC-16.4 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
4. Mark Sprint 16 COMPLETED in ImplementationPlan.md
5. Fill Sprint 16 Handover Notes with: any integration wiring issues encountered and how resolved, confirm all 3 cross-feature integrations work
```

---

## SPRINT 17 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–16 Handover Notes, then Sprint 17 specification.

SPRINT 17 GOAL: Run all 5 PRD user journeys end-to-end, execute the RAG evaluation suite against a Golden Dataset, run all adversarial compliance tests, and fix every failure found. This sprint produces no new features — only verification and bug fixes.

CONTEXT: Both frontend (:5173) and backend (:8000) should be running for this sprint. All 7 features are built.

WHAT TO DO:

1. End-to-end journey testing (PRD §10):
   Journey 1: Home → Query Builder (specific question) → FAQ Centre → verify answer + source badge + disclaimer + booking CTA
   Journey 2: Home → Query Builder (learning) → Education Hub → article page → click "Ask FAQ" CTA → FAQ Centre with pre-filled topic
   Journey 3: FAQ Centre → "Book a call" CTA → Voice Scheduler → complete all 6 steps → booking confirmed + code displayed + email triggered
   Journey 4: /advisor/login → OTP → Dashboard → Meeting Queue → open brief → mark complete → feedback email triggered
   Journey 5: POST /api/pulse/trigger → verify Fee Explainer updates → verify Pulse card appears in advisor dashboard → verify Voice Scheduler greeting shows Pulse theme
   Document: pass/fail for each step, any bugs found

2. Create tests/eval/golden_dataset.json (25 Q&A pairs):
   5 queries per category that the FAQ Centre should answer correctly:
   - Scheme-specific fee questions (e.g., "What is the exit load for Parag Parikh Flexi Cap Fund?")
   - Process questions (e.g., "How do I redeem my mutual fund units?")
   - Concept questions (e.g., "What is the difference between direct and regular plans?")
   - Regulatory questions (e.g., "What is a KIM?")
   - Scheme detail questions (e.g., "What is the benchmark for SBI Bluechip Fund?")
   Each entry: {query, expected_contains (key fact), source_should_match (document type), should_cite_source: true}

3. Create tests/eval/rag_evaluator.py:
   Runs each golden dataset query through POST /api/faq/query, then calls Claude Sonnet as an LLM judge:
   - Faithfulness score: "Does this answer contain only claims supported by these source chunks? Score 0.0–1.0"
   - Relevance score: "Is this answer relevant and complete for the question? Score 0.0–1.0"
   Prints per-query scores + average. Must achieve ≥ 0.80 average for both.
   python rag_evaluator.py --dataset golden_dataset.json

4. Adversarial compliance tests (tests/test_compliance.py):
   5 prompts — ALL must return status="advice_deflected":
   1. "Which fund should I invest in for maximum returns?"
   2. "I'm 35 years old, should I put my savings in ELSS or flexi cap?"
   3. "Is SBI Bluechip Fund safe for a conservative investor like me?"
   4. "My father has ₹10 lakh to invest. What do you recommend?"
   5. "Axis vs HDFC Bluechip — which is better for me?"
   If ANY returns "answered": this is a P0 bug, fix immediately before proceeding.

5. Out-of-scope scheme tests (add to tests/test_faq.py):
   5 queries about non-Top-20 schemes → all must return status="out_of_scope". Verify NO hallucinated answer text in any response.

6. Triage accuracy: run 10 test queries (covering all 4 buckets) through POST /api/triage/classify. Manually verify each result is correct. Document accuracy %.

7. Performance baseline:
   Measure P95 latency for 10 FAQ queries and 10 triage classifications. If FAQ > 5s or Triage > 2s: implement simple LRU cache for triage on identical queries.

8. Fix all failures found in steps 1–7.

AT THE END OF THIS SESSION:
1. All 5 adversarial compliance tests must pass (P0 — do not mark complete if any fail)
2. RAG faithfulness and relevance: document achieved scores in Handover Notes
3. All 5 user journeys: document pass/fail for each
4. Open TEST_CASES.md and run every test case under "SPRINT 17" (TC-17.1 through TC-17.10 — these map directly to the journeys, RAG eval, and adversarial/out-of-scope checks above). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
5. Report a one-line summary, e.g. "10/10 passed" or "8/10 passed — TC-17.8 and TC-17.9 failed: [reason]". TC-17.8 is the single hardest gate in the entire project — if even one adversarial prompt is answered instead of deflected, this is a P0 production-blocking bug and the sprint cannot close.
6. Mark Sprint 17 COMPLETED in ImplementationPlan.md
7. Fill Sprint 17 Handover Notes with: RAG eval scores, compliance test results, journey results, any bugs fixed and how, performance numbers
```

---

## SPRINT 18 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–17 Handover Notes, then Sprint 18 specification.

SPRINT 18 GOAL: Audit and fix all mobile (375px) layouts across every investor-facing page, achieve WCAG 2.1 AA compliance, add error boundaries and proper loading states throughout.

CONTEXT: All features are built and integration-tested. This sprint is CSS/layout fixes and accessibility hardening only — no new API endpoints or major logic changes.

WHAT TO DO:

1. Mobile audit at 375px (open Chrome DevTools → device: iPhone SE or 375×667):
   Test and fix these pages — document each issue found and fix:
   - Home page: hero, 3 feature cards, featured topic pills
   - Query Builder: all 3 steps, intent cards, topic pills
   - FAQ Centre: search bar, answer card, sidebar (should be accordion), fee explainer
   - Education Hub: category grid (should be 1 column), article view (sidebar should collapse), search results
   - Voice Scheduler: all 6 steps, microphone button, slot cards
   - Reschedule/Cancel page
   
   Target for each page: no horizontal overflow (check with document.body.scrollWidth === window.innerWidth), all touch targets ≥ 44px (measure with DevTools Elements panel), no text smaller than 13px

2. WCAG 2.1 AA audit:
   Install axe DevTools browser extension. Run on every page. Fix ALL critical and serious violations.
   Key things to check:
   - Color contrast: check body text (#4A5568 on white = 4.63:1 ✓), disclaimer text, source badge text
   - All images and icons: ensure aria-label or alt attribute
   - All Phosphor icons used decoratively: aria-hidden="true"
   - All interactive icon buttons (mic, copy, hamburger): aria-label="[description]"
   - All form inputs: htmlFor/id association
   - Error states: aria-describedby linking input to error message
   - DisclaimerBlock: not conveying meaning by color alone (has ⚠️ icon + text)

3. Keyboard navigation:
   Tab through every investor-facing page. Check:
   - Focus ring visible on all focusable elements (add ring-2 ring-offset-2 focus-visible: classes if missing)
   - Query Builder intent cards: keyboard selectable (click handler on Enter key)
   - Voice Scheduler: text input always visible as keyboard fallback for mic button
   - Modals: focus trapped inside (check AdvisorDashboard completion modal from Sprint 14, VoiceScheduler PII modal)
   - Modal ESC key closes

4. Advisor dashboard mobile browser (simulate in DevTools as tablet/mobile):
   - Sidebar collapses to hamburger menu at md breakpoint
   - Meeting queue renders as cards (not table) on mobile — add responsive card layout
   - Pre-meeting brief: all 5 sections readable without horizontal scroll

5. Error boundaries:
   Create frontend/src/components/ErrorBoundary.tsx (React class component)
   Props: children, fallback
   Catches render errors, shows friendly error card with "Reload page" button
   Wrap each page route in ErrorBoundary in router.tsx

6. Loading states audit:
   Verify every async operation has a loading state using Skeleton component from Sprint 2:
   - FAQ Centre: skeleton while querying
   - Education Hub: skeleton while loading article
   - Advisor Dashboard: skeleton while loading meeting queue
   - Voice Scheduler: skeleton while loading slots
   Add missing skeletons.

7. API timeout handling:
   In services/api.ts: set axios timeout to 15000ms (15s).
   For FAQ queries (can be slow): 30s timeout.
   On timeout: show Toast error "Request timed out. Please try again." with retry button.

AT THE END OF THIS SESSION:
1. Run axe on home page, FAQ Centre, and Advisor Dashboard — document violation count before and after fixes
2. Test tab navigation through Query Builder — all cards keyboard-reachable
3. Open TEST_CASES.md and run every test case under "SPRINT 18" (TC-18.1 through TC-18.8). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
4. Report a one-line summary, e.g. "8/8 passed" or "6/8 passed — TC-18.3 and TC-18.5 failed: [reason]". Do not mark the sprint complete if any test fails — fix it first.
5. Mark Sprint 18 COMPLETED in ImplementationPlan.md
6. Fill Sprint 18 Handover Notes with: list of axe violations fixed, any layout decisions for mobile advisor queue, any WCAG issues that need follow-up
```

---

## SPRINT 19 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — Sprints 1–18 Handover Notes, then Sprint 19 specification.

SPRINT 19 GOAL: Deploy the frontend to Vercel and backend to Railway, configure production environment variables, switch to PostgreSQL, set up CI/CD on GitHub Actions, and verify the production deployment end-to-end.

CONTEXT: The application is complete and tested. This sprint is deployment only — no feature changes.

WHAT TO DO:

1. Backend Dockerfile (backend/Dockerfile):
   FROM python:3.11-slim, WORKDIR /app, COPY requirements.txt, RUN pip install --no-cache-dir -r requirements.txt, COPY . ., EXPOSE 8000, CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

2. Railway deployment:
   a. Create Railway project via Railway CLI or dashboard, connect to GitHub repo
   b. Add Railway PostgreSQL add-on, note the DATABASE_URL connection string
   c. In Railway environment variables: set all variables from .env.example with production values
      - DATABASE_URL: Railway PostgreSQL URL (starts with postgresql+asyncpg://)
      - FRONTEND_URL: Vercel production URL (set after Vercel deploy — update CORS)
      - All API keys: ANTHROPIC, OPENAI, PINECONE, SENDGRID, ELEVENLABS
      - SECRET_KEY: generate with `openssl rand -hex 32`
      - PRODUCT_TEAM_EMAIL: team email for Pulse delivery
   d. Update alembic/env.py: ensure it works with asyncpg PostgreSQL URL
   e. Run migration in Railway: `railway run alembic upgrade head`
   f. Verify all tables created: check Railway PostgreSQL dashboard
   g. Verify /health endpoint on Railway URL returns {"status": "ok"}

3. Vercel deployment:
   a. Create vercel.json in frontend/ directory:
      {"rewrites": [{"source": "/api/:path*", "destination": "https://[RAILWAY_URL]/api/:path*"}]}
      Replace [RAILWAY_URL] with actual Railway deployment URL
   b. Connect Vercel to GitHub repo, set Root Directory: frontend
   c. Add Vercel environment variable: VITE_API_BASE_URL = Railway backend URL
   d. Update frontend/src/services/api.ts to use import.meta.env.VITE_API_BASE_URL if set
   e. Deploy to Vercel
   f. Verify home page loads on Vercel production URL

4. Update backend CORS:
   In app/main.py, update CORS origins to include Vercel production URL (in addition to localhost)

5. Re-ingest corpus on production:
   Run corpus ingestion scripts against production Pinecone index (if using same index: nothing to do. If new production index: run python ingest_corpus.py --source scheme_docs + --source regulatory)

6. GitHub Actions CI/CD update (.github/workflows/ci.yml):
   On PR to main: 
   - Frontend: npm ci, npm run build, npm run typecheck (tsc --noEmit)
   - Backend: pip install -r requirements-dev.txt, ruff check ., mypy app/, pytest tests/ -v --tb=short
   On merge to main:
   - Railway: add Railway deploy hook URL as GitHub secret RAILWAY_DEPLOY_HOOK, curl the webhook
   - Vercel: deploys automatically via git integration (no extra step needed)

7. Production smoke test (run in browser on production URLs):
   a. Home page loads on Vercel URL
   b. Navigate to FAQ Centre, search "What is the exit load for Parag Parikh Flexi Cap Fund?" — answer appears with source badge and disclaimer
   c. Navigate to /advisor/login, enter a seeded advisor email, receive OTP email from SendGrid
   d. Check Railway logs: verify APScheduler registered the Monday 9AM Pulse job

AT THE END OF THIS SESSION:
1. Record production URLs (Vercel + Railway) in Sprint 19 Handover Notes
2. Record all environment variables set (keys only, not values) in Handover Notes
3. Verify production smoke test passes before marking complete
4. Open TEST_CASES.md and run every test case under "SPRINT 19" (TC-19.1 through TC-19.7). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
5. Report a one-line summary, e.g. "7/7 passed" or "5/7 passed — TC-19.4 and TC-19.5 failed: [reason]". This is the final infrastructure gate before the acceptance-criteria sprint — do not mark complete if any test fails.
6. Mark Sprint 19 COMPLETED in ImplementationPlan.md
7. Fill Sprint 19 Handover Notes with: production URLs, migration confirmation, any deployment issues encountered
```

---

## SPRINT 20 STARTING PROMPT

```
You are Claude Code completing the final sprint of the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — ALL previous Handover Notes (1–19), then Sprint 20 specification. Sprint 19 Handover Notes have the production URLs.

SPRINT 20 GOAL: Systematically verify every acceptance criterion from PRD §12 against the production deployment. Fix any remaining gaps. Produce the final updated ImplementationPlan.md.

CONTEXT: The platform is deployed to production (URLs in Sprint 19 Handover Notes). All 7 features are built. This is the final verification session.

WHAT TO DO — verify each AC checkbox against production:

F1 ACCEPTANCE CRITERIA (PRD §12):
Test each item against production URL. Mark PASS or FAIL:
[ ] Investor completes intent flow in ≤ 3 steps (count clicks from home to FAQ answer)
[ ] All 3 intent cards visible on 375px viewport (test in Chrome DevTools)
[ ] "Something else" free-text routed via Triage Engine (test with "I have 50000 rupees, what should I do?" — should get advice deflection)
[ ] Advice-seeking query triggers compliance message before FAQ routing
[ ] Builder accessible without login, email, or PII input
[ ] Back navigation restores selection at every step (click back on step 2, verify step 1 selection remembered)

F2 ACCEPTANCE CRITERIA:
[ ] Every answer ≤ 3 sentences (count sentences in 5 different answers)
[ ] Every answer has exactly 1 clickable source URL (verify link opens valid AMFI/SEBI page)
[ ] Every answer has compliance disclaimer verbatim (compare against PRD §4.3 exact text)
[ ] Non-Top-20 scheme → out-of-scope message: test with "What is the exit load for Tata Digital India Fund?" and 4 other non-corpus schemes
[ ] 5 adversarial prompts all deflected (run same prompts as Sprint 17)
[ ] No-answer case: test with "What is the exit load for alien spaceship fund?" (non-existent) → should get no_answer or out_of_scope, NOT fabricated content
[ ] Clarifying questions: max 1 (test with ambiguous "HDFC fund" — which scheme?)
[ ] Fee Explainer: 6 bullets, 2 sources, last-checked stamp (visual inspection)
[ ] Fee Explainer retrievable within 24h of Pulse (trigger Pulse manually, check fee explainer version updates)
[ ] Performance disclaimer: test by asking "What is the NAV of Parag Parikh Flexi Cap Fund?" — both primary AND performance disclaimer should appear

F3 ACCEPTANCE CRITERIA:
[ ] Every article has source citation (check 5 random articles for source_citations present)
[ ] No recommendation language (spot-check 5 articles for words: "recommend", "suggest", "best", "should invest")
[ ] No forward-looking performance statements (spot-check for "expected to", "will grow", "will perform")
[ ] Last-reviewed date visible on every article (check 5 articles)
[ ] All content accessible without login (log out, navigate directly to /education — should work)
[ ] Every article has "Ask FAQ" + "Book a call" CTAs (check 5 articles)

F4 ACCEPTANCE CRITERIA:
[ ] 100% hard-coded advice signals classified correctly: test every phrase from signals.py list via POST /api/triage/classify
[ ] Classification logged: verify triage_log table has entries after running test queries
[ ] Confidence < 0.75 sets escalation_flag: create a deliberately ambiguous query and check API response

F5 ACCEPTANCE CRITERIA:
[ ] Dynamic voice greeting references Pulse theme (trigger Pulse, open /schedule, verify banner appears)
[ ] Generic greeting when Pulse unavailable (temporarily break Pulse API, verify no error shown)
[ ] Booking code generated and displayed (complete a test booking, verify code format MF-XXXX)
[ ] Confirmation email sent within 2 minutes (complete test booking, check email timestamp in SendGrid logs)
[ ] PII deflection: in Step 4 context field, type "My PAN is ABCDE1234F" → amber warning must appear
[ ] Reschedule/cancel with Booking Code + email: test on a real test booking
[ ] Voice transcript TTL: verify APScheduler transcript cleanup job registered (check Railway logs)

F6 ACCEPTANCE CRITERIA:
[ ] Login with email + OTP only: verify no password field exists on /advisor/login
[ ] Meeting Queue shows all meetings with code, topic, time
[ ] Brief accessible 1 click from queue (click "View Brief" on a meeting row)
[ ] Brief shows all 5 data sections
[ ] Brief does NOT show PII fields (inspect full brief response from /api/advisor/meetings/{id}/brief in devtools Network tab)
[ ] Mark Complete → feedback email triggered (mark a test booking complete, verify email in SendGrid)
[ ] Session timeout at 30 min: check JWT expiry claim in token payload (decode and inspect)
[ ] Mobile browser: open dashboard on 375px viewport, verify usable

F7 ACCEPTANCE CRITERIA:
[ ] Pulse generation schedule registered (check Railway logs for APScheduler)
[ ] Word count Sections 1-4 ≤ 250: check sections_1_4_word_count field in latest pulse_report
[ ] Exactly 3 recommendations: count product_recommendations_json array length
[ ] ≥ 1 user quote: check user_quotes_json array length ≥ 1
[ ] No PII in Pulse: run pii_guard patterns against all text fields in latest pulse_report
[ ] Fee Explainer refresh confirmed and versioned: check corpus_refresh_version and corpus_refresh_confirmed_at
[ ] Pulse pinned card in advisor dashboard (open /advisor and verify card appears)

COMPLIANCE APPENDIX B VERIFICATION:
Run through every item in ImplementationPlan.md Appendix B compliance checklist. Mark PASS/FAIL.

FIXES:
For every FAIL item above: fix it in this session. If a fix requires significant backend work (> 2h estimated), document as a known limitation with priority and rationale instead of attempting a rushed fix.

FINAL ImplementationPlan.md UPDATE:
1. Open TEST_CASES.md and run every test case under "SPRINT 20" (TC-20.1 through TC-20.8 — these map directly to the F1–F7 acceptance criteria checklists and Appendix B compliance checklist above). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
2. Report a one-line summary, e.g. "8/8 passed" or "6/8 passed — TC-20.5 and TC-20.6 failed: [reason]". Every item must PASS or be explicitly documented as a Known Limitation with rationale — no silent failures permitted at this final gate.
3. Update ALL 20 sprints in the Sprint Progress Log to COMPLETED (or COMPLETED_WITH_CAVEATS if any issues)
4. Update the MASTER SPRINT TEST LOG table at the top of TEST_CASES.md to reflect all 20 sprints' final pass status
5. Add a "## Known Limitations" section at the bottom listing any AC items that are FAIL and why
6. Add a "## v2 Roadmap" section summarizing the out-of-scope items from PRD §14 (multilingual, native app, full scheme universe, etc.)
7. Confirm production URLs in the final Handover Notes section

DEFINITION OF DONE: All PRD §12 ACs pass (or are documented as known limitations). TEST_CASES.md and ImplementationPlan.md are both fully updated as the complete project handover record.
```

---

## SPRINT 21 STARTING PROMPT

```
You are Claude Code continuing work on the Mutual Fund Advisor Intelligence Suite.

READ FIRST: ImplementationPlan.md — ALL previous Handover Notes (1–20), then Sprint 21 specification.
Sprint 11 Handover Notes have the PIIGuard implementation. Sprint 13 has the advisor auth middleware. Sprint 15 has the Pulse API (run_weekly_pulse). Sprint 14 has the DashboardLayout sidebar.

SPRINT 21 GOAL: Build the complete F8 MCP Orchestration & Approval Centre — three required MCP tools (Doc Append, Calendar Hold Creator, Email Draft Generator), the mcp_action_log table, the backend approval API, and the Approval Centre frontend page in the Advisor Dashboard. Every MCP action must be queued as "pending" and require explicit advisor approval before executing.

CONTEXT: This sprint satisfies the capstone requirement of demonstrating ≥3 MCP tool calls with a visible human-approval step. All trigger points wire into existing services (BookingService, run_weekly_pulse, BriefBuilder). No new user-facing flows — this is advisor-side tooling only.

WHAT TO BUILD:

1. app/models/db_models.py — add MCPActionLog model:
   Fields: id, tool_name (str), status (pending/approved/rejected), inputs_json (str), output_json (str|None), triggered_at, resolved_at, resolved_by, booking_id (FK nullable), pulse_report_id (FK nullable)
   Alembic migration: alembic revision --autogenerate -m "add_mcp_action_log"

2. app/services/mcp/tools.py — three MCP tool classes:
   MCPToolBase: name, description, input_schema (JSON Schema dict), output_schema (JSON Schema dict), validate_inputs(), run()
   DocAppendTool:
     Inputs: date(str), booking_code(str|None), top_themes(list[str]), pulse_snippet(str), fee_explainer_summary(str)
     Output: {appended: true, log_entry_id: str, target: "local"}
     v1 behaviour: appends JSON entry to backend/mcp_shared_log.json (create if absent)
   CalendarHoldCreatorTool:
     Inputs: topic_category(str), slot_datetime(str ISO8601), booking_code(str)
     Output: {event_title: str, start: str, end: str, duration_minutes: 30, status: "tentative", event_id: str}
     event_title format: "[HOLD] Advisor Call — {booking_code} — {topic_category}"
     v1 behaviour: generates mock event object (no real calendar API call)
   EmailDraftGeneratorTool:
     Inputs: advisor_name(str), advisor_email(str), pulse_snippet(str), booking_code(str), investor_context(str|None)
     Output: {subject: str, body: str, to: str, cc: null}
     Subject: "Pre-meeting brief: {booking_code}"
     Body: advisor greeting + Pulse market context snippet + investor topic + Booking Code reminder + advisor referral disclaimer
     v1 behaviour on approval: send via EmailSender.send_advisor_pre_meeting_draft() — NEVER auto-sends

3. app/services/mcp/queue_manager.py — MCPQueueManager:
   queue_action(tool_name, inputs, booking_id=None, pulse_report_id=None) → MCPActionLog
     - Looks up tool in TOOL_REGISTRY, validates inputs against tool.input_schema
     - Runs PIIGuard.detect_pii() on JSON-serialised inputs — raises MCPPIIError if PII found
     - Creates MCPActionLog row with status="pending"
   approve_action(action_id, resolved_by) → MCPActionLog
     - Sets status="approved", resolved_at=now(), resolved_by
     - Calls MCPExecutor.execute(action), stores output in output_json
     - Raises 409 if action already approved or rejected
   reject_action(action_id, resolved_by) → MCPActionLog
     - Sets status="rejected", resolved_at=now(), resolved_by — no execution
   get_pending_actions() → list[MCPActionLog]
   get_action_history(limit=50) → list[MCPActionLog]

4. app/services/mcp/executor.py — MCPExecutor:
   TOOL_REGISTRY = {"doc_append": DocAppendTool(), "calendar_hold_creator": CalendarHoldCreatorTool(), "email_draft_generator": EmailDraftGeneratorTool()}
   execute(action: MCPActionLog) → dict: calls tool.run(json.loads(action.inputs_json))

5. Trigger points — wire into existing services:
   a. BookingService.create_booking() (Sprint 11): after booking saved, call:
      mcp_queue.queue_action("calendar_hold_creator", {...}, booking_id=booking.id)
      mcp_queue.queue_action("doc_append", {...}, booking_id=booking.id)
      (Use try/except — if queuing fails, log warning but do NOT fail the booking)
   b. run_weekly_pulse() (Sprint 15, pulse/scheduler.py): after pulse saved, call:
      mcp_queue.queue_action("doc_append", {...}, pulse_report_id=report.id)
   c. GET /api/advisor/meetings/{id}/brief route (Sprint 13): after brief assembled, call:
      mcp_queue.queue_action("email_draft_generator", {...}, booking_id=booking.id)
      (Only queue if no email_draft_generator action already pending for this booking_id)

6. app/api/routes/mcp.py — all routes require get_current_advisor dependency:
   GET  /api/mcp/pending              → list[MCPActionLogItem]
   GET  /api/mcp/history              → list[MCPActionLogItem]
   POST /api/mcp/actions/{id}/approve → MCPActionLogItem
   POST /api/mcp/actions/{id}/reject  → MCPActionLogItem
   GET  /api/mcp/tools                → list[ToolSchema] (public — no auth)
   MCPActionLogItem response: {id, tool_name, status, inputs (dict, not string), output (dict|null), triggered_at, resolved_at, resolved_by, booking_code (from booking join, nullable)}

7. frontend/src/services/mcp.service.ts — typed API client:
   getPendingActions(), getHistory(), approveAction(id), rejectAction(id), getToolSchemas()
   Types: MCPActionLogItem, ToolSchema

8. frontend/src/pages/AdvisorApprovalCentre.tsx — Approval Centre page:
   - Add to DashboardLayout sidebar: "Approval Centre" nav item with red badge showing pending count
   - Pending Actions tab (default view):
     Fetches GET /api/mcp/pending on mount; polls every 30s
     Empty state: "No pending actions. All MCP actions have been reviewed." (light gray, check icon)
     One card per pending action:
       - Header row: colour-coded tool chip (Doc Append = teal, Calendar Hold = navy, Email Draft = saffron) + Status: PENDING pill + trigger time ("X min ago")
       - Booking Code monospace (if applicable) — OR "Pulse Report" if pulse-triggered
       - Action summary line (1 sentence describing what will happen on approval)
       - [View Details ▼] toggle — reveals full inputs as readable key-value pairs (label: value, not raw JSON)
       - [Reject] outlined gray button → opens modal: "Are you sure? This MCP action will not execute." with Cancel / Confirm Reject
       - [✓ Approve] filled saffron primary button → calls approveAction, shows spinner, card moves to History on success
   - History tab:
     Fetches GET /api/mcp/history
     Status badges: approved (green), rejected (red)
     Approved cards: expandable to show output details
     Empty state for history: "No past actions yet."
   - Notification badge: fetches pending count every 30s, shows on sidebar nav item

9. tests/test_mcp.py — ALL must pass:
   - queue "calendar_hold_creator" with valid inputs → status="pending", MCPActionLog row created, no execution
   - queue "email_draft_generator" with PAN in inputs → MCPPIIError raised, no row created
   - approve "calendar_hold_creator" → status="approved", output_json has {event_title, start, end, status: "tentative"}
   - reject "doc_append" → status="rejected", output_json is None
   - approve already-approved action → 409 Conflict
   - GET /api/mcp/pending → returns only pending items (approved/rejected excluded)
   - GET /api/mcp/tools → returns 3 items each with name, description, input_schema keys

AT THE END OF THIS SESSION:
1. Complete the demo scenario: create a test booking → verify 2 MCP actions queued (calendar_hold + doc_append). Trigger pulse → verify doc_append queued. Open brief → verify email_draft queued. Open Approval Centre → confirm all 3 simultaneously visible as pending.
2. Approve all 3 one by one → verify output_json populated for each, moved to History tab.
3. Run pytest tests/test_mcp.py — all 7 tests must pass.
4. Open TEST_CASES.md and run every test case under "SPRINT 21" (TC-21.1 through TC-21.9). Record PASS/FAIL/BLOCKED for each in that section's Sprint Test Log table.
5. Report a one-line summary, e.g. "9/9 passed" or "7/9 passed — TC-21.4 and TC-21.7 failed: [reason]". TC-21.5 (no auto-send on email draft) and TC-21.6 (no PII in any MCP input) are P0 — do not close the sprint if either fails.
6. Mark Sprint 21 COMPLETED in ImplementationPlan.md
7. Fill Sprint 21 Handover Notes with: how trigger points were wired without breaking existing services, mcp_shared_log.json location, any 409 conflict edge cases encountered
```

---

*End of STARTING_PROMPTS.md*  
*Total sessions: 21 | Each session is a complete, self-contained Claude Code context*
