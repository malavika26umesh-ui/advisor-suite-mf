from fastapi import APIRouter

router = APIRouter(prefix="/api/advisor", tags=["advisor"])


@router.get("/")
async def advisor_stub():
    return {"message": "not yet implemented"}
