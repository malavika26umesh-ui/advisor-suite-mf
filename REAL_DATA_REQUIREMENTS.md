# Real Data Requirements — Mutual Fund Advisor Intelligence Suite

Cross-referenced from `problem_Statement.md` (original capstone brief), `PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md`, and `ImplementationPlan.md`. Captures every place the system needs real-world (non-synthetic, non-mocked) data or a real external service to actually function or be demoable.

**Current state (verified live, as of this audit):** corpus has 0 real PDFs, `source_manifest.json` lists 2 of 20 schemes (one mismatched), Pinecone has 5 total vectors (target ≥1,000), and most named LLM/embedding integrations have been silently running on mock fallbacks due to an env-loading bug (see Sprint 15 handover notes in `ImplementationPlan.md`).

---

## 1. Scheme & Regulatory Corpus (RAG grounding)

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 1 | Top 20 scheme list, locked against live AUM ranking | AMFI Monthly Report — `amfiindia.com/research-information/amfi-monthly` | PRD Appendix A | Static list exists (`top20_schemes.json`) but never validated against a live AMFI ranking |
| 2 | SID (Scheme Information Document) for each of 20 schemes | Each AMC's own website (PPFAS, HDFC, SBI, ICICI Pru, Nippon India, Kotak, Axis, Mirae Asset, Aditya Birla SL, UTI, DSP, Quant, Motilal Oswal) | PRD §9, ImplementationPlan Sprint 6 | **0 PDFs on disk.** Manifest has 2 placeholder entries with unverified URLs |
| 3 | KIM (Key Information Memorandum) for each scheme | Same AMC websites | PRD §9 | Not sourced |
| 4 | Current factsheet for each scheme | Same AMC websites | PRD §9 | Not sourced |
| 5 | SEBI Circular — Total Expense Ratio (Oct 2018) | sebi.gov.in circular archive | PRD §4.3 | Not sourced (only generic `sebi.gov.in` homepage cited) |
| 6 | SEBI Circular — Risk-o-Meter (Jan 2021) | sebi.gov.in circular archive | PRD §4.3 | Not sourced |
| 7 | SEBI scheme-categorization circular (defines Large/Mid/Small Cap etc.) | sebi.gov.in | PRD §8.3 | Not sourced — Education Hub content written from general knowledge, cites homepage only |
| 8 | AMFI Code of Ethics for MF Distributors | amfiindia.com | PRD §4.3 | Not sourced |
| 9 | AMFI Best Practices Circular No. 135 (Investor Communication Standards) | amfiindia.com | PRD §4.3 | Not sourced |
| 10 | ≥30 source URLs total across the manifest (AMFI investor-education pages, SEBI circulars, Zerodha Varsity articles) | amfiindia.com, sebi.gov.in, zerodha.com/varsity | problem_Statement.md "Data Requirements"; PRD §9 | **Only 4 URLs currently in the manifest** (2 scheme docs + 2 regulatory) |
| 11 | Zerodha Varsity licensing decision (use as corpus source vs. link-out only) | zerodha.com/varsity | PRD §15 Open Questions (OQ-2) | Unresolved; not used at all currently |

## 2. NAV & Market Data

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 12 | Nightly NAV refresh for Top 20 schemes | `api.mfapi.in/mf` (primary integration already coded) | PRD §13, ImplementationPlan Sprint 6 | Script exists (`refresh_nav.py`) and runs; 2 schemes (Parag Parikh, SBI Bluechip) have known lookup mismatches |
| 13 | AMFI direct NAV fallback | amfiindia.com | PRD §13/§15 (named fallback hierarchy) | Not implemented — only mfapi.in is wired, no fallback if it's down |
| 14 | Secondary NAV/holdings fallback | mfdata.in | PRD §9/§15 | Not implemented at all |

## 3. Compliance, Evaluation & Test Data

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 15 | Golden Dataset — 5 hand-curated Q&A pairs spanning scheme facts + fee logic, for RAG faithfulness/relevance/citation evals | Constructed from real Top 20 scheme SID data | PRD §11, §15; ImplementationPlan Sprint 17 | Not built yet (scoped for Sprint 17, not reached) |
| 16 | 5 adversarial test prompts (investment-advice requests, PII extraction, out-of-scope escalation) for the Compliance/Safety eval | Hand-crafted, but must reflect realistic attack patterns | problem_Statement.md "AI Evaluations" §2; PRD §12 | Some adversarial test cases exist in `TEST_CASES.md`/`test_faq.py` but not packaged as a dedicated, documented eval suite |
| 17 | Manual compliance audit sample (human review of FAQ answers for leaked advice) | Real human reviewer | PRD §11 Success Metrics | Not established as a process |
| 18 | Out-of-scope test queries — ≥5 real non-Top-20 scheme names | Real scheme names (e.g. Reliance Growth Fund — already used in tests) | PRD §12 | Done — covered in triage tests |

## 4. Review/Feedback Data (Product Pulse input)

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 19 | Raw reviews CSV, 30–50 entries spanning 8–12 weeks, processed into the Weekly Pulse | Simulated or scraped (capstone brief explicitly allows simulated) | problem_Statement.md §2 "Review Intelligence" | **Not built.** Current Sprint 15 implementation aggregates from the platform's own `session_faq_log`/`bookings`/`post_meeting_feedback` tables instead of a reviews CSV — a different (arguably more realistic for a live product, but spec-deviating) data source |
| 20 | Investor post-meeting feedback (real ratings: very/somewhat/not useful) | Real investor responses once the app has real users | PRD §8.6/§8.7 | Table + endpoint exist (Sprint 15); no real respondents yet — needs live usage or seeded realistic sample data |
| 21 | Real FAQ/voice query volume to drive genuine "top themes" in Pulse | Real investor usage | PRD §8.7 | Currently near-zero real query volume in the relevant aggregation window — verified live trigger fell back to the zero-data deterministic path |

## 5. Voice / STT / TTS

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 22 | Speech-to-text | OpenAI Whisper (PRD) — project substituted Web Speech API (browser) + Sarvam AI as fallback | PRD §13 | Sarvam integration coded but `SARVAM_API_KEY` never reaches the service (same env-loading bug as Groq — see Sprint 15 notes); effectively untested with real audio |
| 23 | Text-to-speech for voice agent greeting | ElevenLabs or Google Cloud TTS | PRD §13 | Not implemented at all — no TTS code exists yet |
| 24 | Sample voice transcript for demo/deliverables | Real recorded session | problem_Statement.md "Deliverables" | Not recorded |

## 6. Advisor & Operational Data

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 25 | Real SEBI-registered advisor roster (RIA registration numbers, verified) | SEBI RIA public registry | PRD §5 Persona B, §15 Open Questions (OQ-1) | Two seeded advisors with plausible-format but **unverified, not-real** SEBI registration numbers (`INA100000123`, `INA100000124`) |
| 26 | Advisor onboarding agreements/process | Real legal/business process | PRD §15 OQ-1 | Not addressed — out of engineering scope, needs a business-side decision |
| 27 | Real advisor availability/calendar data | Real advisors' actual schedules | PRD §8.6 | Seeded synthetic slots only |

## 7. Infrastructure & Third-Party Services

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 28 | LLM API | PRD names GPT-4o/Claude Sonnet; project uses Groq (Llama models) throughout | PRD §13 | Groq key present in `.env` but wasn't actually reaching any service until fixed in Sprint 15 for Pulse only; classifier/answer_builder still affected |
| 29 | Embeddings | PRD names OpenAI `text-embedding-3-small`; project uses free HuggingFace `all-MiniLM-L6-v2` | PRD §13 | Coded; only verified with 5 test vectors total |
| 30 | Vector store | Pinecone (PRD-named, free tier) | PRD §13 | Real index exists (`mf-advisor-suite`), essentially empty |
| 31 | Transactional email | SendGrid or AWS SES | PRD §13 | SendGrid coded; no `SENDGRID_API_KEY` provisioned — all emails currently mocked (printed, not sent) |
| 32 | Cloud hosting (India-resident, AWS/GCP Mumbai) | AWS Mumbai or GCP Mumbai region | PRD §13 (data residency compliance) | Not deployed anywhere yet |
| 33 | Public deployment URL | Vercel (frontend) + Railway/Render (backend), per ImplementationPlan | problem_Statement.md "Deliverables"; PRD | Not deployed (see earlier deployment-readiness discussion) |

## 8. MCP Orchestration Layer — entirely unbuilt

| # | Data Needed | Real Source | Required By | Current Status |
|---|---|---|---|---|
| 34 | Notes/Doc Append tool — shared Google Doc/Notion page, or local `mcp_shared_log.json` for v1 | Google Docs/Notion API, or local file | problem_Statement.md "MCP Integration" (required); PRD §8.8 | **Not built at all.** No MCP tools exist anywhere in the 20-sprint `ImplementationPlan.md` |
| 35 | Calendar Hold Creator — real or mocked Google Calendar entry | Google Calendar API (or mock, per PRD v1 allowance) | problem_Statement.md (required); PRD §8.8 | Not built |
| 36 | Email Draft Generator — approval-gated draft before send | SendGrid (already named elsewhere) | problem_Statement.md (required); PRD §8.8 | Not built |
| 37 | Approval Centre UI (approve/reject pending MCP actions) | N/A (internal UI) | problem_Statement.md "Companion UI" (required) | Not built |

## 9. Deliverables Requiring Real-World Artifacts

| # | Item | Required By | Current Status |
|---|---|---|---|
| 38 | 5-minute demo video (CSV→Pulse, Pulse theme in voice greeting, completed voice booking, Approval Centre demo, FAQ multi-part answer, one eval running live) | problem_Statement.md "Deliverables" | Not created — and several of its required scenes (Approval Centre, reviews CSV) don't exist to film |
| 39 | README with architecture, MCP tool list, source manifest, "how to run evals" | problem_Statement.md "Deliverables" | Partial — `ImplementationPlan.md`/`TEST_CASES.md` cover architecture and ad hoc testing, but no consolidated README in this format |
| 40 | Sample Q&A pairs + voice transcript in repo | problem_Statement.md "Deliverables" | Not assembled as a deliverable artifact |

---

## Scope Note: `problem_Statement.md` vs. what was actually built

The original capstone brief (`problem_Statement.md`) and the PRD the team actually built against have **diverged**:

- **Brief scope:** 1 AMC, 3–5 schemes, reviews CSV (30–50 rows) as Pulse input, mock calendar slots, MCP tools + Approval Centre required, 3 named evals, 5-minute demo video.
- **PRD/ImplementationPlan scope:** 13 AMCs, 20 schemes, Pulse fed from the platform's own internal usage logs instead of a reviews CSV, full advisor OTP-authenticated dashboard, no MCP/Approval Centre anywhere in the 20 sprints.

If grading is against `problem_Statement.md` specifically, **items 19, 20 (partially), and 34–37 are the highest-risk gaps** — an entire required subsystem (MCP + Approval Centre) and the specified Pulse input mechanism (reviews CSV) are absent from the current build.

## Suggested Priority Order

1. **Corpus (items 1–11)** — nothing else in the RAG/FAQ/Education pillars is real without this; start with 3–5 schemes from one AMC to match the brief's own scope-reduction allowance.
2. **MCP tools + Approval Centre (items 34–37)** — explicitly "required," currently 0% built; likely the single biggest grading risk if the brief is the rubric.
3. **Reviews CSV pipeline (item 19)** — either build it to match the brief literally, or explicitly document the deviation (internal-usage-log aggregation) as a deliberate design decision in the README.
4. **Real advisor roster + SendGrid key (items 25, 31)** — needed to make booking confirmations and the advisor dashboard demo-able with real email delivery.
5. **Deployment (items 32–33)** — needed for the "Deployed application link" deliverable regardless of which spec you're grading against.
6. **Golden Dataset + adversarial eval suite, packaged (items 15–17)** — needed for the "at least one eval running live" demo requirement.
