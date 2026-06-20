from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Advisor(Base):
    __tablename__ = "advisors"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    sebi_registration_number = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)

class AdvisorSlot(Base):
    __tablename__ = "advisor_slots"
    
    id = Column(Integer, primary_key=True, index=True)
    advisor_id = Column(Integer, ForeignKey("advisors.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_recurring = Column(Boolean, default=False)
    day_of_week = Column(Integer, nullable=True) # 0-6
    is_blocked = Column(Boolean, default=False)
    
    advisor = relationship("Advisor")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_code = Column(String, unique=True, index=True, nullable=False)
    advisor_id = Column(Integer, ForeignKey("advisors.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("advisor_slots.id"), nullable=False)
    topic_category = Column(String, nullable=False)
    investor_email_hash = Column(String, nullable=False)
    investor_context_encrypted = Column(String, nullable=True)
    session_id = Column(String, nullable=False)
    status = Column(String, default="confirmed") # confirmed, cancelled, completed, rescheduled
    created_at = Column(DateTime, default=datetime.utcnow)
    slot_datetime = Column(DateTime, nullable=False)
    
    advisor = relationship("Advisor")
    slot = relationship("AdvisorSlot")

class VoiceTranscript(Base):
    __tablename__ = "voice_transcripts"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    transcript_text = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    
    booking = relationship("Booking")

class OTPStore(Base):
    __tablename__ = "otp_store"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
