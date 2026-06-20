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

class MCPActionLog(Base):
    __tablename__ = "mcp_action_log"

    id = Column(Integer, primary_key=True, index=True)
    tool_name = Column(String, index=True)
    status = Column(String, index=True)
    inputs_json = Column(String)
    output_json = Column(String, nullable=True)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String, nullable=True)
    booking_id = Column(Integer, nullable=True)
    pulse_report_id = Column(Integer, nullable=True)
