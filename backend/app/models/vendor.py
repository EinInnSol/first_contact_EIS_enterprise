"""
Vendor model - service providers within an organization.
"""

from sqlalchemy import String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING

from app.database import Base

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.user import User
    from app.models.qr_location import QRLocation
    from app.models.client import Client


class Vendor(Base):
    """
    Vendor model - service providers like PATH, MHALA, etc.
    
    Vendors belong to an organization and have:
    - Multiple caseworkers (users)
    - Multiple QR locations (territories)
    - Multiple clients assigned
    """
    __tablename__ = "vendors"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(50), nullable=False)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255))
    contact_phone: Mapped[Optional[str]] = mapped_column(String(20))
    address: Mapped[Optional[str]] = mapped_column(String(500))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="vendors")
    users: Mapped[List["User"]] = relationship("User", back_populates="vendor")
    qr_locations: Mapped[List["QRLocation"]] = relationship("QRLocation", back_populates="vendor")
    clients: Mapped[List["Client"]] = relationship("Client", back_populates="assigned_vendor")
