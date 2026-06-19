from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

from app.core.database import get_db
from app.services.triage.classifier import TriageClassifier, TriageResult
from app.services.triage.logger import log_triage_result
from app.models.triage_log import TriageLog

router = APIRouter(prefix="/api/triage", tags=["triage"])
classifier = TriageClassifier()

class ClassifyRequest(BaseModel):
    query: str
    session_id: str

@router.post("/classify", response_model=TriageResult)
async def classify_query(request: ClassifyRequest, db: AsyncSession = Depends(get_db)):
    result = classifier.classify(request.query, request.session_id)
    await log_triage_result(db, request.session_id, request.query, result)
    return result

@router.get("/logs")
async def get_logs(start_date: Optional[date] = None, end_date: Optional[date] = None, db: AsyncSession = Depends(get_db)):
    # This is for admin pulse aggregation
    query = select(TriageLog)
    if start_date:
        query = query.filter(TriageLog.timestamp >= start_date)
    if end_date:
        query = query.filter(TriageLog.timestamp <= end_date)
    result = await db.execute(query)
    return result.scalars().all()
