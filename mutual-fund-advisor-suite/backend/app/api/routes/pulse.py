from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.pulse_models import PostMeetingFeedback, PulseReport
from app.models.pulse_schemas import (
    CurrentThemeResponse,
    PulseFeedbackRequest,
    PulseReportResponse,
)
from app.models.scheduler_models import Advisor
from app.services.advisor.auth import get_current_advisor
from app.services.pulse.scheduler import run_weekly_pulse

router = APIRouter(prefix="/api/pulse", tags=["pulse"])

VALID_RATINGS = {"very_useful", "somewhat_useful", "not_useful"}


def _to_response(report: PulseReport) -> PulseReportResponse:
    return PulseReportResponse(
        id=report.id,
        week_start_date=report.week_start_date,
        top_themes=report.top_themes_json,
        user_quotes=report.user_quotes_json,
        key_observation=report.key_observation,
        fee_spotlight_term=report.fee_spotlight_term,
        product_recommendations=report.product_recommendations_json,
        corpus_refresh_version=report.corpus_refresh_version,
        corpus_refresh_confirmed_at=report.corpus_refresh_confirmed_at,
        created_at=report.created_at,
        sections_1_4_word_count=report.sections_1_4_word_count,
    )


async def _latest_report(db: AsyncSession) -> Optional[PulseReport]:
    result = await db.execute(
        select(PulseReport).order_by(PulseReport.week_start_date.desc()).limit(1)
    )
    return result.scalars().first()


@router.get("/current", response_model=PulseReportResponse)
async def get_current(db: AsyncSession = Depends(get_db)):
    report = await _latest_report(db)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Pulse report available yet")
    return _to_response(report)


@router.get("/current-theme", response_model=CurrentThemeResponse)
async def get_current_theme(db: AsyncSession = Depends(get_db)):
    report = await _latest_report(db)
    if not report or not report.top_themes_json:
        return CurrentThemeResponse(theme="")
    return CurrentThemeResponse(theme=report.top_themes_json[0])


@router.get("/history", response_model=List[PulseReportResponse])
async def get_history(
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(PulseReport).order_by(PulseReport.week_start_date.desc()))
    return [_to_response(r) for r in result.scalars().all()]


@router.get("/{report_id}", response_model=PulseReportResponse)
async def get_report(
    report_id: int,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(PulseReport).where(PulseReport.id == report_id))
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pulse report not found")
    return _to_response(report)


@router.post("/trigger", response_model=PulseReportResponse)
async def trigger_pulse(x_pulse_trigger_key: Optional[str] = Header(default=None)):
    # Basic API-key gate for manual/dev triggering — not full advisor auth, since
    # this is meant to be callable from an internal cron/ops context, not a browser.
    if settings.SECRET_KEY and x_pulse_trigger_key != settings.SECRET_KEY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid trigger key")
    report = await run_weekly_pulse()
    return _to_response(report)


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(req: PulseFeedbackRequest, db: AsyncSession = Depends(get_db)):
    if req.rating not in VALID_RATINGS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid rating value")

    feedback = PostMeetingFeedback(booking_id=req.booking_id, rating=req.rating)
    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)
    return {"message": "Feedback saved", "id": feedback.id}
