from datetime import date
from typing import List, Optional

from pydantic import BaseModel
from app.models.faq_schemas import FAQAnswer


class Citation(BaseModel):
    label: str
    url: str
    citation_text: str


class SectionSummary(BaseModel):
    category: str
    article_count: int


class ArticleSummary(BaseModel):
    slug: str
    title: str
    category: str
    section_order: int
    most_misunderstood: bool
    scheme_example_id: Optional[int] = None


class ArticleDetail(BaseModel):
    slug: str
    title: str
    category: str
    section_order: int
    body_markdown: str
    source_citations: List[Citation]
    last_reviewed_date: date
    version: int
    scheme_example_id: Optional[int] = None
    most_misunderstood: bool


class SearchResult(BaseModel):
    slug: str
    title: str
    category: str
    excerpt: str


class EducationQARequest(BaseModel):
    query: str
    session_id: str


class EducationQAResponse(BaseModel):
    status: str
    answer: Optional[FAQAnswer] = None
    session_log_id: Optional[str] = None
