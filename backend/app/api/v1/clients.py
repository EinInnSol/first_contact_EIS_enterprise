"""
Clients API - LAYERS 1-7 (Vendor Access)

CRUD operations for client management.
Caseworkers see only their assigned clients.
Vendor admins see all clients in their vendor.
City admins see all clients in the organization.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from decimal import Decimal
import uuid

from app.database import get_db
from app.api.deps import get_current_user, require_vendor_access
from app.models.user import User, UserRole
from app.models.client import Client
from app.models.vendor import Vendor


router = APIRouter(prefix="/clients", tags=["Clients (Layers 1-7)"])


# ============================================
# SCHEMAS
# ============================================

class ClientBase(BaseModel):
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    preferred_contact: str = "phone"


class ClientCreate(ClientBase):
    assigned_vendor_id: int
    vi_spdat_score: Optional[int] = None
    acuity_level: Optional[str] = None


class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    status: Optional[str] = None
    vi_spdat_score: Optional[int] = None
    acuity_level: Optional[str] = None
    housing_type: Optional[str] = None
    assigned_caseworker_id: Optional[str] = None


class ClientResponse(ClientBase):
    id: str
    case_number: Optional[str]
    organization_id: int
    assigned_vendor_id: int
    assigned_caseworker_id: Optional[str]
    status: str
    vi_spdat_score: Optional[int]
    acuity_level: Optional[str]
    housing_type: Optional[str]
    intake_date: Optional[date]
    housed_date: Optional[date]
    
    class Config:
        from_attributes = True


class ClientListResponse(BaseModel):
    clients: List[ClientResponse]
    total: int
    page: int
    page_size: int


# ============================================
# ENDPOINTS
# ============================================

@router.get("", response_model=ClientListResponse)
async def list_clients(
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db),
    status: Optional[str] = Query(None, description="Filter by status"),
    vendor_id: Optional[int] = Query(None, description="Filter by vendor (city admin only)"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """
    List clients based on user role:
    - Caseworker: Only assigned clients
    - Vendor Admin: All clients in their vendor
    - City Admin: All clients in organization
    """
    query = select(Client)
    
    # Role-based filtering
    if user.role == UserRole.CASEWORKER.value:
        # Caseworkers only see their assigned clients
        query = query.where(Client.assigned_caseworker_id == user.id)
    elif user.role == UserRole.VENDOR_ADMIN.value:
        # Vendor admins see all clients in their vendor
        query = query.where(Client.assigned_vendor_id == user.vendor_id)
    elif user.role in [UserRole.CITY_ADMIN.value, UserRole.CITY_COUNCIL.value]:
        # City admins can optionally filter by vendor
        if vendor_id:
            query = query.where(Client.assigned_vendor_id == vendor_id)
    
    # Status filter
    if status:
        query = query.where(Client.status == status)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Client.created_at.desc())
    
    result = await db.execute(query)
    clients = result.scalars().all()
    
    return ClientListResponse(
        clients=[ClientResponse(
            id=str(c.id),
            case_number=c.case_number,
            first_name=c.first_name,
            last_name=c.last_name,
            middle_name=c.middle_name,
            date_of_birth=c.date_of_birth,
            phone=c.phone,
            email=c.email,
            preferred_contact=c.preferred_contact,
            organization_id=c.organization_id,
            assigned_vendor_id=c.assigned_vendor_id,
            assigned_caseworker_id=str(c.assigned_caseworker_id) if c.assigned_caseworker_id else None,
            status=c.status,
            vi_spdat_score=c.vi_spdat_score,
            acuity_level=c.acuity_level,
            housing_type=c.housing_type,
            intake_date=c.intake_date,
            housed_date=c.housed_date,
        ) for c in clients],
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: str,
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific client by ID."""
    result = await db.execute(
        select(Client).where(Client.id == uuid.UUID(client_id))
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Check access based on role
    if user.role == UserRole.CASEWORKER.value:
        if client.assigned_caseworker_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this client"
            )
    elif user.role == UserRole.VENDOR_ADMIN.value:
        if client.assigned_vendor_id != user.vendor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this client"
            )
    
    return ClientResponse(
        id=str(client.id),
        case_number=client.case_number,
        first_name=client.first_name,
        last_name=client.last_name,
        middle_name=client.middle_name,
        date_of_birth=client.date_of_birth,
        phone=client.phone,
        email=client.email,
        preferred_contact=client.preferred_contact,
        organization_id=client.organization_id,
        assigned_vendor_id=client.assigned_vendor_id,
        assigned_caseworker_id=str(client.assigned_caseworker_id) if client.assigned_caseworker_id else None,
        status=client.status,
        vi_spdat_score=client.vi_spdat_score,
        acuity_level=client.acuity_level,
        housing_type=client.housing_type,
        intake_date=client.intake_date,
        housed_date=client.housed_date,
    )


@router.patch("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: str,
    updates: ClientUpdate,
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db)
):
    """Update a client record."""
    result = await db.execute(
        select(Client).where(Client.id == uuid.UUID(client_id))
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Check access
    if user.role == UserRole.CASEWORKER.value:
        if client.assigned_caseworker_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this client"
            )
    elif user.role == UserRole.VENDOR_ADMIN.value:
        if client.assigned_vendor_id != user.vendor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this client"
            )
    
    # Apply updates
    update_data = updates.model_dump(exclude_unset=True)
    
    # Handle caseworker assignment
    if "assigned_caseworker_id" in update_data:
        if update_data["assigned_caseworker_id"]:
            update_data["assigned_caseworker_id"] = uuid.UUID(update_data["assigned_caseworker_id"])
    
    for field, value in update_data.items():
        setattr(client, field, value)
    
    # Track status changes for Layer 8
    if updates.status == "housed" and not client.housed_date:
        client.housed_date = date.today()
    
    await db.commit()
    await db.refresh(client)
    
    return ClientResponse(
        id=str(client.id),
        case_number=client.case_number,
        first_name=client.first_name,
        last_name=client.last_name,
        middle_name=client.middle_name,
        date_of_birth=client.date_of_birth,
        phone=client.phone,
        email=client.email,
        preferred_contact=client.preferred_contact,
        organization_id=client.organization_id,
        assigned_vendor_id=client.assigned_vendor_id,
        assigned_caseworker_id=str(client.assigned_caseworker_id) if client.assigned_caseworker_id else None,
        status=client.status,
        vi_spdat_score=client.vi_spdat_score,
        acuity_level=client.acuity_level,
        housing_type=client.housing_type,
        intake_date=client.intake_date,
        housed_date=client.housed_date,
    )


@router.get("/{client_id}/timeline")
async def get_client_timeline(
    client_id: str,
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db)
):
    """
    Get client's journey timeline.
    Shows intake, assessments, appointments, status changes.
    """
    result = await db.execute(
        select(Client).where(Client.id == uuid.UUID(client_id))
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Build timeline from available data
    timeline = []
    
    if client.intake_date:
        timeline.append({
            "date": client.intake_date.isoformat(),
            "event": "intake",
            "description": "Client intake completed"
        })
    
    if client.vi_spdat_date:
        timeline.append({
            "date": client.vi_spdat_date.isoformat(),
            "event": "assessment",
            "description": f"VI-SPDAT assessment completed (Score: {client.vi_spdat_score})"
        })
    
    if client.housed_date:
        timeline.append({
            "date": client.housed_date.isoformat(),
            "event": "housed",
            "description": f"Client housed ({client.housing_type})"
        })
    
    if client.exit_date:
        timeline.append({
            "date": client.exit_date.isoformat(),
            "event": "exit",
            "description": f"Client exited program ({client.exit_type})"
        })
    
    # Sort by date
    timeline.sort(key=lambda x: x["date"])
    
    return {
        "client_id": str(client.id),
        "case_number": client.case_number,
        "current_status": client.status,
        "timeline": timeline
    }
