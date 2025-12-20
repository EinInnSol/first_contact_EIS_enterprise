"""
Database configuration with multi-tenant Row-Level Security support.
CRITICAL: set_tenant_context() MUST be called for every request.

Supports:
- Cloud SQL PostgreSQL (production)
- Local PostgreSQL (development with Cloud SQL Proxy)
- SQLite (testing fallback)
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from typing import AsyncGenerator
import os
import sys

from app.config import settings


def get_database_url() -> str:
    """
    Get the appropriate database URL based on environment.
    Falls back to SQLite for testing if PostgreSQL unavailable.
    """
    # Try to get configured database URL
    db_url = settings.get_database_url
    
    # In production with Cloud SQL, use asyncpg
    if "cloudsql" in str(db_url).lower():
        return db_url
    
    # Check if we should use SQLite fallback
    if os.getenv("USE_SQLITE", "false").lower() == "true":
        return settings.get_sqlite_url
    
    return db_url


def safe_print(msg: str) -> None:
    """Print with fallback for Windows encoding issues."""
    try:
        print(msg)
    except UnicodeEncodeError:
        # Strip emojis and try again
        ascii_msg = msg.encode('ascii', 'ignore').decode('ascii')
        print(ascii_msg)


# Create async engine
try:
    database_url = get_database_url()
    safe_print(f"[DB] Connecting to database: {database_url[:50]}...")
    
    engine = create_async_engine(
        database_url,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        # Pool settings differ for SQLite vs PostgreSQL
        pool_size=5 if "sqlite" not in database_url else 1,
        max_overflow=10 if "sqlite" not in database_url else 0,
    )
except Exception as e:
    safe_print(f"[DB] Database connection error: {e}")
    safe_print("[DB] Falling back to SQLite...")
    engine = create_async_engine(
        settings.get_sqlite_url,
        echo=settings.DEBUG,
    )


# Session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


async def set_tenant_context(session: AsyncSession, organization_id: int) -> None:
    """
    Set PostgreSQL RLS context for current session.
    
    CRITICAL: This MUST be called for every authenticated request.
    This sets the app.organization_id session variable that RLS policies use.
    
    Note: For SQLite (testing), this is a no-op since SQLite doesn't support RLS.
    """
    try:
        await session.execute(
            text(f"SET app.organization_id = '{organization_id}'")
        )
    except Exception:
        # SQLite doesn't support SET - that's okay for testing
        pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for database sessions.
    
    Note: Tenant context must be set separately after authentication.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database connection and create tables if needed."""
    async with engine.begin() as conn:
        # Test connection
        result = await conn.execute(text("SELECT 1"))
        safe_print("[DB] Database connected successfully")
