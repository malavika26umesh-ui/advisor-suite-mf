from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.scheduler_schemas import (
    AvailableSlot, BookingCreate, BookingResponse, PiiCheckRequest,
    PiiCheckResponse, TopicClassifyRequest, RescheduleRequest
)
from app.services.scheduler.slots import SlotManager
from app.services.scheduler.booking import BookingService
from app.services.scheduler.pii_guard import PIIGuard
from app.services.scheduler.email_sender import EmailSender
from app.services.scheduler.stt_sarvam import SarvamSTTService
from app.services.triage.classifier import TriageClassifier

router = APIRouter(prefix="/api/scheduler", tags=["scheduler"])

slot_manager = SlotManager()
booking_service = BookingService()
pii_guard = PIIGuard()
email_sender = EmailSender()
stt_service = SarvamSTTService()
triage_classifier = TriageClassifier()

@router.get("/slots", response_model=list[AvailableSlot])
async def get_slots(db: AsyncSession = Depends(get_db)):
    slots = await slot_manager.get_available_slots(db)
    return [
        AvailableSlot(
            id=s.id,
            advisor_id=s.advisor_id,
            advisor_name=s.advisor.name,
            start_time=s.start_time,
            end_time=s.end_time
        ) for s in slots
    ]

@router.post("/bookings", response_model=BookingResponse)
async def create_booking(
    request: BookingCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    from app.models.scheduler_models import AdvisorSlot, Booking
    from sqlalchemy.future import select
    slot = (await db.execute(select(AdvisorSlot).where(AdvisorSlot.id == request.slot_id))).scalars().first()
    if not slot or slot.is_blocked:
        raise HTTPException(status_code=400, detail="Slot is not available.")
    
    existing_booking = (await db.execute(select(Booking).where(Booking.slot_id == request.slot_id, Booking.status.in_(["confirmed", "rescheduled"])))).scalars().first()
    if existing_booking:
        raise HTTPException(status_code=400, detail="Slot is already booked.")
        
    booking = await booking_service.create_booking(
        session=db,
        slot_id=request.slot_id,
        topic_category=request.topic_category,
        session_id=request.session_id,
        email=request.email,
        slot_datetime=slot.start_time,
        advisor_id=slot.advisor_id,
        context=request.context
    )
    
    from sqlalchemy.orm import selectinload
    booking_with_advisor = (await db.execute(select(Booking).options(selectinload(Booking.advisor)).where(Booking.id == booking.id))).scalars().first()
    background_tasks.add_task(email_sender.send_booking_confirmation, request.email, booking_with_advisor)
    
    return BookingResponse(
        id=booking.id,
        booking_code=booking.booking_code,
        advisor_name=booking_with_advisor.advisor.name,
        topic_category=booking.topic_category,
        status=booking.status,
        slot_datetime=booking.slot_datetime
    )

@router.post("/classify-topic")
async def classify_topic(request: TopicClassifyRequest):
    result = triage_classifier.classify(request.text, request.session_id)
    return {"topic_category": result.bucket}

@router.post("/pii-check", response_model=PiiCheckResponse)
async def check_pii(request: PiiCheckRequest):
    has_pii, matched_type = pii_guard.detect_pii(request.text)
    return PiiCheckResponse(
        has_pii=has_pii,
        matched_type=matched_type,
        deflection_message=pii_guard.get_deflection_message() if has_pii else None
    )

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = stt_service.transcribe(audio_bytes)
    return {"transcript": transcript}

@router.get("/bookings/{code}", response_model=BookingResponse)
async def get_booking(code: str, email: str, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.orm import selectinload
    from app.models.scheduler_models import Booking
    from sqlalchemy.future import select
    from app.core.security import hash_email
    
    email_hash = hash_email(email)
    booking = (await db.execute(select(Booking).options(selectinload(Booking.advisor)).where(Booking.booking_code == code, Booking.investor_email_hash == email_hash))).scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or email mismatch")
        
    return BookingResponse(
        id=booking.id,
        booking_code=booking.booking_code,
        advisor_name=booking.advisor.name,
        topic_category=booking.topic_category,
        status=booking.status,
        slot_datetime=booking.slot_datetime
    )

@router.put("/bookings/{code}/reschedule", response_model=BookingResponse)
async def reschedule_booking(
    code: str, 
    request: RescheduleRequest, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    from app.models.scheduler_models import AdvisorSlot, Booking
    from sqlalchemy.future import select
    from sqlalchemy.orm import selectinload
    
    slot = (await db.execute(select(AdvisorSlot).where(AdvisorSlot.id == request.new_slot_id))).scalars().first()
    if not slot or slot.is_blocked:
        raise HTTPException(status_code=400, detail="New slot is not available.")
        
    existing_booking = (await db.execute(select(Booking).where(Booking.slot_id == request.new_slot_id, Booking.status.in_(["confirmed", "rescheduled"])))).scalars().first()
    if existing_booking:
        raise HTTPException(status_code=400, detail="New slot is already booked.")
        
    booking = await booking_service.reschedule_booking(
        session=db,
        booking_code=code,
        email=request.email,
        new_slot_id=request.new_slot_id,
        new_slot_datetime=slot.start_time
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or email mismatch")
        
    booking_with_advisor = (await db.execute(select(Booking).options(selectinload(Booking.advisor)).where(Booking.id == booking.id))).scalars().first()
    background_tasks.add_task(email_sender.send_reschedule_notification, request.email, booking_with_advisor)
    
    return BookingResponse(
        id=booking.id,
        booking_code=booking.booking_code,
        advisor_name=booking_with_advisor.advisor.name,
        topic_category=booking.topic_category,
        status=booking.status,
        slot_datetime=booking.slot_datetime
    )

@router.delete("/bookings/{code}")
async def cancel_booking(code: str, email: str, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.orm import selectinload
    from app.models.scheduler_models import Booking
    from sqlalchemy.future import select
    from app.core.security import hash_email
    
    email_hash = hash_email(email)
    booking_with_advisor = (await db.execute(select(Booking).options(selectinload(Booking.advisor)).where(Booking.booking_code == code, Booking.investor_email_hash == email_hash))).scalars().first()

    success, message = await booking_service.cancel_booking(db, code, email)
    if not success:
        raise HTTPException(status_code=400 if "2 hours" in message else 403, detail=message)
        
    if booking_with_advisor:
        background_tasks.add_task(email_sender.send_cancellation_confirmation, email, booking_with_advisor)
        
    return {"message": message}

# Advisor auth required (Mocked for now)
@router.post("/bookings/{id}/complete")
async def mark_complete(id: int, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    # TODO: Add advisor auth dependency
    from sqlalchemy.orm import selectinload
    from app.models.scheduler_models import Booking
    from sqlalchemy.future import select
    
    booking = (await db.execute(select(Booking).options(selectinload(Booking.advisor)).where(Booking.id == id))).scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    success = await booking_service.mark_complete(db, id)
    if success:
        background_tasks.add_task(email_sender.send_post_meeting_feedback, "dummy@investor.mf", booking)
    
    return {"success": success}
