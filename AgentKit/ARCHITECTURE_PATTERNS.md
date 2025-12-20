# ARCHITECTURE PATTERNS - FIRST CONTACT E.I.S.
## Copy-Paste Ready Implementations

---

## 1. DATABASE CONNECTION WITH RLS

```python
# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import text
from app.config import settings

# Async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    """Dependency for routes - provides db session"""
    async with AsyncSessionLocal() as session:
        yield session

async def set_tenant_context(session: AsyncSession, organization_id: int):
    """
    CRITICAL: Set RLS context for session.
    Must be called before any query.
    """
    await session.execute(
        text(f"SET app.organization_id = '{organization_id}'")
    )
```

---

## 2. TENANT MIXIN FOR MODELS

```python
# app/models/base.py
from sqlalchemy import Column, Integer, DateTime, func
from sqlalchemy.ext.declarative import declared_attr

class TenantMixin:
    """
    EVERY table must inherit this.
    Provides organization_id for multi-tenancy.
    """
    
    @declared_attr
    def organization_id(cls):
        return Column(
            Integer,
            nullable=False,
            index=True,
            comment="Multi-tenant isolation"
        )
    
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
```

---

## 3. EXAMPLE MODEL

```python
# app/models/client.py
from sqlalchemy import Column, String, Date, Integer, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.database import Base
from app.models.base import TenantMixin

class ClientStatus(str, enum.Enum):
    INTAKE = "intake"
    ASSESSMENT = "assessment"
    ENROLLED = "enrolled"
    HOUSED = "housed"
    STABILIZING = "stabilizing"
    EXITED_POSITIVE = "exited_positive"
    EXITED_NEGATIVE = "exited_negative"
    DISENGAGED = "disengaged"

class Client(Base, TenantMixin):
    __tablename__ = "clients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Foreign keys
    assigned_vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    assigned_caseworker_id = Column(UUID, ForeignKey("users.id"))
    intake_qr_location_id = Column(String(50), ForeignKey("qr_locations.id"))
    
    # Fields
    case_number = Column(String(20), unique=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    date_of_birth = Column(Date)
    phone = Column(String(20))
    email = Column(String(255))
    
    # Assessment
    vi_spdat_score = Column(Integer)
    acuity_level = Column(String(20))
    
    # Status
    status = Column(
        Enum(ClientStatus),
        default=ClientStatus.INTAKE
    )
    
    # Relationships
    vendor = relationship("Vendor", back_populates="clients")
    caseworker = relationship("User", back_populates="assigned_clients")
```

---

## 4. AUTHENTICATION DEPENDENCIES

```python
# app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db, set_tenant_context
from app.models.user import User
from app.config import settings

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Validate JWT, set RLS context, return user.
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        
        user_id = payload.get("sub")
        org_id = payload.get("org_id")
        
        if not user_id or not org_id:
            raise HTTPException(401, "Invalid token")
        
        # SET RLS CONTEXT - CRITICAL!
        await set_tenant_context(db, org_id)
        
        # Get user
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user or not user.active:
            raise HTTPException(401, "User not found or inactive")
        
        return user
        
    except JWTError:
        raise HTTPException(401, "Invalid token")


def require_role(*allowed_roles: str):
    """
    Factory for role-based access control.
    
    Usage:
        @router.get("/", dependencies=[Depends(require_role("city_admin"))])
    """
    async def check_role(user: User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )
        return user
    return check_role


# Pre-built role dependencies
require_city_admin = require_role("city_admin", "city_council")
require_vendor_access = require_role("caseworker", "vendor_admin", "city_admin", "city_council")
require_caseworker = require_role("caseworker", "vendor_admin", "city_admin")
```

---

## 5. LAYER 8 ENDPOINT PATTERN

```python
# app/api/v1/analytics.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.api.deps import require_city_admin, get_db
from app.models.user import User
from app.models.vendor_performance import VendorPerformanceMetrics
from app.schemas.analytics import VendorPerformanceResponse

router = APIRouter(prefix="/analytics", tags=["Layer 8 Analytics"])


@router.get("/vendors", response_model=list[VendorPerformanceResponse])
async def get_vendor_performance(
    user: User = Depends(require_city_admin),  # <-- BLOCKS VENDORS
    db: AsyncSession = Depends(get_db)
):
    """
    LAYER 8 ENDPOINT - City administrators only.
    
    Caseworkers and vendor admins receive 403 Forbidden.
    They don't know this endpoint exists.
    """
    result = await db.execute(
        select(VendorPerformanceMetrics)
        .where(VendorPerformanceMetrics.organization_id == user.organization_id)
        .order_by(VendorPerformanceMetrics.period_end.desc())
    )
    return result.scalars().all()


@router.get("/geographic")
async def get_geographic_analytics(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    QR scan heat map data - City only.
    Shows where homeless populations concentrate.
    """
    # Aggregate QR scan data by location
    result = await db.execute(
        select(
            QRLocation.id,
            QRLocation.name,
            QRLocation.latitude,
            QRLocation.longitude,
            func.count(QRScanEvent.id).label("scan_count")
        )
        .join(QRScanEvent)
        .where(QRLocation.organization_id == user.organization_id)
        .group_by(QRLocation.id)
    )
    return result.all()
```

---

## 6. QR INTAKE (PUBLIC ENDPOINT)

```python
# app/api/v1/intake.py
from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.intake import IntakeRequest, IntakeResponse
from app.models.client import Client
from app.models.qr_location import QRLocation
from app.models.qr_scan_event import QRScanEvent
from app.services.case_number import generate_case_number

router = APIRouter(prefix="/intake", tags=["Public Intake"])


@router.post("/qr/{qr_location_id}", response_model=IntakeResponse)
async def qr_intake(
    qr_location_id: str,
    intake: IntakeRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    PUBLIC ENDPOINT - No auth required.
    
    Client scans QR code, submits intake form.
    Auto-assigns to vendor based on QR location.
    """
    # Get QR location (includes vendor assignment)
    result = await db.execute(
        select(QRLocation).where(QRLocation.id == qr_location_id)
    )
    qr_location = result.scalar_one_or_none()
    
    if not qr_location or not qr_location.active:
        raise HTTPException(404, "Invalid QR code")
    
    # Set tenant context for this org
    await set_tenant_context(db, qr_location.organization_id)
    
    # Record scan event (Layer 8 data!)
    scan_event = QRScanEvent(
        organization_id=qr_location.organization_id,
        qr_location_id=qr_location_id,
        resulted_in_intake=True
    )
    db.add(scan_event)
    
    # Create client, auto-assign to vendor
    client = Client(
        organization_id=qr_location.organization_id,
        assigned_vendor_id=qr_location.vendor_id,
        intake_qr_location_id=qr_location_id,
        case_number=await generate_case_number(db, qr_location.organization_id),
        first_name=intake.first_name,
        last_name=intake.last_name,
        date_of_birth=intake.date_of_birth,
        phone=intake.phone,
        vi_spdat_score=calculate_vi_spdat(intake.vi_spdat_responses)
    )
    db.add(client)
    
    await db.commit()
    await db.refresh(client)
    
    # Get vendor name for response
    vendor = await db.get(Vendor, qr_location.vendor_id)
    
    return IntakeResponse(
        success=True,
        case_number=client.case_number,
        assigned_vendor=vendor.name,
        message=f"Your caseworker will contact you within 24 hours."
    )
```

---

## 7. BENEFIT STACK CALCULATION

```python
# app/services/benefit_stack.py
from typing import Dict, List
from decimal import Decimal

# Benefit rules (simplified - full version in database)
BENEFIT_RULES = {
    "ssi": {
        "amount": Decimal("1183.00"),
        "requires": ["disability_documentation"],
        "excludes": ["ssdi_over_limit"]
    },
    "gr": {
        "amount": Decimal("221.00"),
        "requires": ["no_ssi", "no_ssdi"],
        "modified_by": {
            "gr_housing_subsidy": {"reduces_by": Decimal("100.00")}
        }
    },
    "gr_housing_subsidy": {
        "amount": Decimal("575.00"),
        "requires": ["gr_recipient", "housed"]
    },
    "calfresh": {
        "amount": Decimal("234.00"),
        "requires": ["low_income"]
    },
    "ihss": {
        "amount": Decimal("1200.00"),  # Average
        "requires": ["ssi_or_medi_cal", "needs_assistance"],
        "note": "Family member can be paid as caregiver"
    }
}


async def calculate_benefit_stack(
    client_data: Dict,
    current_benefits: List[str]
) -> Dict:
    """
    Calculate optimal benefit stack for client.
    
    Returns:
        - current_income: What they have now
        - projected_income: What they could have
        - recommended_programs: What to apply for
        - timeline: Application sequence
    """
    current_income = Decimal("0")
    projected_income = Decimal("0")
    recommendations = []
    
    # Calculate current
    for benefit_code in current_benefits:
        if benefit_code in BENEFIT_RULES:
            amount = BENEFIT_RULES[benefit_code]["amount"]
            
            # Check for modifications
            for modifier, effect in BENEFIT_RULES[benefit_code].get("modified_by", {}).items():
                if modifier in current_benefits:
                    amount -= effect.get("reduces_by", Decimal("0"))
            
            current_income += amount
    
    # Calculate projected (all eligible)
    for code, rules in BENEFIT_RULES.items():
        if code in current_benefits:
            continue
            
        if _check_eligibility(client_data, rules.get("requires", [])):
            if not _check_exclusions(client_data, current_benefits, rules.get("excludes", [])):
                recommendations.append({
                    "program": code,
                    "amount": rules["amount"],
                    "requirements": rules.get("requires", [])
                })
                projected_income += rules["amount"]
    
    # Apply modifications to projection
    if "gr" in [r["program"] for r in recommendations]:
        if "gr_housing_subsidy" in [r["program"] for r in recommendations]:
            projected_income -= Decimal("100.00")  # GR reduces when subsidy active
    
    return {
        "current_monthly_income": float(current_income),
        "projected_monthly_income": float(current_income + projected_income),
        "increase_potential": float(projected_income),
        "recommendations": recommendations,
        "timeline": _generate_application_timeline(recommendations)
    }


def _check_eligibility(client_data: Dict, requirements: List[str]) -> bool:
    """Check if client meets requirements"""
    for req in requirements:
        if req == "disability_documentation":
            if not client_data.get("has_disability_docs"):
                return False
        elif req == "low_income":
            if client_data.get("monthly_income", 0) > 1500:
                return False
        elif req == "housed":
            if not client_data.get("is_housed"):
                return False
    return True
```

---

## 8. PYDANTIC SCHEMAS

```python
# app/schemas/client.py
from pydantic import BaseModel, EmailStr, Field
from datetime import date
from uuid import UUID
from typing import Optional
from enum import Enum

class ClientStatus(str, Enum):
    intake = "intake"
    assessment = "assessment"
    enrolled = "enrolled"
    housed = "housed"
    stabilizing = "stabilizing"
    exited_positive = "exited_positive"
    exited_negative = "exited_negative"
    disengaged = "disengaged"


class ClientBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    date_of_birth: Optional[date] = None
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None


class ClientCreate(ClientBase):
    """Used for creating new clients"""
    vi_spdat_responses: Optional[dict] = None


class ClientUpdate(BaseModel):
    """Used for partial updates"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    status: Optional[ClientStatus] = None


class ClientResponse(ClientBase):
    """Returned from API"""
    id: UUID
    case_number: str
    organization_id: int
    assigned_vendor_id: int
    status: ClientStatus
    vi_spdat_score: Optional[int] = None
    acuity_level: Optional[str] = None
    
    class Config:
        from_attributes = True


class ClientListResponse(BaseModel):
    """Paginated list response"""
    items: list[ClientResponse]
    total: int
    page: int
    per_page: int
```

---

## 9. MAIN APPLICATION

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.v1 import intake, auth, clients, case_plans, benefits, analytics
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting First Contact E.I.S...")
    yield
    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title="First Contact E.I.S.",
    description="Multi-tenant AI orchestration for homeless services",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(intake.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(clients.router, prefix="/api/v1")
app.include_router(case_plans.router, prefix="/api/v1")
app.include_router(benefits.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")  # Layer 8


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
```
