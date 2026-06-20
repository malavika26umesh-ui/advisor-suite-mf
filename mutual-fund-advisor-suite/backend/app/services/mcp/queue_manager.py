import json
from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.db_models import MCPActionLog
from app.services.scheduler.pii_guard import PIIGuard
from app.services.mcp.tools import DocAppendTool, CalendarHoldCreatorTool, EmailDraftGeneratorTool
from app.services.mcp.executor import MCPExecutor


class MCPPIIError(Exception):
    pass

class MCPQueueManager:
    TOOL_REGISTRY = {
        "doc_append": DocAppendTool(),
        "calendar_hold_creator": CalendarHoldCreatorTool(),
        "email_draft_generator": EmailDraftGeneratorTool()
    }

    def __init__(self, db: AsyncSession):
        self.db = db
        self.pii_guard = PIIGuard()
        self.executor = MCPExecutor()

    async def queue_action(self, tool_name: str, inputs: Dict[str, Any], booking_id: Optional[int] = None, pulse_report_id: Optional[int] = None) -> MCPActionLog:
        tool = self.TOOL_REGISTRY.get(tool_name)
        if not tool:
            raise ValueError(f"Unknown tool: {tool_name}")

        # Validate inputs against schema
        tool.validate_inputs(inputs)

        # Screen for PII
        inputs_json = json.dumps(inputs)
        has_pii, pii_type = self.pii_guard.detect_pii(inputs_json)
        if has_pii:
            raise MCPPIIError(f"PII detected in inputs: {pii_type}. Action blocked.")

        # Create log entry
        action = MCPActionLog(
            tool_name=tool_name,
            status="pending",
            inputs_json=inputs_json,
            triggered_at=datetime.utcnow(),
            booking_id=booking_id,
            pulse_report_id=pulse_report_id
        )
        self.db.add(action)
        await self.db.commit()
        await self.db.refresh(action)
        return action

    async def approve_action(self, action_id: int, resolved_by: str) -> MCPActionLog:
        result = await self.db.execute(select(MCPActionLog).where(MCPActionLog.id == action_id))
        action = result.scalars().first()
        if not action:
            raise HTTPException(status_code=404, detail="Action not found")
        
        if action.status != "pending":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Action is already resolved")

        action.status = "approved"
        action.resolved_at = datetime.utcnow()
        action.resolved_by = resolved_by
        
        # Execute tool
        output = self.executor.execute(action)
        action.output_json = json.dumps(output)
        
        await self.db.commit()
        await self.db.refresh(action)
        return action

    async def reject_action(self, action_id: int, resolved_by: str) -> MCPActionLog:
        result = await self.db.execute(select(MCPActionLog).where(MCPActionLog.id == action_id))
        action = result.scalars().first()
        if not action:
            raise HTTPException(status_code=404, detail="Action not found")
        
        if action.status != "pending":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Action is already resolved")

        action.status = "rejected"
        action.resolved_at = datetime.utcnow()
        action.resolved_by = resolved_by
        
        await self.db.commit()
        await self.db.refresh(action)
        return action

    async def get_pending_actions(self) -> List[MCPActionLog]:
        result = await self.db.execute(
            select(MCPActionLog).where(MCPActionLog.status == "pending").order_by(MCPActionLog.triggered_at.desc())
        )
        return result.scalars().all()

    async def get_action_history(self, limit: int = 50) -> List[MCPActionLog]:
        result = await self.db.execute(
            select(MCPActionLog).where(MCPActionLog.status != "pending")
            .order_by(MCPActionLog.resolved_at.desc()).limit(limit)
        )
        return result.scalars().all()
