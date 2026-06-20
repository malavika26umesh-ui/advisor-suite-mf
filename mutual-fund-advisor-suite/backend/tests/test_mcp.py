import pytest

from app.main import app
from app.services.mcp.queue_manager import MCPQueueManager, MCPPIIError
from app.core.database import async_session_maker

@pytest.mark.asyncio
async def test_queue_calendar_hold():
    async with async_session_maker() as session:
        qm = MCPQueueManager(session)
        action = await qm.queue_action(
            "calendar_hold_creator",
            {"topic_category": "Fees", "slot_datetime": "2026-06-25T10:00:00", "booking_code": "MF-TEST"}
        )
        assert action.status == "pending"
        assert action.tool_name == "calendar_hold_creator"
        assert action.output_json is None

@pytest.mark.asyncio
async def test_queue_email_draft_pii_blocked():
    async with async_session_maker() as session:
        qm = MCPQueueManager(session)
        with pytest.raises(MCPPIIError):
            await qm.queue_action(
                "email_draft_generator",
                {
                    "advisor_name": "Test",
                    "advisor_email": "test@test.com",
                    "pulse_snippet": "Pulse",
                    "booking_code": "MF-TEST",
                    "investor_context": "Has a PAN card ABCDE1234F" # PII
                }
            )

@pytest.mark.asyncio
async def test_approve_calendar_hold():
    async with async_session_maker() as session:
        qm = MCPQueueManager(session)
        action = await qm.queue_action(
            "calendar_hold_creator",
            {"topic_category": "Fees", "slot_datetime": "2026-06-25T10:00:00Z", "booking_code": "MF-TEST"}
        )
        approved = await qm.approve_action(action.id, "advisor@test.com")
        assert approved.status == "approved"
        assert approved.output_json is not None
        assert "event_title" in approved.output_json

@pytest.mark.asyncio
async def test_reject_doc_append():
    async with async_session_maker() as session:
        qm = MCPQueueManager(session)
        action = await qm.queue_action(
            "doc_append",
            {"date": "2026-06-20", "booking_code": None, "top_themes": [], "pulse_snippet": "Test", "fee_explainer_summary": "Test"}
        )
        rejected = await qm.reject_action(action.id, "advisor@test.com")
        assert rejected.status == "rejected"
        assert rejected.output_json is None

@pytest.mark.asyncio
async def test_approve_already_approved():
    async with async_session_maker() as session:
        qm = MCPQueueManager(session)
        action = await qm.queue_action(
            "calendar_hold_creator",
            {"topic_category": "Fees", "slot_datetime": "2026-06-25T10:00:00Z", "booking_code": "MF-TEST"}
        )
        await qm.approve_action(action.id, "advisor@test.com")
        
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            await qm.approve_action(action.id, "advisor@test.com")
        assert exc.value.status_code == 409

@pytest.mark.asyncio
async def test_get_pending_only():
    async with async_session_maker() as session:
        qm = MCPQueueManager(session)
        initial_pending = await qm.get_pending_actions()
        initial_count = len(initial_pending)
        
        a1 = await qm.queue_action(
            "calendar_hold_creator",
            {"topic_category": "Fees", "slot_datetime": "2026-06-25T10:00:00Z", "booking_code": "MF-TEST"}
        )
        a2 = await qm.queue_action(
            "doc_append",
            {"date": "2026-06-20", "booking_code": None, "top_themes": [], "pulse_snippet": "Test", "fee_explainer_summary": "Test"}
        )
        await qm.approve_action(a1.id, "advisor@test.com")
        
        pending = await qm.get_pending_actions()
        assert len(pending) == initial_count + 1
        assert any(p.id == a2.id for p in pending)

from fastapi.testclient import TestClient

def test_get_tools_endpoint():
    client = TestClient(app)
    response = client.get("/api/mcp/tools")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    names = [t["name"] for t in data]
    assert "doc_append" in names
    assert "calendar_hold_creator" in names
    assert "email_draft_generator" in names
