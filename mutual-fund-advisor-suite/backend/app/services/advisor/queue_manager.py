from datetime import date
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.scheduler_models import Booking, AdvisorSlot
from app.models.advisor_schemas import MeetingQueueItem
from app.services.scheduler.email_sender import EmailSender

class MeetingQueueManager:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.email_sender = EmailSender()

    async def get_queue(self, advisor_id: int, status: Optional[str] = None, dt: Optional[date] = None, topic_category: Optional[str] = None) -> List[MeetingQueueItem]:
        query = select(Booking).where(Booking.advisor_id == advisor_id)
        
        if status:
            query = query.where(Booking.status == status)
        if topic_category:
            query = query.where(Booking.topic_category == topic_category)
            
        result = await self.db.execute(query)
        bookings = result.scalars().all()
        
        if dt:
            bookings = [b for b in bookings if b.slot_datetime.date() == dt]
            
        items = []
        for b in bookings:
            items.append(MeetingQueueItem(
                id=b.id,
                booking_code=b.booking_code,
                topic_category=b.topic_category,
                slot_datetime=b.slot_datetime,
                status=b.status,
                brief_preview_available=True
            ))
        return items

    async def confirm_booking(self, booking_id: int, advisor_id: int) -> bool:
        result = await self.db.execute(select(Booking).where(Booking.id == booking_id, Booking.advisor_id == advisor_id))
        booking = result.scalars().first()
        if not booking:
            return False
        booking.status = "confirmed"
        await self.db.commit()
        return True

    async def reschedule_booking(self, booking_id: int, new_slot_id: int, reason: str, advisor_id: int) -> bool:
        result = await self.db.execute(select(Booking).where(Booking.id == booking_id, Booking.advisor_id == advisor_id))
        booking = result.scalars().first()
        if not booking:
            return False
            
        slot_res = await self.db.execute(select(AdvisorSlot).where(AdvisorSlot.id == new_slot_id, AdvisorSlot.is_blocked.is_(False)))
        new_slot = slot_res.scalars().first()
        if not new_slot:
            return False
            
        old_slot_res = await self.db.execute(select(AdvisorSlot).where(AdvisorSlot.id == booking.slot_id))
        old_slot = old_slot_res.scalars().first()
        if old_slot:
            old_slot.is_blocked = False
            
        new_slot.is_blocked = True
        booking.slot_id = new_slot.id
        booking.slot_datetime = new_slot.start_time
        booking.status = "rescheduled"
        await self.db.commit()
        
        mock_email = f"user_{booking.investor_email_hash[:8]}@example.com"
        try:
            self.email_sender.send_reschedule_notification(mock_email, booking)
        except Exception:
            pass
            
        return True

    async def mark_complete(self, booking_id: int, advisor_id: int) -> bool:
        result = await self.db.execute(select(Booking).where(Booking.id == booking_id, Booking.advisor_id == advisor_id))
        booking = result.scalars().first()
        if not booking:
            return False
            
        booking.status = "completed"
        await self.db.commit()
        
        mock_email = f"user_{booking.investor_email_hash[:8]}@example.com"
        try:
            self.email_sender.send_post_meeting_feedback(mock_email, booking)
        except Exception:
            pass
            
        return True
