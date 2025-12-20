"""
QR Scan Event model - records each QR code scan.
"""

from sqlalchemy import String, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

from app.database import Base

if TYPE_CHECKING:
    from app.models.qr_location import QRLocation


class QRScanEvent(Base):
    """
    QR Scan Event - records each time a QR code is scanned.
    
    This is LAYER 8 DATA - powers geographic analytics:
    - Where are people scanning?
    - Which locations have most activity?
    - What's the conversion rate (scan to intake)?
    """
    __tablename__ = "qr_scan_events"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    qr_location_id: Mapped[str] = mapped_column(ForeignKey("qr_locations.id"), nullable=False, index=True)
    scanned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    device_type: Mapped[Optional[str]] = mapped_column(String(50))  # iOS, Android, Desktop
    user_agent: Mapped[Optional[str]] = mapped_column(String(500))
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))  # IPv4/IPv6 compatible
    resulted_in_intake: Mapped[bool] = mapped_column(Boolean, default=False)
    client_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    qr_location: Mapped["QRLocation"] = relationship("QRLocation", back_populates="scan_events")
