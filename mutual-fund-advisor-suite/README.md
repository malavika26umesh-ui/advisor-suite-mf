# Mutual Fund Advisor Intelligence Suite

AI-powered web platform for Indian retail investors and SEBI-registered investment advisors. See `../PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md` for the full requirements and `../ImplementationPlan.md` for the build plan.

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

React 18 + Vite + TypeScript + Tailwind CSS · Python 3.11+ + FastAPI + SQLAlchemy + Alembic · LangChain + Pinecone · Claude Sonnet (Anthropic) · SQLite (dev) / PostgreSQL (prod)

## Compliance

This platform provides factual mutual fund information only — it never gives investment advice. See `../CLAUDE.md` for the non-negotiable compliance rules that govern every feature.
