import re
import sqlite3
from typing import List

from app.core.config import settings


def _sqlite_path() -> str:
    # settings.DATABASE_URL is e.g. "sqlite+aiosqlite:///./dev.db" — strip the
    # SQLAlchemy driver prefix to get a plain path sqlite3 can open directly.
    return settings.DATABASE_URL.split("///")[-1]


class EducationLookup:
    """Synchronous FTS5 lookup used by FAQPipeline, which is not yet async (Sprint 7)."""

    def find_related(self, query: str, limit: int = 3) -> List[dict]:
        terms = re.findall(r"[A-Za-z0-9]+", query)
        if not terms:
            return []
        fts_query = " OR ".join(terms)

        try:
            conn = sqlite3.connect(_sqlite_path())
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute(
                """
                SELECT ed.slug, ed.title, ed.category
                FROM education_articles_fts
                JOIN education_articles ed ON ed.id = education_articles_fts.rowid
                WHERE education_articles_fts MATCH ? AND ed.is_published = 1
                ORDER BY rank
                LIMIT ?
                """,
                (fts_query, limit),
            )
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            return rows
        except sqlite3.Error:
            # Education Hub content is a nice-to-have attachment on FAQ answers —
            # never let a lookup failure break the FAQ response itself.
            return []
