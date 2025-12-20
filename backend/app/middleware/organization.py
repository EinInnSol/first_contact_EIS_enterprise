"""
Organization Context Middleware
Sets PostgreSQL Row-Level Security context for multi-tenant isolation.

CRITICAL: This middleware MUST run for every authenticated request.
It sets the app.organization_id PostgreSQL variable that RLS policies use.
"""

from fastapi import Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional


async def set_tenant_context(db: AsyncSession, organization_id: int) -> None:
    """
    Set PostgreSQL RLS context for current session.
    
    This MUST be called for every database session to enforce multi-tenant isolation.
    Without this, RLS policies cannot filter data by organization.
    
    Args:
        db: AsyncSession - The database session
        organization_id: int - The organization ID to set as context
    """
    await db.execute(
        text(f"SET app.organization_id = '{organization_id}'")
    )


class OrganizationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to extract organization context from JWT and make it available.
    
    The actual RLS context is set in the database dependency (deps.py),
    but this middleware extracts the org_id from the JWT for use throughout
    the request lifecycle.
    """
    
    async def dispatch(self, request: Request, call_next):
        # Organization ID will be set by the auth dependency
        # This middleware just ensures the request state is initialized
        request.state.organization_id = None
        request.state.user_id = None
        request.state.user_role = None
        
        response = await call_next(request)
        return response


def get_organization_id_from_request(request: Request) -> Optional[int]:
    """
    Helper to get organization ID from request state.
    
    Returns:
        int or None: The organization ID if set, None otherwise
    """
    return getattr(request.state, 'organization_id', None)
