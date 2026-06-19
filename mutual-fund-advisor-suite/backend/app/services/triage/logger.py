from sqlalchemy.ext.asyncio import AsyncSession
from app.models.triage_log import TriageLog
from .classifier import TriageResult

async def log_triage_result(db: AsyncSession, session_id: str, query: str, result: TriageResult):
    db_log = TriageLog(
        session_id=session_id,
        query_text=query,
        bucket=result.bucket,
        confidence=result.confidence,
        scheme_detected=result.scheme_name_detected,
        out_of_scope=result.scheme_out_of_scope,
        escalation_flag=result.escalation_flag
    )
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    return db_log
