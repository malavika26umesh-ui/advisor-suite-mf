from fastapi import APIRouter

router = APIRouter(prefix="/api/pulse", tags=["pulse"])


@router.get("/")
async def pulse_stub():
    return {"message": "not yet implemented"}
