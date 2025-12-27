"""
Compliance API - LAYER 6
Automated HUD APR and HMIS Compliance Reporting.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date
from typing import Dict, Any, Optional

from app.database import get_db
from app.api.deps import get_current_user, require_vendor_access
from app.models.user import User
from app.services.compliance_agent import ComplianceAgent

router = APIRouter(prefix="/compliance", tags=["Compliance & Reporting"])

@router.get("/hud-apr")
async def get_hud_apr_report(
    start_date: date = Query(..., description="Start of reporting period"),
    end_date: date = Query(..., description="End of reporting period"),
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a HUD Annual Performance Report (APR) for the given period.
    
    LAYER 6 FEATURE: One-click compliance reporting.
    """
    agent = ComplianceAgent()
    
    # Convert date to datetime
    start_dt = datetime.combine(start_date, datetime.min.time())
    end_dt = datetime.combine(end_date, datetime.max.time())
    
    report = await agent.generate_hud_apr(
        organization_id=user.organization_id,
        start_date=start_dt,
        end_date=end_dt,
        db=db
    )
    
    return report

@router.get("/audit")
async def run_compliance_audit(
    user: User = Depends(require_vendor_access)
):
    """
    Run a real-time compliance and data quality audit for the organization.
    """
    agent = ComplianceAgent()
    return await agent.run_audit_cycle(user.organization_id)
