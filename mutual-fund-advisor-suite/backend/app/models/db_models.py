from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class NavData(Base):
    __tablename__ = "nav_data"

    scheme_id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String, index=True)
    nav_value = Column(Float)
    nav_date = Column(String)
    fetched_at = Column(DateTime, default=datetime.utcnow)
