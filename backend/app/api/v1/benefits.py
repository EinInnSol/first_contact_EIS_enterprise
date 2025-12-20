"""
Benefits API - Benefit Stack Management

The CORE INNOVATION: Stability comes from stacking multiple benefits.
This API manages benefit enrollments and calculates optimal stacks.

Key insight from James's experience:
- GR Housing Subsidy ($575) reduces GR by $100
- SSI enables IHSS (family member can be paid as caregiver)
- Benefits have dependencies and interactions
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date
from decimal import Decimal
import uuid

from app.database import get_db
from app.api.deps import get_current_user, require_vendor_access
from app.models.user import User
from app.models.client import Client


router = APIRouter(prefix="/clients/{client_id}/benefits", tags=["Benefits (Layers 1-7)"])


# ============================================
# BENEFIT PROGRAM DEFINITIONS
# ============================================

BENEFIT_PROGRAMS = {
    # Income Sources
    "ssi": {
        "name": "Supplemental Security Income",
        "category": "income",
        "typical_amount": 1183,
        "requires": ["disability_documentation"],
        "enables": ["ihss", "medi_cal"],
        "timeline": "3-6 months"
    },
    "ssdi": {
        "name": "Social Security Disability Insurance",
        "category": "income",
        "typical_amount": 1500,
        "requires": ["disability_documentation", "work_credits"],
        "timeline": "3-6 months"
    },
    "gr": {
        "name": "General Relief",
        "category": "income",
        "typical_amount": 221,
        "requires": ["no_dependents", "low_income"],
        "excludes": ["ssi", "ssdi", "calworks"],
        "modified_by": {
            "gr_housing_subsidy": {"reduces_by": 100, "new_amount": 121}
        },
        "timeline": "2-4 weeks"
    },
    "calworks": {
        "name": "CalWORKs",
        "category": "income",
        "typical_amount": 750,
        "requires": ["has_children"],
        "timeline": "2-4 weeks"
    },
    
    # Housing Assistance
    "gr_housing_subsidy": {
        "name": "GR Housing Subsidy",
        "category": "housing",
        "typical_amount": 575,
        "requires": ["gr_recipient", "housed"],
        "affects": {"gr": {"reduces_by": 100}},
        "note": "Net benefit is $475 ($575 - $100 GR reduction)",
        "timeline": "1-2 weeks once housed"
    },
    "section8": {
        "name": "Section 8 Voucher",
        "category": "housing",
        "typical_amount": 1200,
        "requires": ["on_waitlist"],
        "timeline": "3-7 years waitlist"
    },
    "vash": {
        "name": "HUD-VASH Voucher",
        "category": "housing",
        "typical_amount": 1200,
        "requires": ["veteran", "homeless"],
        "timeline": "1-3 months"
    },
    "rrh": {
        "name": "Rapid Rehousing",
        "category": "housing",
        "typical_amount": 800,
        "requires": ["homeless", "employable"],
        "duration": "6-24 months",
        "timeline": "2-8 weeks"
    },
    
    # Healthcare
    "medi_cal": {
        "name": "Medi-Cal",
        "category": "healthcare",
        "typical_amount": 0,
        "requires": ["low_income"],
        "enables": ["ihss"],
        "timeline": "1-2 weeks"
    },
    "ihss": {
        "name": "In-Home Supportive Services",
        "category": "healthcare",
        "typical_amount": 1200,
        "requires": ["ssi_or_medi_cal", "needs_assistance"],
        "note": "FAMILY MEMBER CAN BE PAID AS CAREGIVER - $800-1,500/month",
        "timeline": "4-8 weeks after SSI"
    },
    
    # Food
    "calfresh": {
        "name": "CalFresh (Food Stamps)",
        "category": "food",
        "typical_amount": 234,
        "requires": ["low_income"],
        "timeline": "3-7 days (expedited for homeless)"
    },
    
    # Utilities
    "care": {
        "name": "CARE/FERA (Utility Discount)",
        "category": "utilities",
        "typical_amount": 50,
        "requires": ["low_income"],
        "timeline": "1-2 weeks"
    },
    "lifeline": {
        "name": "Lifeline (Phone Service)",
        "category": "phone",
        "typical_amount": 15,
        "requires": ["low_income"],
        "timeline": "Same day"
    }
}


# ============================================
# SCHEMAS
# ============================================

class BenefitEnrollment(BaseModel):
    program_code: str
    status: str  # pending, applied, approved, denied, active
    monthly_amount: Optional[Decimal] = None
    application_date: Optional[date] = None
    approval_date: Optional[date] = None
    notes: Optional[str] = None


class BenefitStackProjection(BaseModel):
    current_monthly_income: Decimal
    projected_monthly_income: Decimal
    projected_monthly_expenses: Decimal
    projected_net_monthly: Decimal
    programs_active: List[Dict[str, Any]]
    programs_pending: List[Dict[str, Any]]
    programs_recommended: List[Dict[str, Any]]
    recommended_sequence: List[Dict[str, Any]]
    notes: List[str]


class ApplyBenefitRequest(BaseModel):
    program_code: str
    application_date: Optional[date] = None
    notes: Optional[str] = None


class UpdateBenefitRequest(BaseModel):
    status: str
    monthly_amount: Optional[Decimal] = None
    approval_date: Optional[date] = None
    notes: Optional[str] = None


# ============================================
# HELPER FUNCTIONS
# ============================================

def calculate_benefit_stack(
    active_benefits: List[str],
    client_info: Dict[str, Any]
) -> Dict[str, Decimal]:
    """
    Calculate actual benefit amounts considering interactions.
    
    Key interactions:
    - GR + GR Housing Subsidy = GR reduced by $100
    - SSI enables IHSS
    """
    amounts = {}
    
    for benefit_code in active_benefits:
        program = BENEFIT_PROGRAMS.get(benefit_code)
        if not program:
            continue
            
        amount = Decimal(str(program["typical_amount"]))
        
        # Check if this benefit is modified by another active benefit
        if "modified_by" in program:
            for modifier_code, modification in program["modified_by"].items():
                if modifier_code in active_benefits:
                    amount = Decimal(str(modification.get("new_amount", amount)))
        
        amounts[benefit_code] = amount
    
    return amounts


def determine_eligibility(
    program_code: str,
    client_info: Dict[str, Any],
    active_benefits: List[str]
) -> Dict[str, Any]:
    """
    Determine if client is eligible for a benefit program.
    Returns eligibility status and any barriers.
    """
    program = BENEFIT_PROGRAMS.get(program_code)
    if not program:
        return {"eligible": False, "reason": "Unknown program"}
    
    # Check exclusions
    if "excludes" in program:
        for excluded in program["excludes"]:
            if excluded in active_benefits:
                return {
                    "eligible": False,
                    "reason": f"Cannot have {program['name']} while receiving {BENEFIT_PROGRAMS[excluded]['name']}"
                }
    
    # Check requirements
    barriers = []
    requirements = program.get("requires", [])
    
    for req in requirements:
        if req == "disability_documentation" and not client_info.get("has_disability_docs"):
            barriers.append("Need disability documentation")
        elif req == "low_income" and client_info.get("monthly_income", 0) > 1500:
            barriers.append("Income too high")
        elif req == "gr_recipient" and "gr" not in active_benefits:
            barriers.append("Must be receiving General Relief")
        elif req == "housed" and not client_info.get("is_housed"):
            barriers.append("Must be housed first")
        elif req == "veteran" and not client_info.get("is_veteran"):
            barriers.append("Must be a veteran")
        elif req == "has_children" and not client_info.get("has_children"):
            barriers.append("Must have dependent children")
        elif req == "ssi_or_medi_cal" and "ssi" not in active_benefits and "medi_cal" not in active_benefits:
            barriers.append("Must have SSI or Medi-Cal first")
    
    if barriers:
        return {"eligible": False, "barriers": barriers}
    
    return {"eligible": True, "barriers": []}


# ============================================
# ENDPOINTS
# ============================================

@router.get("/projection", response_model=BenefitStackProjection)
async def get_benefit_projection(
    client_id: str,
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate optimal benefit stack projection for client.
    
    This is the INTELLIGENCE that caseworkers love:
    - Shows all eligible benefits
    - Calculates optimal combination
    - Provides step-by-step application sequence
    - Accounts for benefit interactions (GR reduction, etc.)
    """
    # Get client
    result = await db.execute(
        select(Client).where(Client.id == uuid.UUID(client_id))
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Build client info for eligibility checks
    # In production, this would come from actual client data
    client_info = {
        "has_disability_docs": client.acuity_level in ["high", "severe"],
        "monthly_income": 0,  # Assume homeless = no income
        "is_housed": client.status == "housed",
        "is_veteran": False,  # TODO: Add veteran status to client model
        "has_children": False,  # TODO: Add family status
        "low_income": True,
    }
    
    # Simulate current active benefits (in production, query benefit_enrollments table)
    # For now, assume new client with no benefits
    active_benefits = []
    
    # Calculate current income
    current_amounts = calculate_benefit_stack(active_benefits, client_info)
    current_income = sum(current_amounts.values())
    
    # Determine recommended benefits
    recommended = []
    for code, program in BENEFIT_PROGRAMS.items():
        if code not in active_benefits:
            eligibility = determine_eligibility(code, client_info, active_benefits)
            if eligibility["eligible"]:
                recommended.append({
                    "code": code,
                    "name": program["name"],
                    "category": program["category"],
                    "typical_amount": program["typical_amount"],
                    "timeline": program.get("timeline", "Unknown")
                })
    
    # Build recommended sequence
    sequence = [
        {
            "step": 1,
            "programs": ["calfresh", "medi_cal", "gr"],
            "provider": "DPSS",
            "reason": "Can apply for all 3 at same appointment",
            "timeline": "Week 1"
        },
        {
            "step": 2,
            "programs": ["lifeline", "care"],
            "provider": "Phone/Utility companies",
            "reason": "Quick wins while waiting",
            "timeline": "Week 1-2"
        },
        {
            "step": 3,
            "programs": ["ssi"],
            "provider": "Social Security Administration",
            "reason": "Start early - takes 3-6 months",
            "timeline": "Week 2"
        },
        {
            "step": 4,
            "programs": ["gr_housing_subsidy"],
            "provider": "DPSS",
            "reason": "Once housing is secured",
            "timeline": "When housed"
        },
        {
            "step": 5,
            "programs": ["ihss"],
            "provider": "DPSS IHSS",
            "reason": "After SSI approved - family can be paid as caregiver",
            "timeline": "After SSI"
        }
    ]
    
    # Calculate projected income with all recommended benefits
    all_benefits = active_benefits + [r["code"] for r in recommended]
    projected_amounts = calculate_benefit_stack(all_benefits, {**client_info, "is_housed": True})
    projected_income = sum(projected_amounts.values())
    
    # Estimate expenses
    projected_expenses = Decimal("550")  # Rent after subsidies + utilities
    
    # Build notes
    notes = [
        "GR amount will reduce to $121 when GR Housing Subsidy activated",
        "IHSS can add $800-1,500/mo if family member available as caregiver",
        "CalFresh expedited for homeless - can get within 3 days"
    ]
    
    return BenefitStackProjection(
        current_monthly_income=current_income,
        projected_monthly_income=projected_income,
        projected_monthly_expenses=projected_expenses,
        projected_net_monthly=projected_income - projected_expenses,
        programs_active=[{
            "code": code,
            "name": BENEFIT_PROGRAMS[code]["name"],
            "amount": float(amt)
        } for code, amt in current_amounts.items()],
        programs_pending=[],  # TODO: Query from enrollments
        programs_recommended=recommended,
        recommended_sequence=sequence,
        notes=notes
    )


@router.post("/apply")
async def apply_for_benefit(
    client_id: str,
    request: ApplyBenefitRequest,
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db)
):
    """
    Mark a benefit as applied for.
    This updates the client's benefit journey and enables tracking.
    """
    # Verify client exists
    result = await db.execute(
        select(Client).where(Client.id == uuid.UUID(client_id))
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    program = BENEFIT_PROGRAMS.get(request.program_code)
    if not program:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown benefit program: {request.program_code}"
        )
    
    # TODO: Create benefit_enrollment record in database
    # For now, return success
    
    return {
        "success": True,
        "message": f"Application for {program['name']} recorded",
        "program_code": request.program_code,
        "application_date": request.application_date or date.today(),
        "expected_timeline": program.get("timeline", "Unknown")
    }


@router.get("")
async def list_client_benefits(
    client_id: str,
    user: User = Depends(require_vendor_access),
    db: AsyncSession = Depends(get_db)
):
    """
    List all benefit enrollments for a client.
    Shows active, pending, and denied benefits.
    """
    # Verify client exists
    result = await db.execute(
        select(Client).where(Client.id == uuid.UUID(client_id))
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # TODO: Query actual benefit_enrollments table
    # For demo, return sample data
    
    return {
        "client_id": str(client.id),
        "enrollments": [],
        "total_monthly_income": 0,
        "message": "No benefits enrolled yet. Use /projection to see recommendations."
    }
