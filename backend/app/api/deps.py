"""
API Dependencies - Authentication, Authorization, and Tenant Context.

CRITICAL: require_city_admin blocks vendors from Layer 8.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import Optional
import uuid

from app.database import get_db, set_tenant_context
from app.models.user import User, UserRole
from app.config import settings


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Validate JWT, set RLS context, return user.
    
    JWT payload:
    {
        "sub": "user_uuid",
        "org_id": 1,
        "vendor_id": 101,
        "role": "caseworker",
        "exp": 1234567890
    }
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        
        user_id: str = payload.get("sub")
        org_id: int = payload.get("org_id")
        
        if not user_id or not org_id:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # SET RLS CONTEXT - CRITICAL!
    await set_tenant_context(db, org_id)
    
    # Get user from database
    result = await db.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    user = result.scalar_one_or_none()
    
    if user is None or not user.active:
        raise credentials_exception
    
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated, None otherwise."""
    if credentials is None:
        return None
    
    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None


def require_role(*allowed_roles: str):
    """
    Dependency factory for role-based access control.
    
    Usage:
    @router.get("/endpoint", dependencies=[Depends(require_role("city_admin"))])
    """
    async def check_role(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {allowed_roles}"
            )
        return user
    return check_role


# Convenience dependencies
require_city_admin = require_role(UserRole.CITY_ADMIN.value, UserRole.CITY_COUNCIL.value)
require_vendor_access = require_role(
    UserRole.CASEWORKER.value,
    UserRole.VENDOR_ADMIN.value,
    UserRole.CITY_ADMIN.value,
    UserRole.CITY_COUNCIL.value
)
