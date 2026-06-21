from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.education_models import EducationQueryLog
from app.models.education_schemas import EducationQAResponse
from app.services.rag.answer_builder import FAQAnswerBuilder
from app.services.rag.retriever import PineconeRetriever
from app.services.triage.classifier import TriageClassifier

NO_ANSWER_TEXT = "We don't have verified information about this in our knowledge base."


class EducationQAService:
    def __init__(self):
        self.triage_classifier = TriageClassifier()
        self.retriever = PineconeRetriever()
        self.answer_builder = FAQAnswerBuilder()

    async def ask(self, query: str, session_id: str, db) -> EducationQAResponse:
        triage_result = self.triage_classifier.classify(query, session_id)

        if triage_result.bucket == "advice_seeking":
            return EducationQAResponse(status="advice_deflected", answer=None, session_log_id=None)

        # Always the "education" namespace - no scheme-scope checking, no
        # scheme-filtered retrieval. General mutual fund concepts only; a
        # scheme-specific question here will just retrieve nothing relevant
        # and fall through to "no_answer", which is correct - scheme-specific
        # facts are FAQ Centre's responsibility, not this feature's.
        chunks = self.retriever.retrieve(query, namespace="education", top_k=5)
        answer = self.answer_builder.build(query, chunks, scheme_name=None)

        if answer.answer_text == NO_ANSWER_TEXT:
            status = "no_answer"
        elif answer.clarification_needed:
            status = "clarification_needed"
        else:
            status = "answered"

        expires_at = datetime.utcnow() + timedelta(days=7)
        log_entry = EducationQueryLog(
            session_id=session_id,
            query=query,
            answer_text=answer.answer_text,
            bucket=triage_result.bucket,
            expires_at=expires_at,
        )
        db.add(log_entry)

        if isinstance(db, AsyncSession):
            await db.commit()
            await db.refresh(log_entry)
        else:
            db.commit()
            db.refresh(log_entry)

        return EducationQAResponse(
            status=status,
            answer=answer,
            session_log_id=str(log_entry.id),
        )
