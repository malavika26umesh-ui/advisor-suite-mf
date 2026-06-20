from datetime import date, datetime, time
from typing import List

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
import csv
import os

from app.models.faq_models import SessionFaqLog
from app.models.scheduler_models import Booking
from app.models.pulse_models import PostMeetingFeedback
from app.models.pulse_schemas import PulseInputData
from app.services.scheduler.pii_guard import PIIGuard

# Mirrors the Education Hub's fee_education article slugs (Sprint 9) — kept as a
# small local mapping rather than a cross-service import, since this only needs
# substring matching, not the article content itself.
FEE_TERM_PATTERNS = {
    "TER": ["ter", "total expense ratio", "expense ratio"],
    "Exit Load": ["exit load"],
    "Stamp Duty": ["stamp duty"],
    "STT": ["stt", "securities transaction tax"],
    "Distributor Commission": ["distributor", "regular plan", "direct plan"],
}

MAX_CANDIDATE_QUOTES = 8


class PulseAggregator:
    def __init__(self):
        self.pii_guard = PIIGuard()

    async def aggregate(self, db: AsyncSession, week_start: date, week_end: date) -> PulseInputData:
        start_dt = datetime.combine(week_start, time.min)
        end_dt = datetime.combine(week_end, time.max)

        topic_distribution = await self._topic_distribution(db, start_dt, end_dt)
        top_queries = await self._top_queries(db, start_dt, end_dt)
        booking_topic_distribution = await self._booking_topic_distribution(db, start_dt, end_dt)
        feedback_counts = await self._feedback_counts(db, start_dt, end_dt)
        fee_term_counts = await self._fee_term_counts(db, start_dt, end_dt)

        total_queries = sum(topic_distribution.values())

        app_reviews = self._read_csv_reviews()

        return PulseInputData(
            week_start=week_start,
            week_end=week_end,
            topic_distribution=topic_distribution,
            top_queries=top_queries,
            booking_topic_distribution=booking_topic_distribution,
            feedback_counts=feedback_counts,
            fee_term_counts=fee_term_counts,
            total_queries=total_queries,
            app_reviews=app_reviews,
        )

    def _read_csv_reviews(self) -> List[str]:
        csv_path = os.path.join(os.path.dirname(__file__), "../../../pulse_data.csv")
        reviews_list = []
        if os.path.exists(csv_path):
            with open(csv_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row.get("event_type") == "reviews_data" and row.get("user_text"):
                        reviews_list.append(row["user_text"])
        # Take a sample of 20 to avoid exceeding LLM context limits
        return reviews_list[:20]

    async def _topic_distribution(self, db, start_dt, end_dt) -> dict:
        stmt = (
            select(SessionFaqLog.bucket, func.count(SessionFaqLog.id))
            .where(SessionFaqLog.timestamp >= start_dt, SessionFaqLog.timestamp <= end_dt)
            .group_by(SessionFaqLog.bucket)
        )
        result = await db.execute(stmt)
        return {bucket or "unknown": count for bucket, count in result.all()}

    async def _top_queries(self, db, start_dt, end_dt) -> List[str]:
        stmt = (
            select(SessionFaqLog.query)
            .where(SessionFaqLog.timestamp >= start_dt, SessionFaqLog.timestamp <= end_dt)
            .order_by(SessionFaqLog.timestamp.desc())
            .limit(MAX_CANDIDATE_QUOTES * 3)
        )
        result = await db.execute(stmt)
        candidates = []
        seen = set()
        for (query,) in result.all():
            if not query or query in seen:
                continue
            has_pii, _ = self.pii_guard.detect_pii(query)
            if has_pii:
                continue
            seen.add(query)
            candidates.append(query)
            if len(candidates) >= MAX_CANDIDATE_QUOTES:
                break
        return candidates

    async def _booking_topic_distribution(self, db, start_dt, end_dt) -> dict:
        stmt = (
            select(Booking.topic_category, func.count(Booking.id))
            .where(Booking.created_at >= start_dt, Booking.created_at <= end_dt)
            .group_by(Booking.topic_category)
        )
        result = await db.execute(stmt)
        return {topic or "unknown": count for topic, count in result.all()}

    async def _feedback_counts(self, db, start_dt, end_dt) -> dict:
        stmt = (
            select(PostMeetingFeedback.rating, func.count(PostMeetingFeedback.id))
            .where(PostMeetingFeedback.created_at >= start_dt, PostMeetingFeedback.created_at <= end_dt)
            .group_by(PostMeetingFeedback.rating)
        )
        result = await db.execute(stmt)
        return {rating: count for rating, count in result.all()}

    async def _fee_term_counts(self, db, start_dt, end_dt) -> dict:
        stmt = select(SessionFaqLog.query).where(
            SessionFaqLog.timestamp >= start_dt, SessionFaqLog.timestamp <= end_dt
        )
        result = await db.execute(stmt)
        queries = [q.lower() for (q,) in result.all() if q]

        counts = {}
        for fee_term, patterns in FEE_TERM_PATTERNS.items():
            counts[fee_term] = sum(
                1 for q in queries if any(p in q for p in patterns)
            )
        return counts
