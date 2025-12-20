"""
Layer 8 Analytics API - CITY ADMIN ONLY

These endpoints provide vendor performance data that vendors CANNOT see.
This is the "hidden payload" of the Trojan Horse strategy.

Access Control:
- city_admin: Full access
- city_council: Full access  
- caseworker: 403 Forbidden
- vendor_admin: 403 Forbidden
- client: 403 Forbidden
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
from typing import List, Optional

from app.api.deps import get_db, get_current_user, require_city_admin
from app.models.user import User
from app.models.vendor import Vendor
from app.models.client import Client
from app.models.qr_scan_event import QRScanEvent
from app.models.qr_location import QRLocation

router = APIRouter(prefix="/analytics", tags=["Layer 8 Analytics"])


@router.get("/vendor-performance")
async def get_vendor_performance(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """
    Get vendor performance comparison data.
    
    LAYER 8 ENDPOINT - City administrators only.
    Caseworkers and vendor admins receive 403 Forbidden.
    
    This is the data that makes cities mandate the platform.
    """
    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()
    
    # Get all vendors for this organization
    result = await db.execute(select(Vendor).where(Vendor.active == True))
    vendors = result.scalars().all()
    
    vendor_data = []
    for vendor in vendors:
        # Get client counts
        clients_result = await db.execute(
            select(Client).where(Client.assigned_vendor_id == vendor.id)
        )
        clients = clients_result.scalars().all()
        
        total_clients = len(clients)
        housed_clients = len([c for c in clients if c.status == 'housed'])
        
        vendor_data.append({
            "id": vendor.id,
            "name": vendor.name,
            "metrics": {
                "total_clients": total_clients,
                "housed_count": housed_clients,
                "housing_rate": housed_clients / total_clients if total_clients > 0 else 0,
                "avg_exit_income": 0,  # TODO: Calculate from actual data
                "avg_days_to_housing": 0,  # TODO: Calculate from actual data
            }
        })
    
    return {
        "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
        "vendors": vendor_data
    }


@router.get("/geographic")
async def get_geographic_analytics(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get QR scan heat map data.
    
    LAYER 8 ENDPOINT - Shows where people are scanning QR codes,
    which reveals where homeless populations concentrate.
    """
    # Get all QR locations with scan counts
    result = await db.execute(select(QRLocation))
    locations = result.scalars().all()
    
    location_data = []
    for loc in locations:
        # Get scan count for this location
        scan_result = await db.execute(
            select(func.count(QRScanEvent.id))
            .where(QRScanEvent.qr_location_id == loc.id)
        )
        scan_count = scan_result.scalar() or 0
        
        # Get intake conversion count
        intake_result = await db.execute(
            select(func.count(QRScanEvent.id))
            .where(QRScanEvent.qr_location_id == loc.id)
            .where(QRScanEvent.resulted_in_intake == True)
        )
        intake_count = intake_result.scalar() or 0
        
        location_data.append({
            "id": loc.id,
            "name": loc.name,
            "lat": float(loc.latitude) if loc.latitude else None,
            "lng": float(loc.longitude) if loc.longitude else None,
            "scan_count": scan_count,
            "intake_count": intake_count,
            "conversion_rate": intake_count / scan_count if scan_count > 0 else 0,
            "assigned_vendor_id": loc.vendor_id
        })
    
    return {
        "locations": location_data
    }


@router.get("/bottlenecks")
async def get_bottleneck_analysis(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Identify system bottlenecks.
    
    LAYER 8 ENDPOINT - Shows where the system is slowing down,
    helping cities optimize resource allocation.
    """
    # Placeholder - will implement with actual bottleneck analysis
    return {
        "bottlenecks": [
            {
                "type": "provider_delay",
                "provider": "DPSS",
                "service": "SSI Assessment",
                "avg_wait_days": 42,
                "impact": "Delays housing placements",
                "affected_clients": 0
            }
        ]
    }
