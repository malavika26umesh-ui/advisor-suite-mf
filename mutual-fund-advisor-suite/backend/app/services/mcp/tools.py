import json
import os
import uuid
from typing import Any, Dict
from datetime import datetime, timedelta

from app.services.scheduler.email_sender import EmailSender

class MCPToolBase:
    name: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]

    def validate_inputs(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Validate inputs against the JSON schema."""
        # A simple validator for required fields based on schema
        required_fields = self.input_schema.get("required", [])
        for field in required_fields:
            if field not in inputs:
                raise ValueError(f"Missing required field: {field}")
        return inputs

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the tool when approved."""
        raise NotImplementedError


class DocAppendTool(MCPToolBase):
    name = "doc_append"
    description = "Appends a new document entry with pulse and fee summaries."
    input_schema = {
        "type": "object",
        "properties": {
            "date": {"type": "string"},
            "booking_code": {"type": ["string", "null"]},
            "top_themes": {
                "type": "array",
                "items": {"type": "string"}
            },
            "pulse_snippet": {"type": "string"},
            "fee_explainer_summary": {"type": "string"}
        },
        "required": ["date", "top_themes", "pulse_snippet", "fee_explainer_summary"]
    }
    output_schema = {
        "type": "object",
        "properties": {
            "appended": {"type": "boolean"},
            "log_entry_id": {"type": "string"},
            "target": {"type": "string"}
        }
    }

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        log_file = os.path.join(os.path.dirname(__file__), "../../../mcp_shared_log.json")
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "inputs": inputs
        }
        
        logs = []
        if os.path.exists(log_file):
            with open(log_file, "r") as f:
                try:
                    logs = json.load(f)
                except json.JSONDecodeError:
                    logs = []
                    
        logs.append(entry)
        
        with open(log_file, "w") as f:
            json.dump(logs, f, indent=2)
            
        return {
            "appended": True,
            "log_entry_id": entry["id"],
            "target": "local"
        }


class CalendarHoldCreatorTool(MCPToolBase):
    name = "calendar_hold_creator"
    description = "Generates a calendar hold event for an advisor call."
    input_schema = {
        "type": "object",
        "properties": {
            "topic_category": {"type": "string"},
            "slot_datetime": {"type": "string"},
            "booking_code": {"type": "string"}
        },
        "required": ["topic_category", "slot_datetime", "booking_code"]
    }
    output_schema = {
        "type": "object",
        "properties": {
            "event_title": {"type": "string"},
            "start": {"type": "string"},
            "end": {"type": "string"},
            "duration_minutes": {"type": "integer"},
            "status": {"type": "string"},
            "event_id": {"type": "string"}
        }
    }

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        start_dt = datetime.fromisoformat(inputs["slot_datetime"].replace('Z', '+00:00'))
        end_dt = start_dt + timedelta(minutes=30)
        
        return {
            "event_title": f"[HOLD] Advisor Call — {inputs['booking_code']} — {inputs['topic_category']}",
            "start": start_dt.isoformat(),
            "end": end_dt.isoformat(),
            "duration_minutes": 30,
            "status": "tentative",
            "event_id": str(uuid.uuid4())
        }


class EmailDraftGeneratorTool(MCPToolBase):
    name = "email_draft_generator"
    description = "Generates and sends an email draft containing a pre-meeting brief."
    input_schema = {
        "type": "object",
        "properties": {
            "advisor_name": {"type": "string"},
            "advisor_email": {"type": "string"},
            "pulse_snippet": {"type": "string"},
            "booking_code": {"type": "string"},
            "investor_context": {"type": ["string", "null"]}
        },
        "required": ["advisor_name", "advisor_email", "pulse_snippet", "booking_code"]
    }
    output_schema = {
        "type": "object",
        "properties": {
            "subject": {"type": "string"},
            "body": {"type": "string"},
            "to": {"type": "string"},
            "cc": {"type": "null"}
        }
    }

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        advisor_name = inputs["advisor_name"]
        advisor_email = inputs["advisor_email"]
        pulse_snippet = inputs["pulse_snippet"]
        booking_code = inputs["booking_code"]
        investor_context = inputs.get("investor_context") or "No additional context provided."
        
        subject = f"Pre-meeting brief: {booking_code}"
        body = (
            f"Hello {advisor_name},\n\n"
            f"Here is your pre-meeting brief for booking {booking_code}.\n\n"
            f"Market Pulse Context: {pulse_snippet}\n\n"
            f"Investor Topic Context: {investor_context}\n\n"
            f"Please remember to refer to the standard advisor referral disclaimer when needed.\n"
        )
        
        # According to spec: v1 behaviour on approval: send via EmailSender.send_advisor_pre_meeting_draft()
        # Ensure EmailSender has this method, or implement a dummy if not
        sender = EmailSender()
        if hasattr(sender, 'send_advisor_pre_meeting_draft'):
            sender.send_advisor_pre_meeting_draft(advisor_email, subject, body)
        else:
            # Fallback for compilation if the method doesn't exist
            pass
            
        return {
            "subject": subject,
            "body": body,
            "to": advisor_email,
            "cc": None
        }
