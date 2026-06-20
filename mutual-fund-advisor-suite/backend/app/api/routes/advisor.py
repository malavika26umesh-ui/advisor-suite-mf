from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.scheduler_models import Advisor
from app.models.advisor_schemas import (
    OTPRequest, OTPVerifyRequest, TokenResponse, AdvisorProfile,
    MeetingQueueItem, PreMeetingBrief, RescheduleAdvisorRequest,
    AdvisorSlotResponse, CreateSlotRequest
)
from app.services.advisor.auth import AdvisorAuth, get_current_advisor
from app.services.advisor.queue_manager import MeetingQueueManager
from app.services.advisor.brief_builder import BriefBuilder
from app.services.mcp.queue_manager import MCPQueueManager
from app.models.db_models import MCPActionLog
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/advisor", tags=["advisor"])

@router.post("/auth/request-otp", response_model=dict)
async def request_otp(req: OTPRequest, db: AsyncSession = Depends(get_db)):
    auth = AdvisorAuth(db)
    success = await auth.request_otp(req.email)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Advisor not found")
    return {"message": "OTP sent"}

@router.post("/auth/verify-otp", response_model=TokenResponse)
async def verify_otp(req: OTPVerifyRequest, db: AsyncSession = Depends(get_db)):
    auth = AdvisorAuth(db)
    token = await auth.verify_otp(req.email, req.otp)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")
    return TokenResponse(token=token)

@router.get("/me", response_model=AdvisorProfile)
async def get_me(current_advisor: Advisor = Depends(get_current_advisor)):
    return current_advisor

@router.get("/meetings", response_model=List[MeetingQueueItem])
async def get_meetings(
    status: Optional[str] = None,
    dt: Optional[date] = Query(None, alias="date"),
    topic: Optional[str] = None,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MeetingQueueManager(db)
    return await qm.get_queue(advisor_id=current_advisor.id, status=status, dt=dt, topic_category=topic)

@router.get("/meetings/{id}/brief", response_model=PreMeetingBrief)
async def get_brief(
    id: int,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    bb = BriefBuilder(db)
    brief = await bb.build(id)
    if not brief:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    mcp_queue = MCPQueueManager(db)
    try:
        # Check if already pending or approved/rejected
        existing_action = await db.execute(
            select(MCPActionLog).where(
                MCPActionLog.tool_name == "email_draft_generator",
                MCPActionLog.booking_id == id
            )
        )
        if not existing_action.scalars().first():
            await mcp_queue.queue_action(
                "email_draft_generator",
                {
                    "advisor_name": current_advisor.name,
                    "advisor_email": current_advisor.email,
                    "pulse_snippet": "", # ideally from current pulse
                    "booking_code": brief.booking_code,
                    "investor_context": brief.investor_context if hasattr(brief, "investor_context") else None
                },
                booking_id=id
            )
    except Exception as e:
        logger.warning(f"Failed to queue MCP email draft for booking {id}: {e}")

    return brief

@router.put("/meetings/{id}/confirm", response_model=dict)
async def confirm_meeting(
    id: int,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MeetingQueueManager(db)
    success = await qm.confirm_booking(id, current_advisor.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found or not owned by advisor")
    return {"message": "Meeting confirmed"}

@router.put("/meetings/{id}/complete", response_model=dict)
async def complete_meeting(
    id: int,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MeetingQueueManager(db)
    success = await qm.mark_complete(id, current_advisor.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found or not owned by advisor")
    return {"message": "Meeting completed"}

@router.put("/meetings/{id}/reschedule", response_model=dict)
async def reschedule_meeting(
    id: int,
    req: RescheduleAdvisorRequest,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    qm = MeetingQueueManager(db)
    success = await qm.reschedule_booking(id, req.new_slot_id, req.reason, current_advisor.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to reschedule meeting")
    return {"message": "Meeting rescheduled"}

@router.get("/slots", response_model=List[AdvisorSlotResponse])
async def get_slots(
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    from app.models.scheduler_models import AdvisorSlot, Booking
    from sqlalchemy import select as sa_select

    slots_res = await db.execute(
        sa_select(AdvisorSlot).where(AdvisorSlot.advisor_id == current_advisor.id)
    )
    slots = slots_res.scalars().all()

    bookings_res = await db.execute(
        sa_select(Booking).where(
            Booking.advisor_id == current_advisor.id,
            Booking.status.in_(["confirmed", "rescheduled", "completed"]),
        )
    )
    booking_by_slot_id = {b.slot_id: b.booking_code for b in bookings_res.scalars().all()}

    return [
        AdvisorSlotResponse(
            id=s.id,
            start_time=s.start_time,
            end_time=s.end_time,
            is_blocked=s.is_blocked,
            is_recurring=s.is_recurring,
            booking_code=booking_by_slot_id.get(s.id),
        )
        for s in slots
    ]

@router.post("/slots", response_model=AdvisorSlotResponse)
async def create_slot(
    req: CreateSlotRequest,
    current_advisor: Advisor = Depends(get_current_advisor),
    db: AsyncSession = Depends(get_db)
):
    from app.models.scheduler_models import AdvisorSlot

    slot = AdvisorSlot(
        advisor_id=current_advisor.id,
        start_time=req.start_time,
        end_time=req.end_time,
        is_recurring=req.is_recurring,
        day_of_week=req.start_time.weekday() if req.is_recurring else None,
        is_blocked=False,
    )
    db.add(slot)
    await db.commit()
    await db.refresh(slot)

    return AdvisorSlotResponse(
        id=slot.id,
        start_time=slot.start_time,
        end_time=slot.end_time,
        is_blocked=slot.is_blocked,
        is_recurring=slot.is_recurring,
        booking_code=None,
    )

@router.put("/slots/{id}/block", response_model=dict)
async def block_slot(id: int, current_advisor: Advisor = Depends(get_current_advisor)):
    return {"message": "Slot blocked"}

@router.delete("/slots/{id}", response_model=dict)
async def delete_slot(id: int, current_advisor: Advisor = Depends(get_current_advisor)):
    return {"message": "Slot deleted"}
