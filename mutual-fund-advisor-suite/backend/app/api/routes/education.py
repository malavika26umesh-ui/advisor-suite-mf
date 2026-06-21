from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.education_models import CATEGORIES
from app.models.education_schemas import (
    ArticleDetail,
    ArticleSummary,
    EducationQARequest,
    EducationQAResponse,
    SearchResult,
    SectionSummary,
)
from app.services.education.service import EducationService
from app.services.education.qa_service import EducationQAService

router = APIRouter(prefix="/api/education", tags=["education"])
service = EducationService()
qa_service = EducationQAService()


@router.get("/sections", response_model=List[SectionSummary])
async def get_sections(db: AsyncSession = Depends(get_db)):
    return await service.list_sections(db)


@router.get("/articles", response_model=List[ArticleSummary])
async def get_articles(
    category: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    if category and category not in CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Unknown category: {category}")
    return await service.list_articles(db, category=category, search=search)


@router.get("/search", response_model=List[SearchResult])
async def search_articles(q: str = Query(...), db: AsyncSession = Depends(get_db)):
    return await service.search(db, q)


@router.get("/related/{slug}", response_model=List[ArticleSummary])
async def get_related(slug: str, db: AsyncSession = Depends(get_db)):
    return await service.get_related(db, slug)


@router.get("/articles/{slug}", response_model=ArticleDetail)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)):
    article = await service.get_article(db, slug)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/ask", response_model=EducationQAResponse)
async def ask_education_question(request: EducationQARequest, db: AsyncSession = Depends(get_db)):
    return await qa_service.ask(request.query, request.session_id, db)
