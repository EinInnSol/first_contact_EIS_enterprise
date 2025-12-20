"""
Authentication endpoints - login, register, token management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional
import uuid

from app.database import get_db, set_tenant_context
from app.models.user import User
from app.models.organization import Organization
from app.config import settings


router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    organization_slug: str  # Required to identify tenant


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    organization_id: int
    role: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    organization_slug: str
    role: str = "caseworker"
    vendor_id: Optional[int] = None


def create_access_token(user: User) -> str:
    """Create JWT access token with user info and organization context."""
    expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    
    payload = {
        "sub": str(user.id),
        "org_id": user.organization_id,
        "vendor_id": user.vendor_id,
        "role": user.role,
        "exp": expire,
    }
    
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Login with email, password, and organization slug.
    Returns JWT token with organization context.
    """
    # Find organization
    org_result = await db.execute(
        select(Organization).where(Organization.slug == request.organization_slug)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid organization"
        )
    
    # Set tenant context for RLS
    await set_tenant_context(db, organization.id)
    
    # Find user
    user_result = await db.execute(
        select(User).where(
            User.email == request.email,
            User.organization_id == organization.id
        )
    )
    user = user_result.scalar_one_or_none()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Generate token
    token = create_access_token(user)
    
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        organization_id=user.organization_id,
        role=user.role
    )


@router.post("/register", response_model=TokenResponse)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user.
    For demo purposes - in production, this would require admin approval.
    """
    # Find organization
    org_result = await db.execute(
        select(Organization).where(Organization.slug == request.organization_slug)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid organization"
        )
    
    # Set tenant context
    await set_tenant_context(db, organization.id)
    
    # Check if email already exists
    existing = await db.execute(
        select(User).where(
            User.email == request.email,
            User.organization_id == organization.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = User(
        organization_id=organization.id,
        vendor_id=request.vendor_id,
        email=request.email,
        password_hash=get_password_hash(request.password),
        first_name=request.first_name,
        last_name=request.last_name,
        role=request.role,
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Generate token
    token = create_access_token(user)
    
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        organization_id=user.organization_id,
        role=user.role
    )
