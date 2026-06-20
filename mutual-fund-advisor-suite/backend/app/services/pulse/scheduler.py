from datetime import date, datetime, timedelta

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select

from app.core.database import async_session_maker
from app.models.pulse_models import PulseReport
from app.models.scheduler_models import Advisor
from app.services.pulse.aggregator import PulseAggregator
from app.services.pulse.report_generator import PulseReportGenerator
from app.services.pulse.corpus_refresher import CorpusRefresher
from app.services.scheduler.email_sender import EmailSender
from app.services.mcp.queue_manager import MCPQueueManager
import logging

logger = logging.getLogger(__name__)

PRODUCT_TEAM_EMAIL = "product-team@advisorsuite.mf"

PULSE_JOB_ID = "weekly_product_pulse"


def _last_full_week(today: date) -> tuple[date, date]:
    """The Monday-to-Sunday week immediately preceding `today`."""
    this_monday = today - timedelta(days=today.weekday())
    week_start = this_monday - timedelta(days=7)
    week_end = week_start + timedelta(days=6)
    return week_start, week_end


async def run_weekly_pulse() -> PulseReport:
    week_start, week_end = _last_full_week(date.today())

    aggregator = PulseAggregator()
    generator = PulseReportGenerator()
    refresher = CorpusRefresher()
    email_sender = EmailSender()

    async with async_session_maker() as db:
        input_data = await aggregator.aggregate(db, week_start, week_end)
        report_data = generator.generate(input_data)

        pulse_report = PulseReport(
            week_start_date=week_start,
            top_themes_json=report_data.top_themes,
            user_quotes_json=report_data.user_quotes,
            key_observation=report_data.key_observation,
            fee_spotlight_term=report_data.fee_spotlight_term,
            product_recommendations_json=report_data.product_recommendations,
            sections_1_4_word_count=report_data.sections_1_4_word_count,
        )
        db.add(pulse_report)
        await db.commit()
        await db.refresh(pulse_report)

        new_version = await refresher.trigger_fee_explainer_update(
            db, report_data.fee_spotlight_term, week_start
        )
        pulse_report.corpus_refresh_version = new_version
        pulse_report.corpus_refresh_confirmed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(pulse_report)

        mcp_queue = MCPQueueManager(db)
        try:
            await mcp_queue.queue_action(
                "doc_append",
                {
                    "date": week_start.isoformat(),
                    "booking_code": None,
                    "top_themes": report_data.top_themes[:3] if report_data.top_themes else [],
                    "pulse_snippet": report_data.key_observation,
                    "fee_explainer_summary": report_data.fee_spotlight_term
                },
                pulse_report_id=pulse_report.id
            )
        except Exception as e:
            logger.warning(f"Failed to queue MCP action for pulse report {pulse_report.id}: {e}")

        advisor_emails = (
            (await db.execute(select(Advisor.email).where(Advisor.is_active.is_(True))))
            .scalars()
            .all()
        )
        recipient_emails = list(advisor_emails) + [PRODUCT_TEAM_EMAIL]
        email_sender.send_pulse_notification(
            recipient_emails, report_data.top_themes, report_data.fee_spotlight_term
        )

        return pulse_report


def register_pulse_job(scheduler: AsyncIOScheduler) -> None:
    # Monday 03:30 UTC = Monday 09:00 IST (UTC+5:30).
    scheduler.add_job(
        run_weekly_pulse,
        CronTrigger(day_of_week="mon", hour=3, minute=30, timezone="UTC"),
        id=PULSE_JOB_ID,
        replace_existing=True,
    )
