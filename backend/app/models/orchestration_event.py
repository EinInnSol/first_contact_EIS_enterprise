"""
Orchestration Event model - central log for all system triggers requiring coordination.
"""

from sqlalchemy import String, Boolean, ForeignKey, DateTime, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, Any, Dict
import uuid

from app.database import Base
from app.models.base import TenantMixin, TimestampMixin


class OrchestrationEvent(Base, TenantMixin, TimestampMixin):
    """
    Orchestration Event - The fuel for the AI "Brain".
    
    Represents any occurrence in the system that might require a response:
    - appointment_cancelled
    - appointment_no_show
    - benefit_approved
    - housing_secured
    - qr_scan
    - intake_completed
    - document_uploaded
    """
    __tablename__ = "orchestration_events"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Event definition
    event_type: Mapped[str] = mapped_column(String(100), index=True) # e.g. appointment_cancelled
    priority: Mapped[int] = mapped_column(Integer, default=1) # 1-5, higher is more urgent
    
    # Context
    client_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), index=True, nullable=True)
    vendor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("vendors.id"), nullable=True, index=True)
    
    # Raw data for the AI/Rules engine to digest
    payload: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Processing state
    processed: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    orchestration_triggered: Mapped[bool] = mapped_column(Boolean, default=False)
    recommendation_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    
    # Metadata
    source: Mapped[str] = mapped_column(String(50), default="system") # system, user, external_api
    
    def __repr__(self):
        return f"<OrchestrationEvent {self.event_type} - {self.id}>"
