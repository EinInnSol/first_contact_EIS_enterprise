"""
QR Location model - physical locations with QR codes.
"""

from sqlalchemy import String, Boolean, Integer, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, TYPE_CHECKING

from app.database import Base

if TYPE_CHECKING:
    from app.models.vendor import Vendor
    from app.models.qr_scan_event import QRScanEvent
    from app.models.client import Client


class QRLocation(Base):
    """
    QR Location - a physical location where a QR code is placed.
    
    This is the CORE INNOVATION:
    - Each location is assigned to a vendor
    - When scanned, clients are auto-assigned to that vendor
    - Scan data powers Layer 8 geographic analytics
    """
    __tablename__ = "qr_locations"
    
    id: Mapped[str] = mapped_column(String(50), primary_key=True)  # e.g., "lb-mlk-park"
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    vendor_id: Mapped[int] = mapped_column(ForeignKey("vendors.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(String(500))
    latitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 8))
    longitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(11, 8))
    location_type: Mapped[Optional[str]] = mapped_column(String(50))  # park, library, shelter
    qr_code_url: Mapped[Optional[str]] = mapped_column(String(500))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    scan_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="qr_locations")
    scan_events: Mapped[List["QRScanEvent"]] = relationship("QRScanEvent", back_populates="qr_location")
    clients: Mapped[List["Client"]] = relationship("Client", back_populates="intake_qr_location")
