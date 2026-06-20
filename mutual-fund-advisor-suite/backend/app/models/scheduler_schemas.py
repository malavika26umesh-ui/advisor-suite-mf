from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class AvailableSlot(BaseModel):
    id: int
    advisor_id: int
    advisor_name: str
    start_time: datetime
    end_time: datetime
    
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    slot_id: int
    topic_category: str
    session_id: str
    email: EmailStr
    context: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    booking_code: str
    advisor_name: str
    topic_category: str
    status: str
    slot_datetime: datetime
    
    class Config:
        from_attributes = True

class PiiCheckRequest(BaseModel):
    text: str

class PiiCheckResponse(BaseModel):
    has_pii: bool
    matched_type: Optional[str] = None
    deflection_message: Optional[str] = None

class TopicClassifyRequest(BaseModel):
    text: str
    session_id: str

class RescheduleRequest(BaseModel):
    new_slot_id: int
    email: EmailStr
