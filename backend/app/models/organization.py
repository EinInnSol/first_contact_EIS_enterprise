"""
Organization model - the tenant.
"""

from sqlalchemy import String, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, List, Any, TYPE_CHECKING

from app.database import Base

if TYPE_CHECKING:
    from app.models.vendor import Vendor
    from app.models.user import User


class Organization(Base):
    """
    Organization (tenant) model.
    
    This is the TOP LEVEL entity. All other entities belong to an organization.
    Cities are organizations. Each city is a separate tenant.
    """
    __tablename__ = "organizations"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(String(2))
    settings: Mapped[Optional[Any]] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vendors: Mapped[List["Vendor"]] = relationship("Vendor", back_populates="organization")
    users: Mapped[List["User"]] = relationship("User", back_populates="organization")
