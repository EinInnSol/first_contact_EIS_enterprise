"""
User model - all user types (client, caseworker, vendor_admin, city_admin).
"""

from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid
import enum

from app.database import Base

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.vendor import Vendor


class UserRole(str, enum.Enum):
    """User roles for access control."""
    CLIENT = "client"
    CASEWORKER = "caseworker"
    VENDOR_ADMIN = "vendor_admin"
    CITY_ADMIN = "city_admin"
    CITY_COUNCIL = "city_council"


class User(Base):
    """
    User model for all user types.
    
    Roles:
    - client: Homeless individual (limited access)
    - caseworker: Works for vendor (Layers 1-7)
    - vendor_admin: Manages vendor org (Layers 1-7)
    - city_admin: City administrator (ALL + Layer 8)
    - city_council: Elected official (ALL + Layer 8)
    """
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False, index=True)
    vendor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("vendors.id"), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(String(50))
    last_name: Mapped[Optional[str]] = mapped_column(String(50))
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="users")
    vendor: Mapped[Optional["Vendor"]] = relationship("Vendor", back_populates="users")
    
    @property
    def is_city_level(self) -> bool:
        """Check if user has city-level (Layer 8) access."""
        return self.role in [UserRole.CITY_ADMIN.value, UserRole.CITY_COUNCIL.value]
    
    @property
    def is_vendor_level(self) -> bool:
        """Check if user is vendor level (NO Layer 8 access)."""
        return self.role in [UserRole.CASEWORKER.value, UserRole.VENDOR_ADMIN.value]
