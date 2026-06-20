import pytest
import re
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.core.config import settings
settings.SENDGRID_API_KEY = "test_api_key"

from app.main import app
from app.services.scheduler.pii_guard import PIIGuard

client = TestClient(app)

def test_pii_detection():
    guard = PIIGuard()
    # PAN
    has_pii, matched = guard.detect_pii("My PAN is ABCDE1234F")
    assert has_pii
    assert matched == "PAN"
    
    # Aadhaar
    has_pii, matched = guard.detect_pii("123456789012")
    assert has_pii
    assert matched == "Aadhaar"
    
    # Folio
    has_pii, matched = guard.detect_pii("folio number 123456")
    assert has_pii
    assert matched == "Folio"

@pytest.mark.asyncio
async def test_booking_code_format():
    from app.core.database import async_session_maker
    from app.services.scheduler.booking import BookingService
    service = BookingService()
    async with async_session_maker() as session:
        code = await service.generate_booking_code(session)
        assert code.startswith("MF-")
        assert len(code) == 7
        assert re.match(r"^MF-[A-Z0-9]{4}$", code)

@pytest.mark.asyncio
@patch('app.services.scheduler.email_sender.EmailSender._send_email')
async def test_scheduler_api_flow(mock_send_email):
    mock_send_email.return_value = True

    # 1. Get slots
    response = client.get("/api/scheduler/slots")
    assert response.status_code == 200
    slots = response.json()
    assert len(slots) > 0
    
    slot = slots[0]
    
    # 2. Create booking
    booking_data = {
        "slot_id": slot["id"],
        "topic_category": "factual",
        "session_id": "test-session",
        "email": "test@example.com",
        "context": "Testing context"
    }
    response = client.post("/api/scheduler/bookings", json=booking_data)
    assert response.status_code == 200
    booking = response.json()
    assert booking["booking_code"].startswith("MF-")
    assert booking["status"] == "confirmed"
    
    # Check email was sent
    mock_send_email.assert_called()

    # 3. Cancel with wrong email
    response = client.delete(f"/api/scheduler/bookings/{booking['booking_code']}?email=wrong@example.com")
    assert response.status_code in [403, 404]

    # 4. Cancel with right email
    response = client.delete(f"/api/scheduler/bookings/{booking['booking_code']}?email=test@example.com")
    assert response.status_code == 200

@pytest.mark.asyncio
@patch('app.services.scheduler.email_sender.EmailSender._send_email')
async def test_mark_complete(mock_send_email):
    mock_send_email.return_value = True

    # get slot
    slots = client.get("/api/scheduler/slots").json()
    slot = slots[-1] # use another slot

    # create
    booking_data = {
        "slot_id": slot["id"],
        "topic_category": "factual",
        "session_id": "test-session2",
        "email": "test2@example.com",
    }
    booking = client.post("/api/scheduler/bookings", json=booking_data).json()

    # complete
    response = client.post(f"/api/scheduler/bookings/{booking['id']}/complete")
    assert response.status_code == 200
    
    # Email should have been sent again (feedback)
    assert mock_send_email.call_count >= 1
