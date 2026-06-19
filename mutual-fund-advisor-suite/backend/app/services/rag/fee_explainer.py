from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.faq_models import FeeExplainer
from app.models.faq_schemas import FeeExplainerContent

class FeeExplainerService:
    async def get_current_explainer(self, db) -> FeeExplainerContent:
        stmt = select(FeeExplainer).order_by(FeeExplainer.version.desc())
        
        if isinstance(db, AsyncSession):
            res = await db.execute(stmt)
            explainer = res.scalars().first()
        else:
            explainer = db.execute(stmt).scalars().first()
        
        if not explainer:
            # Seed with default "What is TER?" explainer
            explainer = FeeExplainer(
                version=1,
                fee_term="What is TER?",
                bullets_json=[
                    "TER stands for Total Expense Ratio.",
                    "It is the measure of the total costs associated with managing and operating an investment fund.",
                    "These costs consist primarily of management fees and additional expenses.",
                    "The TER is calculated by dividing the total cost of the fund by the fund's total assets.",
                    "A lower TER means more of the fund's returns are kept by the investor.",
                    "SEBI has mandated strict limits on the maximum TER that mutual funds can charge."
                ],
                source_links_json=[
                    "https://www.amfiindia.com/investor-education/fees",
                    "https://www.sebi.gov.in/legal/circulars/oct-2018/ter"
                ]
            )
            db.add(explainer)
            if isinstance(db, AsyncSession):
                await db.commit()
                await db.refresh(explainer)
            else:
                db.commit()
                db.refresh(explainer)
            
        return FeeExplainerContent(
            version=explainer.version,
            fee_term=explainer.fee_term,
            bullets=explainer.bullets_json,
            source_links=explainer.source_links_json,
            updated_at=explainer.updated_at.isoformat() if explainer.updated_at else ""
        )
