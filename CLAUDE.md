# CLAUDE.md

## Project
Mutual Fund Advisor Intelligence Suite — an AI-powered web platform for Indian retail investors and SEBI-registered investment advisors. Provides RAG-grounded factual mutual fund information and routes advice-seeking queries to human advisors. The platform itself never gives investment advice.

## Status
Design phase complete. No application code exists yet. Implementation starts at Sprint 1.

## How work is organized
- `ImplementationPlan.md` — 20-sprint build plan, one Claude Code session per sprint. **Read its "CRITICAL PROTOCOL" section before any sprint work.**
- `STARTING_PROMPTS.md` — the exact starting prompt for each sprint session.
- `TEST_CASES.md` — sprint test gate. A sprint's tests must all pass before moving to the next.
- `PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md` — full requirements. §4 (Regulatory Framework) is non-negotiable.
- `DESIGN.md` — design system (colors, fonts, component specs).

## Hard compliance rules — never violate, in code or copy
- Never recommend, rank, or imply preference between funds, plan types (Direct/Regular), or categories.
- Never run risk profiling or derive a fund suggestion from any investor input.
- Never accept or store PAN, Aadhaar, folio numbers, or account numbers.
- Every FAQ/Education answer must show a source citation + the primary disclaimer (exact text in `ImplementationPlan.md` → "Shared Constants").
- Out-of-scope-scheme responses (neutral/gray) and advice-deflection responses (amber) are visually distinct — never merge their styling.
- Advisor-facing views (meeting queue, calendar) show Booking Code + topic category only — never the investor's name.

## Tech stack (locked — see ImplementationPlan.md "Technology Decisions")
React + Vite + TypeScript + Tailwind · Python 3.11 + FastAPI · LangChain + Pinecone · Claude Sonnet (Anthropic) · SQLite→PostgreSQL · Vercel (frontend) + Railway/Render (backend)

## Conventions
- Booking code format: `MF-XXXX` (4 uppercase alphanumeric).
- The Top 20 scheme list (`backend/corpus/sources/top20_schemes.json`, created in Sprint 1) is locked — never invent or substitute scheme names anywhere in the app.

## End of every sprint
Run that sprint's tests in `TEST_CASES.md` and log results, then update `ImplementationPlan.md`'s Sprint Progress Log + Handover Notes before closing the session.
