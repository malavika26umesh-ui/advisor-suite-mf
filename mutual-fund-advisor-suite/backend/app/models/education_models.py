from sqlalchemy import Boolean, Column, Date, Integer, JSON, String, Text
from app.core.database import Base

CATEGORIES = (
    "fund_categories",
    "key_concepts",
    "fee_education",
    "investor_processes",
    "investor_rights",
)


class EducationArticle(Base):
    __tablename__ = "education_articles"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, index=True, nullable=False)
    section_order = Column(Integer, nullable=False, default=0)
    body_markdown = Column(Text, nullable=False)
    source_citations_json = Column(JSON, nullable=False, default=list)
    last_reviewed_date = Column(Date, nullable=False)
    version = Column(Integer, nullable=False, default=1)
    scheme_example_id = Column(Integer, nullable=True)
    most_misunderstood = Column(Boolean, nullable=False, default=False)
    is_published = Column(Boolean, nullable=False, default=True)
