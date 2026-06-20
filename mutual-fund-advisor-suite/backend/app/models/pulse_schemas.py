from datetime import date, datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class PulseInputData(BaseModel):
    """Aggregated, fully anonymised inputs for one week — counts only, no raw PII."""

    week_start: date
    week_end: date
    topic_distribution: Dict[str, int] = Field(default_factory=dict)
    top_queries: List[str] = Field(default_factory=list)
    booking_topic_distribution: Dict[str, int] = Field(default_factory=dict)
    feedback_counts: Dict[str, int] = Field(default_factory=dict)
    fee_term_counts: Dict[str, int] = Field(default_factory=dict)
    total_queries: int = 0
    app_reviews: List[str] = Field(default_factory=list)


class PulseReportData(BaseModel):
    """Generated report content — pre-persistence, pre-corpus-refresh."""

    top_themes: List[str]
    user_quotes: List[str]
    key_observation: str
    fee_spotlight_term: str
    product_recommendations: List[str]
    sections_1_4_word_count: int


class PulseReportResponse(BaseModel):
    id: int
    week_start_date: date
    top_themes: List[str]
    user_quotes: List[str]
    key_observation: str
    fee_spotlight_term: str
    product_recommendations: List[str]
    corpus_refresh_version: Optional[int] = None
    corpus_refresh_confirmed_at: Optional[datetime] = None
    created_at: datetime
    sections_1_4_word_count: int


class CurrentThemeResponse(BaseModel):
    theme: str


class PulseFeedbackRequest(BaseModel):
    booking_id: int
    rating: str  # very_useful | somewhat_useful | not_useful
