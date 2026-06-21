# Mutual Fund Advisor Intelligence Suite

AI-powered web platform for Indian retail investors and SEBI-registered investment advisors. See `../PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md` for the full requirements and `../ImplementationPlan.md` for the build plan.

## Live Deployment

- **Frontend:** https://advisor-suite-mf-frontend.vercel.app (Vercel)
- **Backend API:** https://advisor-suite-mf.onrender.com (Render — free tier; first request after idle may take 10–30s to cold-start)
- **Health check:** https://advisor-suite-mf.onrender.com/health

## Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy ..\.env.example ..\.env  # then fill in API keys
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`. Health check: `GET /health`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. API calls to `/api/*` are proxied to the backend on `:8000`.

## Project Structure

See `../ImplementationPlan.md` → "Repository Structure" for the full target layout.

## Tech Stack

React 18 + Vite + TypeScript + Tailwind CSS · Python 3.11+ + FastAPI + SQLAlchemy + Alembic · LangChain + ChromaDB (FAQ Centre live scheme data) + Pinecone (Education Hub) · Groq (LLM) · SQLite (dev) / PostgreSQL (prod)

## FAQ Centre — Covered Mutual Fund Schemes

The FAQ Centre's scope is locked to 20 schemes (`backend/corpus/sources/top20_schemes.json`) — it will never invent or substitute a scheme name outside this list. Of those 20, **10 currently have live data** (NAV, AUM, Exit Load), scraped daily at 10:00 IST from public scheme pages and stored in ChromaDB. The remaining 10 are recognized as in-scope but have no live data yet — pending source URLs.

| # | Scheme | Category | Live data (NAV/AUM/Exit Load) |
|---|--------|----------|-------------------------------|
| 1 | Parag Parikh Flexi Cap Fund | Flexi Cap | ✅ |
| 2 | SBI Bluechip Fund | Large Cap | ✅ |
| 3 | ICICI Prudential Bluechip Fund | Large Cap | ✅ |
| 4 | HDFC Flexi Cap Fund | Flexi Cap | ✅ |
| 5 | ICICI Prudential Value Discovery Fund | Value / Flexi Cap | ✅ |
| 6 | Nippon India Large Cap Fund | Large Cap | ✅ |
| 7 | Nippon India Small Cap Fund | Small Cap | ✅ |
| 8 | SBI Small Cap Fund | Small Cap | ✅ |
| 9 | HDFC Mid-Cap Opportunities Fund | Mid Cap | ✅ |
| 10 | Kotak Emerging Equity Fund | Mid Cap | ✅ |
| 11 | Axis Bluechip Fund | Large Cap | Recognized only |
| 12 | Mirae Asset Large Cap Fund | Large Cap | Recognized only |
| 13 | Aditya Birla Sun Life Flexi Cap Fund | Flexi Cap | Recognized only |
| 14 | UTI Nifty 50 Index Fund | Index Fund | Recognized only |
| 15 | HDFC Nifty 50 Index Fund | Index Fund | Recognized only |
| 16 | Axis Long Term Equity Fund | ELSS | Recognized only |
| 17 | Mirae Asset Tax Saver Fund | ELSS | Recognized only |
| 18 | DSP Flexi Cap Fund | Flexi Cap | Recognized only |
| 19 | Quant Small Cap Fund | Small Cap | Recognized only |
| 20 | Motilal Oswal Midcap Fund | Mid Cap | Recognized only |

Live-data sources are listed in `backend/corpus/sources/scheme_urls.json`. Live data is upserted into a local ChromaDB collection (`backend/app/services/rag/chroma_store.py`) by the daily refresh job (`backend/app/services/scheduler/scheme_data_refresh.py`); fields the source page doesn't disclose are left out rather than fabricated.

## Education Hub — Source URLs

The 39 Education Hub articles (`backend/corpus/scripts/seed_education.py`) cite four official sources:

| Source | URL | Used for |
|--------|-----|----------|
| AMFI | https://www.amfiindia.com | Official mutual fund industry body — fund categories, processes |
| Mutual Funds Sahi Hai | https://www.mutualfundssahihai.com/en | AMFI's investor education initiative — plain-language concepts |
| SEBI | https://www.sebi.gov.in | The mutual fund regulator — regulatory/compliance content |
| SEBI SCORES | https://scores.sebi.gov.in | Official investor grievance redressal portal |

## Compliance

This platform provides factual mutual fund information only — it never gives investment advice. See `../CLAUDE.md` for the non-negotiable compliance rules that govern every feature.
