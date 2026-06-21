from datetime import datetime, timedelta

from app.services.rag.corpus_check import CorpusChecker
from app.services.triage.classifier import TriageClassifier
from app.services.rag.chroma_retriever import ChromaRetriever
from app.services.rag.answer_builder import FAQAnswerBuilder
from app.services.rag.education_lookup import EducationLookup
from app.models.faq_schemas import FAQResponse, RelatedEducationArticle
from app.models.faq_models import SessionFaqLog

class FAQPipeline:
    def __init__(self):
        self.corpus_checker = CorpusChecker()
        self.triage_classifier = TriageClassifier()
        self.retriever = ChromaRetriever()
        self.answer_builder = FAQAnswerBuilder()
        self.education_lookup = EducationLookup()

    async def query(self, query: str, session_id: str, db) -> FAQResponse:
        # 1. Corpus check
        in_scope, scheme_name = self.corpus_checker.is_in_scope(query)
        if not in_scope:
            return FAQResponse(status="out_of_scope", out_of_scope_scheme=scheme_name)
            
        # 2. Triage classifier
        triage_result = self.triage_classifier.classify(query, session_id)
        if triage_result.bucket == "advice_seeking":
            return FAQResponse(status="advice_deflected")
            
        # 3. Retrieve chunks
        scheme_detected = triage_result.scheme_name_detected
        if scheme_detected:
            chunks = self.retriever.retrieve_with_scheme_filter(query, scheme_detected, top_k=5)
        else:
            # We must pass namespace to retrieve
            ns = "education" if triage_result.bucket == "educational" else "regulatory"
            chunks = self.retriever.retrieve(query, namespace=ns, top_k=5)
            
        # 4. Answer Builder
        answer = self.answer_builder.build(query, chunks, scheme_detected)

        # 4a. Education Hub routing — attach related articles for the frontend's
        # "Read more in Education Hub" links when the triage bucket is educational.
        related_articles = []
        if triage_result.bucket == "educational":
            related_articles = [
                RelatedEducationArticle(**article)
                for article in self.education_lookup.find_related(query, limit=3)
            ]

        status = "answered"
        if answer.answer_text == "We don't have verified information about this in our knowledge base.":
            status = "no_answer"
        elif answer.clarification_needed:
            status = "clarification_needed"
            
        # 5. Log to session_faq_log
        expires_at = datetime.utcnow() + timedelta(days=7)
        log_entry = SessionFaqLog(
            session_id=session_id,
            query=query,
            answer_text=answer.answer_text if answer else None,
            bucket=triage_result.bucket,
            scheme_name=scheme_detected,
            expires_at=expires_at
        )
        db.add(log_entry)
        
        from sqlalchemy.ext.asyncio import AsyncSession
        if isinstance(db, AsyncSession):
            await db.commit()
            await db.refresh(log_entry)
        else:
            db.commit()
            db.refresh(log_entry)
        
        return FAQResponse(
            status=status,
            answer=answer,
            out_of_scope_scheme=None,
            session_log_id=str(log_entry.id),
            related_education_articles=related_articles
        )
