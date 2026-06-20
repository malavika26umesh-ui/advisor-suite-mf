from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class TokenResponse(BaseModel):
    token: str

class AdvisorProfile(BaseModel):
    id: int
    email: str
    name: str
    sebi_registration_number: str
    is_active: bool

    class Config:
        from_attributes = True

class MeetingQueueItem(BaseModel):
    id: int
    booking_code: str
    topic_category: str
    slot_datetime: datetime
    status: str
    brief_preview_available: bool

    class Config:
        from_attributes = True

class EducationArticleRef(BaseModel):
    title: str
    slug: str

class PreMeetingBrief(BaseModel):
    booking_code: str
    topic_category: str
    investor_context: Optional[str] = None
    session_faq_queries: List[str]
    pulse_top_theme: Optional[str] = None
    relevant_education_articles: List[EducationArticleRef]

class RescheduleAdvisorRequest(BaseModel):
    new_slot_id: int
    reason: str

class AdvisorSlotResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    is_blocked: bool
    is_recurring: bool
    booking_code: Optional[str] = None

class CreateSlotRequest(BaseModel):
    start_time: datetime
    end_time: datetime
    is_recurring: bool = False
