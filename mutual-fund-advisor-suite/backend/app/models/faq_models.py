from sqlalchemy import Column, Integer, String, JSON, DateTime, func
from app.core.database import Base

class SessionFaqLog(Base):
    __tablename__ = "session_faq_log"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    query = Column(String)
    answer_text = Column(String, nullable=True)
    bucket = Column(String)
    scheme_name = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))

class FeeExplainer(Base):
    __tablename__ = "fee_explainer"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(Integer, default=1)
    fee_term = Column(String, index=True)
    bullets_json = Column(JSON) 
    source_links_json = Column(JSON) 
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
