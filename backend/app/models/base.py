"""
Base model with TenantMixin for multi-tenant support.
EVERY model MUST inherit TenantMixin (except organizations).
"""

from sqlalchemy import Column, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import declared_attr, Mapped, mapped_column
from datetime import datetime
from typing import Optional


class TenantMixin:
    """
    Mixin that adds organization_id for multi-tenant isolation.
    
    CRITICAL: Every table MUST have this for RLS to work.
    """
    
    @declared_attr
    def organization_id(cls) -> Mapped[int]:
        return mapped_column(
            Integer,
            ForeignKey("organizations.id"),
            nullable=False,
            index=True,
            comment="Multi-tenant isolation - references organizations.id"
        )


class TimestampMixin:
    """Mixin that adds created_at and updated_at timestamps."""
    
    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        return mapped_column(DateTime, default=func.now(), nullable=False)
    
    @declared_attr
    def updated_at(cls) -> Mapped[Optional[datetime]]:
        return mapped_column(DateTime, default=func.now(), onupdate=func.now())
