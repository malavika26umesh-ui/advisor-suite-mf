from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import delete
from app.core.database import async_session_maker
from app.models.scheduler_models import VoiceTranscript
from datetime import datetime

scheduler = AsyncIOScheduler()

async def delete_expired_transcripts():
    async with async_session_maker() as session:
        now = datetime.utcnow()
        await session.execute(
            delete(VoiceTranscript).where(VoiceTranscript.expires_at <= now)
        )
        await session.commit()
        print(f"[{now}] Deleted expired voice transcripts.")

def start_scheduler():
    scheduler.add_job(
        delete_expired_transcripts,
        CronTrigger(hour=2, minute=0, timezone='UTC'),
        id="delete_expired_transcripts",
        replace_existing=True
    )

    from app.services.pulse.scheduler import register_pulse_job
    register_pulse_job(scheduler)

    from app.services.scheduler.scheme_data_refresh import register_scheme_data_refresh_job
    register_scheme_data_refresh_job(scheduler)

    if not scheduler.running:
        scheduler.start()

    print(f"[scheduler] started with jobs: {[j.id for j in scheduler.get_jobs()]}")
