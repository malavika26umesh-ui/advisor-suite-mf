from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class TriageLog(Base):
    __tablename__ = "triage_log"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    query_text = Column(String)
    bucket = Column(String)
    confidence = Column(Float)
    scheme_detected = Column(String, nullable=True)
    out_of_scope = Column(Boolean, default=False)
    escalation_flag = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
