from fastapi import APIRouter

router = APIRouter(prefix="/api/scheduler", tags=["scheduler"])


@router.get("/")
async def scheduler_stub():
    return {"message": "not yet implemented"}
