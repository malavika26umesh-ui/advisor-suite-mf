from pydantic import BaseModel
from typing import List, Optional

class FAQAnswer(BaseModel):
    answer_text: str
    source_badges: List[str]
    source_urls: List[str]
    has_nav_data: bool = False
    clarification_needed: bool = False
    clarification_question: Optional[str] = None

class RelatedEducationArticle(BaseModel):
    slug: str
    title: str
    category: str


class FAQResponse(BaseModel):
    status: str
    answer: Optional[FAQAnswer] = None
    out_of_scope_scheme: Optional[str] = None
    session_log_id: Optional[str] = None
    related_education_articles: List[RelatedEducationArticle] = []

class FAQQueryRequest(BaseModel):
    query: str
    session_id: str

class FeeExplainerContent(BaseModel):
    version: int
    fee_term: str
    bullets: List[str]
    source_links: List[str]
    updated_at: str
