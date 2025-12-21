"""
QR Intake endpoint - PUBLIC (no auth required).

This is the CORE INNOVATION:
1. Client scans QR code
2. System looks up QR location
3. Client auto-assigned to vendor that owns that location
4. Scan event recorded for Layer 8 analytics
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
import uuid

from app.database import get_db, set_tenant_context
from app.models.qr_location import QRLocation
from app.models.qr_scan_event import QRScanEvent
from app.models.client import Client
from app.models.vendor import Vendor
from app.services.orchestration_engine import OrchestrationEngine


router = APIRouter(prefix="/intake", tags=["QR Intake (Public)"])


class IntakeRequest(BaseModel):
    """Client intake form submitted after QR scan."""
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    preferred_contact: str = "phone"


class IntakeResponse(BaseModel):
    """Response after successful intake."""
    success: bool
    case_number: str
    assigned_vendor: str
    message: str
    client_id: str


def generate_case_number(org_slug: str) -> str:
    """Generate unique case number like 'LB-1234'."""
    import random
    prefix = org_slug[:2].upper()
    number = random.randint(1000, 9999)
    return f"{prefix}-{number}"


@router.post("/qr/{qr_location_id}", response_model=IntakeResponse)
async def qr_intake(
    qr_location_id: str,
    intake: IntakeRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    PUBLIC ENDPOINT - No authentication required.
    
    Process:
    1. Look up QR location (determines vendor)
    2. Record scan event (Layer 8 analytics)
    3. Create client record (auto-assigned to vendor)
    4. Return confirmation with vendor name
    """
    # Find QR location (without RLS - need to look up org first)
    location_result = await db.execute(
        select(QRLocation).where(QRLocation.id == qr_location_id)
    )
    location = location_result.scalar_one_or_none()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"QR location '{qr_location_id}' not found"
        )
    
    if not location.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This QR code is no longer active"
        )
    
    # Now set tenant context for this organization
    await set_tenant_context(db, location.organization_id)
    
    # Get vendor name for response
    vendor_result = await db.execute(
        select(Vendor).where(Vendor.id == location.vendor_id)
    )
    vendor = vendor_result.scalar_one()
    
    # Find organization
    from app.models.organization import Organization
    org_result = await db.execute(
        select(Organization).where(Organization.id == location.organization_id)
    )
    organization = org_result.scalar_one()
    
    # Generate case number
    case_number = generate_case_number(organization.slug)
    
    # Create client - AUTO-ASSIGNED TO VENDOR FROM QR LOCATION
    client = Client(
        organization_id=location.organization_id,
        assigned_vendor_id=location.vendor_id,  # THIS IS THE MAGIC
        intake_qr_location_id=qr_location_id,
        case_number=case_number,
        first_name=intake.first_name,
        last_name=intake.last_name,
        middle_name=intake.middle_name,
        date_of_birth=intake.date_of_birth,
        phone=intake.phone,
        email=intake.email,
        preferred_contact=intake.preferred_contact,
        status="intake",
        intake_date=date.today(),
    )
    
    db.add(client)
    
    # Record scan event (Layer 8 data!)
    scan_event = QRScanEvent(
        organization_id=location.organization_id,
        qr_location_id=qr_location_id,
        device_type=_detect_device_type(request),
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
        resulted_in_intake=True,
        client_id=client.id,
    )
    
    db.add(scan_event)
    
    # Increment scan count on location
    await db.execute(
        update(QRLocation)
        .where(QRLocation.id == qr_location_id)
        .values(scan_count=QRLocation.scan_count + 1)
    )
    
    await db.commit()
    
    # 5. TRIGGER THE BRAIN (The Nervous System in action)
    # This immediately starts the AI Orchestration process
    engine = OrchestrationEngine(db)
    await engine.trigger_event(
        event_type="intake_completed",
        organization_id=location.organization_id,
        client_id=client.id,
        vendor_id=location.vendor_id,
        payload={
            "first_name": intake.first_name,
            "last_name": intake.last_name,
            "qr_location_id": qr_location_id,
            "assigned_vendor": vendor.name
        },
        priority=3  # Medium-high priority for new intakes
    )
    
    return IntakeResponse(
        success=True,
        case_number=case_number,
        assigned_vendor=vendor.name,
        message=f"Welcome! A caseworker from {vendor.name} will contact you within 24 hours.",
        client_id=str(client.id)
    )


@router.post("/qr/{qr_location_id}/scan")
async def record_scan(
    qr_location_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Record a QR scan WITHOUT creating a client.
    Used when someone scans but doesn't complete intake.
    This still generates Layer 8 analytics data.
    """
    # Find QR location
    location_result = await db.execute(
        select(QRLocation).where(QRLocation.id == qr_location_id)
    )
    location = location_result.scalar_one_or_none()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"QR location '{qr_location_id}' not found"
        )
    
    # Set tenant context
    await set_tenant_context(db, location.organization_id)
    
    # Record scan event (Layer 8 data!)
    scan_event = QRScanEvent(
        organization_id=location.organization_id,
        qr_location_id=qr_location_id,
        device_type=_detect_device_type(request),
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
        resulted_in_intake=False,  # Just a scan, no intake
    )
    
    db.add(scan_event)
    
    # Increment scan count
    await db.execute(
        update(QRLocation)
        .where(QRLocation.id == qr_location_id)
        .values(scan_count=QRLocation.scan_count + 1)
    )
    
    await db.commit()
    
    return {"success": True, "message": "Scan recorded"}


def _detect_device_type(request: Request) -> str:
    """Detect device type from User-Agent."""
    user_agent = request.headers.get("user-agent", "").lower()
    
    if "iphone" in user_agent or "ipad" in user_agent:
        return "iOS"
    elif "android" in user_agent:
        return "Android"
    elif "mobile" in user_agent:
        return "Mobile"
    else:
        return "Desktop"
