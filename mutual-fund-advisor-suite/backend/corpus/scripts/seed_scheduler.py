import asyncio
import os
import sys
from datetime import datetime, timedelta

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import async_session_maker, engine
from app.models.scheduler_models import Advisor, AdvisorSlot

async def seed_scheduler():
    async with async_session_maker() as session:
        # Check if advisors already exist
        result = await session.execute(select(Advisor))
        if result.scalars().first():
            print("Advisors already seeded. Skipping.")
            return

        advisors = [
            Advisor(
                email="advisor1@advisorsuite.mf",
                name="Rahul Sharma",
                sebi_registration_number="INA100000123"
            ),
            Advisor(
                email="advisor2@advisorsuite.mf",
                name="Priya Patel",
                sebi_registration_number="INA100000124"
            )
        ]
        
        session.add_all(advisors)
        await session.commit()
        
        # Reload advisors to get IDs
        result = await session.execute(select(Advisor))
        advisors = result.scalars().all()
        
        # Seed slots for the next 7 days
        slots = []
        now = datetime.utcnow()
        for i in range(1, 8):
            target_date = now + timedelta(days=i)
            # Create a 10:00 AM to 10:30 AM slot for advisor 1
            start1 = target_date.replace(hour=10, minute=0, second=0, microsecond=0)
            end1 = start1 + timedelta(minutes=30)
            slots.append(AdvisorSlot(
                advisor_id=advisors[0].id,
                start_time=start1,
                end_time=end1,
                day_of_week=start1.weekday(),
                is_recurring=False,
                is_blocked=False
            ))
            
            # Create a 2:00 PM to 2:30 PM slot for advisor 2
            start2 = target_date.replace(hour=14, minute=0, second=0, microsecond=0)
            end2 = start2 + timedelta(minutes=30)
            slots.append(AdvisorSlot(
                advisor_id=advisors[1].id,
                start_time=start2,
                end_time=end2,
                day_of_week=start2.weekday(),
                is_recurring=False,
                is_blocked=False
            ))

        session.add_all(slots)
        await session.commit()
        print("Successfully seeded 2 advisors and slots for the next 7 days.")

if __name__ == "__main__":
    asyncio.run(seed_scheduler())
