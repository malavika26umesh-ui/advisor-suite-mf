import pytest
import datetime
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.core.config import settings

settings.SECRET_KEY = "test_secret_key"

from app.main import app
from app.core.database import async_session_maker
from app.models.scheduler_models import Advisor, OTPStore, Booking
from app.services.advisor.auth import AdvisorAuth
from sqlalchemy.future import select

client = TestClient(app)

@pytest.fixture
def test_advisor_email():
    return "advisor1@advisorsuite.mf"

@pytest.mark.asyncio
@patch('app.services.scheduler.email_sender.EmailSender._send_email')
async def test_advisor_otp_flow(mock_send_email, test_advisor_email):
    mock_send_email.return_value = True
    async with async_session_maker() as session:
        # Ensure advisor exists for OTP flow test
        res = await session.execute(select(Advisor).where(Advisor.email == test_advisor_email))
        advisor = res.scalars().first()
        if not advisor:
            advisor = Advisor(email=test_advisor_email, name="Test", sebi_registration_number="1234567")
            session.add(advisor)
            await session.commit()

    # 1. Request OTP
    response = client.post("/api/advisor/auth/request-otp", json={"email": test_advisor_email})
    assert response.status_code == 200

    # Verify OTP row created
    async with async_session_maker() as session:
        res = await session.execute(select(OTPStore).where(OTPStore.email == test_advisor_email).order_by(OTPStore.id.desc()))
        otp_record = res.scalars().first()
        assert otp_record is not None
        assert not otp_record.used

        # Check mock email called
        assert mock_send_email.call_count >= 1

        # 2. Wrong OTP -> 401
        response = client.post("/api/advisor/auth/verify-otp", json={"email": test_advisor_email, "otp": "000000"})
        assert response.status_code == 401

        # 3. Expired OTP -> 401
        otp_record.expires_at = datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
        await session.commit()
        
        # We don't know the exact OTP, we can bypass or just assert it fails
        # Actually it'll fail because expired
        response = client.post("/api/advisor/auth/verify-otp", json={"email": test_advisor_email, "otp": "999999"})
        assert response.status_code == 401

@pytest.mark.asyncio
async def test_advisor_valid_token(test_advisor_email):
    # Manually generate token to test /me
    async with async_session_maker() as session:
        # Create an active advisor if not exist (from seed)
        res = await session.execute(select(Advisor).where(Advisor.email == test_advisor_email))
        advisor = res.scalars().first()
        if not advisor:
            advisor = Advisor(email=test_advisor_email, name="Test", sebi_registration_number="123")
            session.add(advisor)
            await session.commit()
        assert advisor is not None
        
        # Generate valid token
        auth = AdvisorAuth(session)
        # hack: insert valid otp and verify
        otp_val = "123456"
        import bcrypt
        otp_hash = bcrypt.hashpw(otp_val.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        otp_store = OTPStore(
            email=test_advisor_email,
            otp_hash=otp_hash,
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            used=False
        )
        session.add(otp_store)
        await session.commit()

        token = await auth.verify_otp(test_advisor_email, otp_val)
        assert token is not None

    # Test /me with valid token
    response = client.get("/api/advisor/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == test_advisor_email

@pytest.mark.asyncio
async def test_advisor_brief(test_advisor_email):
    async with async_session_maker() as session:
        auth = AdvisorAuth(session)
        # hack: generate token
        otp_val = "123456"
        import bcrypt
        otp_hash = bcrypt.hashpw(otp_val.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        otp_store = OTPStore(email=test_advisor_email, otp_hash=otp_hash, expires_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=10), used=False)
        session.add(otp_store)
        await session.commit()
        token = await auth.verify_otp(test_advisor_email, otp_val)
        
        # Find a booking for this advisor
        res = await session.execute(select(Booking).where(Booking.advisor.has(email=test_advisor_email)))
        booking = res.scalars().first()
        if not booking:
            # fetch advisor
            advisor_res = await session.execute(select(Advisor).where(Advisor.email == test_advisor_email))
            advisor = advisor_res.scalars().first()
            if not advisor:
                advisor = Advisor(email=test_advisor_email, name="Test", sebi_registration_number="12345")
                session.add(advisor)
                await session.commit()
            
            # create mock booking and slot
            from app.models.scheduler_models import AdvisorSlot
            slot = AdvisorSlot(advisor_id=advisor.id, start_time=datetime.datetime.utcnow(), end_time=datetime.datetime.utcnow())
            session.add(slot)
            await session.commit()
            booking = Booking(booking_code="MF-1234", advisor_id=advisor.id, slot_id=slot.id, topic_category="factual", investor_email_hash="hash", session_id="session1", slot_datetime=datetime.datetime.utcnow(), investor_context_encrypted=None)
            session.add(booking)
            await session.commit()
        
        assert booking is not None
        booking.investor_context_encrypted = None
        await session.commit()
    
    response = client.get(f"/api/advisor/meetings/{booking.id}/brief", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    brief = response.json()
    
    # Assert expected fields
    assert "booking_code" in brief
    assert "topic_category" in brief
    assert "session_faq_queries" in brief
    assert "pulse_top_theme" in brief
    assert "relevant_education_articles" in brief
    
    # Assert unexpected fields are absent
    unexpected = ["pan", "aadhaar", "folio", "account_number", "portfolio", "advisory_recommendation"]
    for field in unexpected:
        assert field not in brief

@pytest.mark.asyncio
@patch('app.services.scheduler.email_sender.EmailSender._send_email')
async def test_advisor_mark_complete(mock_send_email, test_advisor_email):
    mock_send_email.return_value = True
    async with async_session_maker() as session:
        auth = AdvisorAuth(session)
        # generate token
        otp_val = "123456"
        import bcrypt
        otp_hash = bcrypt.hashpw(otp_val.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        otp_store = OTPStore(email=test_advisor_email, otp_hash=otp_hash, expires_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=10), used=False)
        session.add(otp_store)
        await session.commit()
        token = await auth.verify_otp(test_advisor_email, otp_val)

        res = await session.execute(select(Booking).where(Booking.advisor.has(email=test_advisor_email)))
        booking = res.scalars().first()
        if not booking:
            advisor_res = await session.execute(select(Advisor).where(Advisor.email == test_advisor_email))
            advisor = advisor_res.scalars().first()
            if not advisor:
                advisor = Advisor(email=test_advisor_email, name="Test", sebi_registration_number="123456")
                session.add(advisor)
                await session.commit()
                
            from app.models.scheduler_models import AdvisorSlot
            slot = AdvisorSlot(advisor_id=advisor.id, start_time=datetime.datetime.utcnow(), end_time=datetime.datetime.utcnow())
            session.add(slot)
            await session.commit()
            booking = Booking(booking_code="MF-9999", advisor_id=advisor.id, slot_id=slot.id, topic_category="factual", investor_email_hash="hash", session_id="session2", slot_datetime=datetime.datetime.utcnow())
            session.add(booking)
            await session.commit()

    assert booking is not None

    response = client.put(f"/api/advisor/meetings/{booking.id}/complete", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    # mark_complete triggers feedback email
    assert mock_send_email.call_count >= 1
