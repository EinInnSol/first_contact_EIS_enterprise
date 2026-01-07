"""
Client model - homeless individuals receiving services.
"""

from sqlalchemy import String, Boolean, Integer, Date, Numeric, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
import uuid

from app.database import Base

if TYPE_CHECKING:
    from app.models.vendor import Vendor
    from app.models.qr_location import QRLocation
    from app.models.user import User


class Client(Base):
    """
    Client model - homeless individuals receiving services.
    
    Key fields for Layer 8 analytics:
    - intake_date, housed_date, exit_date (time to housing)
    - exit_type (positive vs negative outcomes)
    - exit_income_monthly (benefit stack success)
    - assigned_vendor_id (vendor performance comparison)
    """
    __tablename__ = "clients"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    assigned_vendor_id: Mapped[int] = mapped_column(ForeignKey("vendors.id"), nullable=False, index=True)
    assigned_caseworker_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    intake_qr_location_id: Mapped[Optional[str]] = mapped_column(ForeignKey("qr_locations.id"))
    
    # Basic Info
    case_number: Mapped[Optional[str]] = mapped_column(String(20), unique=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    middle_name: Mapped[Optional[str]] = mapped_column(String(50))
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date)
    ssn_encrypted: Mapped[Optional[str]] = mapped_column(String(255))
    
    # Contact
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(255))
    preferred_contact: Mapped[str] = mapped_column(String(20), default="phone")
    
    # VI-SPDAT Assessment
    vi_spdat_score: Mapped[Optional[int]] = mapped_column(Integer)
    vi_spdat_date: Mapped[Optional[date]] = mapped_column(Date)
    acuity_level: Mapped[Optional[str]] = mapped_column(String(20))  # low, moderate, high, severe
    
    # Status
    status: Mapped[str] = mapped_column(String(30), default="intake")
    housing_type: Mapped[Optional[str]] = mapped_column(String(50))
    notes: Mapped[Optional[str]] = mapped_column(String(500))
    
    # Outcomes (for Layer 8)
    intake_date: Mapped[Optional[date]] = mapped_column(Date, default=date.today)
    housed_date: Mapped[Optional[date]] = mapped_column(Date)
    exit_date: Mapped[Optional[date]] = mapped_column(Date)
    exit_type: Mapped[Optional[str]] = mapped_column(String(50))
    exit_income_monthly: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2))
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assigned_vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="clients")
    intake_qr_location: Mapped[Optional["QRLocation"]] = relationship("QRLocation", back_populates="clients")
