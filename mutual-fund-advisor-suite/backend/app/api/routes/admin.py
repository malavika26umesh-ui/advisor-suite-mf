import secrets

from fastapi import APIRouter, Header, HTTPException

from app.core.config import settings
from app.services.rag.chroma_store import SchemeLiveDataStore
from app.services.scheduler.scheme_data_refresh import run_daily_scheme_data_refresh

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _require_admin_token(x_admin_token: str | None) -> None:
    configured = settings.ADMIN_REFRESH_TOKEN
    if not configured or not x_admin_token or not secrets.compare_digest(x_admin_token, configured):
        raise HTTPException(status_code=403, detail="Not authorized")


@router.post("/refresh-scheme-data")
async def refresh_scheme_data(x_admin_token: str | None = Header(default=None)):
    _require_admin_token(x_admin_token)
    await run_daily_scheme_data_refresh()
    store = SchemeLiveDataStore()
    return {"status": "completed", "document_count": store.count()}
