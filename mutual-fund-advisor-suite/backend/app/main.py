from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import advisor, education, faq, pulse, scheduler, triage
from app.core.config import settings

app = FastAPI(title="Mutual Fund Advisor Intelligence Suite API")

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


@app.get("/health")
async def health():
    return {"status": "ok"}
