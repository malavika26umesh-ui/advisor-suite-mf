from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.scheduler_models import Booking
from app.models.faq_models import SessionFaqLog
from app.models.education_models import EducationArticle
from app.models.advisor_schemas import PreMeetingBrief, EducationArticleRef
from app.models.pulse_models import PulseReport
from app.core.security import decrypt_data

class BriefBuilder:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def build(self, booking_id: int) -> Optional[PreMeetingBrief]:
        booking_res = await self.db.execute(select(Booking).where(Booking.id == booking_id))
        booking = booking_res.scalars().first()
        if not booking:
            return None

        investor_context = None
        if booking.investor_context_encrypted:
            try:
                investor_context = decrypt_data(booking.investor_context_encrypted)
            except Exception:
                # Decryption fails if SECRET_KEY has rotated since this row was written
                # (Fernet ties the key to the ciphertext). A brief must never 500 over
                # an undecryptable optional field — treat it the same as "not shared."
                investor_context = None

        faq_res = await self.db.execute(
            select(SessionFaqLog.query)
            .where(SessionFaqLog.session_id == booking.session_id)
            .order_by(SessionFaqLog.timestamp.desc())
            .limit(3)
        )
        session_faq_queries = faq_res.scalars().all()

        article_res = await self.db.execute(
            select(EducationArticle)
            .where(EducationArticle.category == booking.topic_category)
            .limit(2)
        )
        articles = article_res.scalars().all()
        relevant_articles = [EducationArticleRef(title=a.title, slug=a.slug) for a in articles]

        pulse_res = await self.db.execute(
            select(PulseReport).order_by(PulseReport.week_start_date.desc()).limit(1)
        )
        latest_pulse = pulse_res.scalars().first()
        pulse_top_theme = latest_pulse.top_themes_json[0] if latest_pulse and latest_pulse.top_themes_json else None

        brief_dict = {
            "booking_code": booking.booking_code,
            "topic_category": booking.topic_category,
            "investor_context": investor_context,
            "session_faq_queries": list(session_faq_queries),
            "pulse_top_theme": pulse_top_theme,
            "relevant_education_articles": relevant_articles
        }
        
        # Ensure no PII or AI-generated advisory recommendations are present
        forbidden_keys = ["pan", "aadhaar", "folio", "account_number", "portfolio", "advisory_recommendation"]
        for key in forbidden_keys:
            assert key not in brief_dict, f"PII or forbidden field {key} leaked into PreMeetingBrief!"

        return PreMeetingBrief(**brief_dict)
