import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_advice_seeking_question_is_deflected():
    session_id = str(uuid.uuid4())
    res = client.post(
        "/api/education/ask",
        json={"query": "Should I invest in ELSS?", "session_id": session_id},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "advice_deflected"
    assert data["answer"] is None


def test_general_concept_question_is_answered_with_real_sources():
    session_id = str(uuid.uuid4())
    res = client.post(
        "/api/education/ask",
        json={"query": "How does a SIP work?", "session_id": session_id},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ("answered", "no_answer")
    if data["status"] == "answered":
        assert data["answer"] is not None
        assert len(data["answer"]["source_badges"]) > 0
        # Must never be the mock fallback URL used by FAQ Centre's scheme-specific
        # facts (those are unsourced placeholders) - Education Hub's general
        # concept content is real, indexed PDF content.
        assert "amc.mock.com" not in str(data["answer"]["source_urls"])


def test_education_query_logs_to_its_own_table_not_session_faq_log():
    import asyncio

    from sqlalchemy import select

    from app.core.database import async_session_maker
    from app.models.education_models import EducationQueryLog
    from app.models.faq_models import SessionFaqLog

    session_id = f"test-logging-{uuid.uuid4()}"
    res = client.post(
        "/api/education/ask",
        json={"query": "What is NAV?", "session_id": session_id},
    )
    assert res.status_code == 200

    async def check():
        async with async_session_maker() as db:
            education_rows = (
                await db.execute(
                    select(EducationQueryLog).where(EducationQueryLog.session_id == session_id)
                )
            ).scalars().all()
            faq_rows = (
                await db.execute(
                    select(SessionFaqLog).where(SessionFaqLog.session_id == session_id)
                )
            ).scalars().all()
            return education_rows, faq_rows

    education_rows, faq_rows = asyncio.run(check())
    assert len(education_rows) == 1, "Education Hub queries must write to education_query_log"
    assert education_rows[0].query == "What is NAV?"
    assert faq_rows == [], "Education Hub queries must never write to session_faq_log"
