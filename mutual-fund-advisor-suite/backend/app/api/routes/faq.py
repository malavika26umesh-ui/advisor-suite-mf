from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.faq_schemas import FAQQueryRequest, FAQResponse, FeeExplainerContent
from app.services.rag.pipeline import FAQPipeline
from app.services.rag.fee_explainer import FeeExplainerService
import os
import json

router = APIRouter(prefix="/api/faq", tags=["faq"])

pipeline = FAQPipeline()
fee_explainer_service = FeeExplainerService()

@router.post("/query", response_model=FAQResponse)
async def query_faq(request: FAQQueryRequest, db = Depends(get_db)):
    return await pipeline.query(request.query, request.session_id, db)

@router.get("/fee-explainer", response_model=FeeExplainerContent)
async def get_fee_explainer(db = Depends(get_db)):
    return await fee_explainer_service.get_current_explainer(db)

@router.get("/covered-schemes", response_model=list[str])
def get_covered_schemes():
    file_path = os.path.join(os.path.dirname(__file__), '../../../corpus/sources/top20_schemes.json')
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            schemes = [s['name'] for s in data.get("schemes", [])]
            return schemes
    except Exception:
        return []

@router.get("/session-queries/{session_id}", response_model=list[str])
async def get_session_queries(session_id: str, db = Depends(get_db)):
    from app.models.faq_models import SessionFaqLog
    stmt = select(SessionFaqLog).filter(SessionFaqLog.session_id == session_id).order_by(SessionFaqLog.timestamp.desc())
    if isinstance(db, AsyncSession):
        res = await db.execute(stmt)
        logs = res.scalars().all()
    else:
        logs = db.execute(stmt).scalars().all()
    return [log.query for log in logs]
