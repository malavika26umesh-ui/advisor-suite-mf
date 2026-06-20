import random
import string
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.scheduler_models import Booking
from app.core.security import hash_email, encrypt_data
from datetime import datetime, timedelta, date
from app.services.mcp.queue_manager import MCPQueueManager
import logging

logger = logging.getLogger(__name__)

class BookingService:
    async def generate_booking_code(self, session: AsyncSession) -> str:
        while True:
            code = "MF-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
            result = await session.execute(select(Booking).where(Booking.booking_code == code))
            if not result.scalars().first():
                return code

    async def create_booking(self, session: AsyncSession, slot_id: int, topic_category: str, session_id: str, email: str, slot_datetime: datetime, advisor_id: int, context: str = None) -> Booking:
        code = await self.generate_booking_code(session)
        email_hash = hash_email(email)
        encrypted_context = encrypt_data(context) if context else None
        
        booking = Booking(
            booking_code=code,
            advisor_id=advisor_id,
            slot_id=slot_id,
            topic_category=topic_category,
            investor_email_hash=email_hash,
            investor_context_encrypted=encrypted_context,
            session_id=session_id,
            status="confirmed",
            slot_datetime=slot_datetime
        )
        session.add(booking)
        await session.commit()
        await session.refresh(booking)
        
        mcp_queue = MCPQueueManager(session)
        try:
            await mcp_queue.queue_action(
                "calendar_hold_creator",
                {
                    "topic_category": topic_category,
                    "slot_datetime": slot_datetime.isoformat(),
                    "booking_code": booking.booking_code
                },
                booking_id=booking.id
            )
            await mcp_queue.queue_action(
                "doc_append",
                {
                    "date": date.today().isoformat(),
                    "booking_code": booking.booking_code,
                    "top_themes": [],
                    "pulse_snippet": "",
                    "fee_explainer_summary": ""
                },
                booking_id=booking.id
            )
        except Exception as e:
            logger.warning(f"Failed to queue MCP actions for booking {booking.id}: {e}")

        return booking

    async def get_booking_by_code(self, session: AsyncSession, booking_code: str, email: str) -> Booking | None:
        email_hash = hash_email(email)
        result = await session.execute(
            select(Booking).where(Booking.booking_code == booking_code, Booking.investor_email_hash == email_hash)
        )
        return result.scalars().first()

    async def cancel_booking(self, session: AsyncSession, booking_code: str, email: str) -> tuple[bool, str]:
        booking = await self.get_booking_by_code(session, booking_code, email)
        if not booking:
            return False, "Booking not found or email does not match."
        
        # Check if >= 2 hours before
        if booking.slot_datetime - datetime.utcnow() < timedelta(hours=2):
            return False, "Cancellations must be made at least 2 hours before the slot."
        
        booking.status = "cancelled"
        await session.commit()
        return True, "Successfully cancelled."

    async def reschedule_booking(self, session: AsyncSession, booking_code: str, email: str, new_slot_id: int, new_slot_datetime: datetime) -> Booking | None:
        booking = await self.get_booking_by_code(session, booking_code, email)
        if not booking:
            return None
        
        booking.slot_id = new_slot_id
        booking.slot_datetime = new_slot_datetime
        booking.status = "rescheduled"
        await session.commit()
        await session.refresh(booking)
        return booking

    async def mark_complete(self, session: AsyncSession, booking_id: int) -> bool:
        result = await session.execute(select(Booking).where(Booking.id == booking_id))
        booking = result.scalars().first()
        if not booking:
            return False
            
        booking.status = "completed"
        await session.commit()
        return True
