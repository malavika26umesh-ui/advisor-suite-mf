import json
from typing import Any, Dict

from app.models.db_models import MCPActionLog
from app.services.mcp.tools import DocAppendTool, CalendarHoldCreatorTool, EmailDraftGeneratorTool


class MCPExecutor:
    TOOL_REGISTRY = {
        "doc_append": DocAppendTool(),
        "calendar_hold_creator": CalendarHoldCreatorTool(),
        "email_draft_generator": EmailDraftGeneratorTool()
    }

    def execute(self, action: MCPActionLog) -> Dict[str, Any]:
        """Execute the tool based on the action log record."""
        tool = self.TOOL_REGISTRY.get(action.tool_name)
        if not tool:
            raise ValueError(f"No tool registered for {action.tool_name}")
            
        inputs = json.loads(action.inputs_json)
        return tool.run(inputs)
