import re
from typing import List, Optional

from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.education_models import CATEGORIES, EducationArticle
from app.models.education_schemas import (
    ArticleDetail,
    ArticleSummary,
    SearchResult,
    SectionSummary,
)

EXCERPT_LENGTH = 150


def _to_summary(article: EducationArticle) -> ArticleSummary:
    return ArticleSummary(
        slug=article.slug,
        title=article.title,
        category=article.category,
        section_order=article.section_order,
        most_misunderstood=article.most_misunderstood,
        scheme_example_id=article.scheme_example_id,
    )


def _to_detail(article: EducationArticle) -> ArticleDetail:
    return ArticleDetail(
        slug=article.slug,
        title=article.title,
        category=article.category,
        section_order=article.section_order,
        body_markdown=article.body_markdown,
        source_citations=article.source_citations_json or [],
        last_reviewed_date=article.last_reviewed_date,
        version=article.version,
        scheme_example_id=article.scheme_example_id,
        most_misunderstood=article.most_misunderstood,
    )


def _excerpt(body_markdown: str, length: int = EXCERPT_LENGTH) -> str:
    flat = " ".join(body_markdown.split())
    return flat[:length]


class EducationService:
    async def list_sections(self, db: AsyncSession) -> List[SectionSummary]:
        sections = []
        for category in CATEGORIES:
            result = await db.execute(
                select(EducationArticle).where(
                    EducationArticle.category == category,
                    EducationArticle.is_published.is_(True),
                )
            )
            count = len(result.scalars().all())
            sections.append(SectionSummary(category=category, article_count=count))
        return sections

    async def list_articles(
        self, db: AsyncSession, category: Optional[str] = None, search: Optional[str] = None
    ) -> List[ArticleSummary]:
        query = select(EducationArticle).where(EducationArticle.is_published.is_(True))
        if category:
            query = query.where(EducationArticle.category == category)
        if search:
            like = f"%{search}%"
            query = query.where(
                EducationArticle.title.ilike(like) | EducationArticle.body_markdown.ilike(like)
            )
        query = query.order_by(EducationArticle.category, EducationArticle.section_order)
        result = await db.execute(query)
        return [_to_summary(a) for a in result.scalars().all()]

    async def get_article(self, db: AsyncSession, slug: str) -> Optional[ArticleDetail]:
        result = await db.execute(
            select(EducationArticle).where(
                EducationArticle.slug == slug, EducationArticle.is_published.is_(True)
            )
        )
        article = result.scalar_one_or_none()
        return _to_detail(article) if article else None

    async def get_related(self, db: AsyncSession, slug: str, limit: int = 3) -> List[ArticleSummary]:
        current = await db.execute(
            select(EducationArticle).where(EducationArticle.slug == slug)
        )
        current_article = current.scalar_one_or_none()
        if not current_article:
            return []

        result = await db.execute(
            select(EducationArticle)
            .where(
                EducationArticle.category == current_article.category,
                EducationArticle.slug != slug,
                EducationArticle.is_published.is_(True),
            )
            .order_by(EducationArticle.section_order)
            .limit(limit)
        )
        return [_to_summary(a) for a in result.scalars().all()]

    async def search(self, db: AsyncSession, q: str, limit: int = 10) -> List[SearchResult]:
        # Plain ILIKE OR-matching, not SQLite FTS5 — FTS5 virtual tables/MATCH syntax
        # don't exist in PostgreSQL (this is what broke in production after the
        # Sprint 19 SQLite->Postgres migration: "syntax error at or near MATCH").
        # OR across terms (not AND): natural-language questions are full of filler
        # words ("what", "is", "a") that the matching article's body rarely contains
        # verbatim; requiring every term to match excludes the obviously-right result.
        terms = re.findall(r"[A-Za-z0-9]+", q)
        if not terms:
            return []

        conditions = [
            EducationArticle.title.ilike(f"%{term}%") | EducationArticle.body_markdown.ilike(f"%{term}%")
            for term in terms
        ]
        result = await db.execute(
            select(EducationArticle).where(EducationArticle.is_published.is_(True), or_(*conditions))
        )
        articles = result.scalars().all()

        def relevance(article: EducationArticle) -> int:
            title_lower = article.title.lower()
            body_lower = article.body_markdown.lower()
            score = 0
            for term in terms:
                term_lower = term.lower()
                if term_lower in title_lower:
                    score += 2
                if term_lower in body_lower:
                    score += 1
            return score

        articles.sort(key=relevance, reverse=True)

        return [
            SearchResult(slug=a.slug, title=a.title, category=a.category, excerpt=_excerpt(a.body_markdown))
            for a in articles[:limit]
        ]
