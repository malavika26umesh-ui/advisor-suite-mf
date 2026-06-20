import json
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.models.scheduler_models import Advisor
from app.services.advisor.auth import get_current_advisor
from app.services.mcp.queue_manager import MCPQueueManager
from app.services.mcp.tools import DocAppendTool, CalendarHoldCreatorTool, EmailDraftGeneratorTool

router = APIRouter(prefix="/api/mcp", tags=["mcp"])

class MCPActionLogItem(BaseModel):
    id: int
    tool_name: str
    status: str
    inputs: Dict[str, Any]
    output: Optional[Dict[str, Any]]
    triggered_at: datetime
    resolved_at: Optional[datetime]
    resolved_by: Optional[str]
    booking_code: Optional[str]

    class Config:
        from_attributes = True

class ToolSchema(BaseModel):
    name: str
    description: str
    input_schema: Dict[str, Any]

def format_action(action, booking_code=None) -> MCPActionLogItem:
    return MCPActionLogItem(
        id=action.id,
        tool_name=action.tool_name,
        status=action.status,
        inputs=json.loads(action.inputs_json) if action.inputs_json else {},
        output=json.loads(action.output_json) if action.output_json else None,
        triggered_at=action.triggered_at,
        resolved_at=action.resolved_at,
        resolved_by=action.resolved_by,
        booking_code=booking_code
    )

@router.get("/pending", response_model=List[MCPActionLogItem])
async def get_pending(
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MCPQueueManager(db)
    actions = await qm.get_pending_actions()
    
    # Optional: fetch booking codes if booking_id is present
    from app.models.scheduler_models import Booking
    from sqlalchemy import select
    
    result_items = []
    for action in actions:
        booking_code = None
        if action.booking_id:
            res = await db.execute(select(Booking.booking_code).where(Booking.id == action.booking_id))
            booking_code = res.scalars().first()
        result_items.append(format_action(action, booking_code))
        
    return result_items

@router.get("/history", response_model=List[MCPActionLogItem])
async def get_history(
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MCPQueueManager(db)
    actions = await qm.get_action_history()
    
    # Optional: fetch booking codes if booking_id is present
    from app.models.scheduler_models import Booking
    from sqlalchemy import select
    
    result_items = []
    for action in actions:
        booking_code = None
        if action.booking_id:
            res = await db.execute(select(Booking.booking_code).where(Booking.id == action.booking_id))
            booking_code = res.scalars().first()
        result_items.append(format_action(action, booking_code))
        
    return result_items

@router.post("/actions/{id}/approve", response_model=MCPActionLogItem)
async def approve_action(
    id: int,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MCPQueueManager(db)
    action = await qm.approve_action(id, resolved_by=current_advisor.email)
    
    booking_code = None
    if action.booking_id:
        from app.models.scheduler_models import Booking
        from sqlalchemy import select
        res = await db.execute(select(Booking.booking_code).where(Booking.id == action.booking_id))
        booking_code = res.scalars().first()
        
    return format_action(action, booking_code)

@router.post("/actions/{id}/reject", response_model=MCPActionLogItem)
async def reject_action(
    id: int,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MCPQueueManager(db)
    action = await qm.reject_action(id, resolved_by=current_advisor.email)
    
    booking_code = None
    if action.booking_id:
        from app.models.scheduler_models import Booking
        from sqlalchemy import select
        res = await db.execute(select(Booking.booking_code).where(Booking.id == action.booking_id))
        booking_code = res.scalars().first()
        
    return format_action(action, booking_code)

@router.get("/tools", response_model=List[ToolSchema])
async def get_tools():
    # Public - no auth
    registry = MCPQueueManager.TOOL_REGISTRY
    return [
        ToolSchema(
            name=tool.name,
            description=tool.description,
            input_schema=tool.input_schema
        )
        for tool in registry.values()
    ]
