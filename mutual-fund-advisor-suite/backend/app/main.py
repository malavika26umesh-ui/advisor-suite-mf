from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import triage, faq, education, scheduler, advisor, pulse, mcp
from app.core.config import settings

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.services.scheduler.cron_jobs import start_scheduler
    start_scheduler()
    yield

app = FastAPI(title="Mutual Fund Advisor Intelligence Suite API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
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


@app.get("/health")
async def health():
    return {"status": "ok"}
