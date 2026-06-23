from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import triage, faq, education, scheduler, advisor, pulse, mcp, admin
from app.core.config import settings

import asyncio
from contextlib import asynccontextmanager


async def heal_scheme_data_if_empty() -> None:
    # Render's free-tier disk is ephemeral -- every cold start (deploy, or the
    # free-tier idle spin-down/spin-up cycle, which happens far more often
    # than deploys) wipes the local ChromaDB store. Without this, the FAQ
    # Centre silently goes back to "We don't have verified information" on
    # every restart until someone notices and manually hits the admin
    # refresh endpoint. Self-heal on boot instead.
    from app.services.rag.chroma_store import SchemeLiveDataStore
    from app.services.scheduler.scheme_data_refresh import run_daily_scheme_data_refresh

    if SchemeLiveDataStore().count() == 0:
        print("[startup] scheme_live_data collection is empty -- triggering background refresh")
        asyncio.create_task(run_daily_scheme_data_refresh())


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.services.scheduler.cron_jobs import start_scheduler
    start_scheduler()
    await heal_scheme_data_if_empty()
    yield

app = FastAPI(title="Mutual Fund Advisor Intelligence Suite API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list({settings.FRONTEND_URL, "http://localhost:5173"}),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(triage.router)
app.include_router(faq.router)
app.include_router(education.router)
app.include_router(scheduler.router)
app.include_router(advisor.router)
app.include_router(pulse.router)
app.include_router(mcp.router)
app.include_router(admin.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
