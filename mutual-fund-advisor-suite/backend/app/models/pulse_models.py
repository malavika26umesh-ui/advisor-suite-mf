from sqlalchemy import Column, Integer, String, JSON, Text, Date, DateTime, ForeignKey, func
from app.core.database import Base


class PulseReport(Base):
    __tablename__ = "pulse_reports"

    id = Column(Integer, primary_key=True, index=True)
    week_start_date = Column(Date, nullable=False, index=True)
    top_themes_json = Column(JSON, nullable=False, default=list)
    user_quotes_json = Column(JSON, nullable=False, default=list)
    key_observation = Column(Text, nullable=False)
    fee_spotlight_term = Column(String, nullable=False)
    product_recommendations_json = Column(JSON, nullable=False, default=list)
    corpus_refresh_version = Column(Integer, nullable=True)
    corpus_refresh_confirmed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sections_1_4_word_count = Column(Integer, nullable=False, default=0)


class PostMeetingFeedback(Base):
    __tablename__ = "post_meeting_feedback"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    rating = Column(String, nullable=False)  # very_useful | somewhat_useful | not_useful
    created_at = Column(DateTime(timezone=True), server_default=func.now())
