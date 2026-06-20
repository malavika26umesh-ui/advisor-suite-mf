from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.scheduler_models import AdvisorSlot, Booking, Advisor
from datetime import datetime, timedelta

class SlotManager:
    async def get_available_slots(self, session: AsyncSession, days_ahead: int = 7) -> list:
        now = datetime.utcnow()
        max_time = now + timedelta(days=days_ahead)
        
        # Get slots that are not blocked
        result = await session.execute(
            select(AdvisorSlot)
            .options(selectinload(AdvisorSlot.advisor))
            .where(AdvisorSlot.is_blocked == False)
            .where(AdvisorSlot.start_time > now)
            .where(AdvisorSlot.start_time <= max_time)
            .order_by(AdvisorSlot.start_time.asc())
        )
        slots = result.scalars().all()
        
        # Filter out slots that have confirmed/rescheduled bookings
        booked_result = await session.execute(
            select(Booking.slot_id).where(Booking.status.in_(["confirmed", "rescheduled"]))
        )
        booked_slot_ids = {row for row in booked_result.scalars().all()}
        
        available = [s for s in slots if s.id not in booked_slot_ids]
        
        # Return max 3 for voice scheduler display
        return available[:3]

    async def set_advisor_availability(self, session: AsyncSession, advisor_id: int, start_time: datetime, end_time: datetime, is_recurring: bool, day_of_week: int) -> AdvisorSlot:
        slot = AdvisorSlot(
            advisor_id=advisor_id,
            start_time=start_time,
            end_time=end_time,
            is_recurring=is_recurring,
            day_of_week=day_of_week,
            is_blocked=False
        )
        session.add(slot)
        await session.commit()
        await session.refresh(slot)
        return slot

    async def block_slot(self, session: AsyncSession, slot_id: int) -> bool:
        result = await session.execute(select(AdvisorSlot).where(AdvisorSlot.id == slot_id))
        slot = result.scalars().first()
        if not slot:
            return False
            
        slot.is_blocked = True
        await session.commit()
        
        # Checking for existing bookings is handled in the route or service layer
        # because it needs email_sender to trigger re-booking notification
        return True
