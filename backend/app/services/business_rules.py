"""
Business Rules Engine - Benefit Eligibility and Interactions

Encodes complex benefit program rules, interactions, and dependencies.
"""

from typing import Dict, List, Set, Optional
from datetime import date
from decimal import Decimal


class BenefitRules:
    """
    Benefit program eligibility rules and interactions.
    
    Critical Rules:
    - SSI recipients NOW eligible for CalFresh (as of 2019)
    - GR Housing Subsidy ($575) REDUCES General Relief by $100
    - IHSS can pay family members as caregivers ($800-$1,500/mo)
    """
    
    # Program definitions with typical amounts
    PROGRAMS = {
        "ssi": {
            "name": "Supplemental Security Income",
            "category": "income",
            "amount": 1183,
            "requires": ["disability_documentation", "low_income"],
            "excludes": [],
            "timeline_months": "3-6"
        },
        "gr": {
            "name": "General Relief",
            "category": "income",
            "amount": 221,
            "requires": ["no_dependents"],
            "excludes": ["ssi", "ssdi", "calworks"],
            "timeline_days": "14-30"
        },
        "gr_housing_subsidy": {
            "name": "GR Housing Subsidy",
            "category": "housing",
            "amount": 575,
            "requires": ["gr_active", "housed"],
            "affects": {"gr": {"reduces_by": 100}},  # CRITICAL INTERACTION
            "timeline_days": "7-14"
        },
        "calfresh": {
            "name": "CalFresh (SNAP)",
            "category": "food",
            "amount": 234,
            "requires": ["low_income"],
            "excludes": [],  # SSI recipients NOW eligible (as of 2019)
            "expedited_homeless": True,
            "timeline_days": "3-7"
        },
        "medi_cal": {
            "name": "Medi-Cal",
            "category": "healthcare",
            "amount": 0,
            "requires": ["low_income"],
            "excludes": [],
            "timeline_days": "7-14"
        },
        "ihss": {
            "name": "In-Home Supportive Services",
            "category": "healthcare",
            "amount": 1200,
            "requires": ["ssi_or_medi_cal", "needs_assistance"],
            "note": "Family member can be paid as caregiver",
            "timeline_months": "1-2"
        }
    }
    
    @classmethod
    def check_eligibility(
        cls,
        program_code: str,
        client_info: Dict
    ) -> tuple[bool, Optional[str]]:
        """
        Check if client is eligible for a benefit program.
        
        Returns (is_eligible, reason_if_not)
        """
        program = cls.PROGRAMS.get(program_code)
        if not program:
            return False, "Unknown program"
        
        # Check exclusions first
        for excluded in program.get("excludes", []):
            if client_info.get(f"has_{excluded}"):
                return False, f"Cannot receive {program_code} while receiving {excluded}"
        
        # Check requirements
        for req in program.get("requires", []):
            if not cls._check_requirement(req, client_info):
                return False, f"Does not meet requirement: {req}"
        
        return True, None
    
    @classmethod
    def _check_requirement(cls, requirement: str, client_info: Dict) -> bool:
        """Check if client meets a specific requirement."""
        
        if requirement == "disability_documentation":
            return client_info.get("has_disability_docs", False)
        
        elif requirement == "low_income":
            monthly_income = client_info.get("monthly_income", 0)
            return monthly_income < 1500  # Simplified threshold
        
        elif requirement == "no_dependents":
            return client_info.get("has_dependents", False) == False
        
        elif requirement == "gr_active":
            return client_info.get("has_gr", False)
        
        elif requirement == "housed":
            return client_info.get("is_housed", False)
        
        elif requirement == "ssi_or_medi_cal":
            return client_info.get("has_ssi") or client_info.get("has_medi_cal")
        
        elif requirement == "needs_assistance":
            return client_info.get("needs_daily_assistance", False)
        
        return False
    
    @classmethod
    def calculate_benefit_stack(
        cls,
        client_info: Dict,
        active_programs: List[str]
    ) -> Dict:
        """
        Calculate total monthly income from benefit stack.
        
        Accounts for program interactions (e.g., GR reduction with housing subsidy).
        """
        total_income = Decimal(0)
        program_amounts = {}
        interactions_applied = []
        
        for program_code in active_programs:
            program = cls.PROGRAMS.get(program_code)
            if not program:
                continue
            
            base_amount = Decimal(program["amount"])
            
            # Check if another program affects this one
            affected_by = None
            for other_code in active_programs:
                other_program = cls.PROGRAMS.get(other_code)
                if other_program and "affects" in other_program:
                    if program_code in other_program["affects"]:
                        affected_by = other_code
                        break
            
            if affected_by:
                # Apply interaction
                other_program = cls.PROGRAMS[affected_by]
                interaction = other_program["affects"][program_code]
                
                if "reduces_by" in interaction:
                    reduction = Decimal(interaction["reduces_by"])
                    final_amount = base_amount - reduction
                    
                    interactions_applied.append({
                        "program": program_code,
                        "reduced_by": affected_by,
                        "amount": float(reduction),
                        "reason": f"{other_program['name']} reduces {program['name']}"
                    })
                else:
                    final_amount = base_amount
            else:
                final_amount = base_amount
            
            program_amounts[program_code] = float(final_amount)
            total_income += final_amount
        
        return {
            "total_monthly_income": float(total_income),
            "program_amounts": program_amounts,
            "interactions": interactions_applied
        }
    
    @classmethod
    def recommend_application_sequence(
        cls,
        eligible_programs: List[str]
    ) -> List[Dict]:
        """
        Recommend optimal order to apply for benefits.
        
        Returns prioritized list with timelines.
        """
        sequence = []
        
        # Step 1: Immediate benefits (fastest approval)
        immediate = []
        if "calfresh" in eligible_programs:
            immediate.append("calfresh")
        if "medi_cal" in eligible_programs:
            immediate.append("medi_cal")
        if "gr" in eligible_programs:
            immediate.append("gr")
        
        if immediate:
            sequence.append({
                "step": 1,
                "programs": immediate,
                "location": "DPSS Long Beach",
                "timeline": "Week 1",
                "note": "Can apply for all simultaneously at same appointment"
            })
        
        # Step 2: SSI (start early - takes months)
        if "ssi" in eligible_programs:
            sequence.append({
                "step": 2,
                "programs": ["ssi"],
                "location": "Social Security Administration",
                "timeline": "Week 2 (3-6 months to approval)",
                "note": "CRITICAL: Start this early! Long approval process."
            })
        
        # Step 3: Housing subsidy (once housed)
        if "gr_housing_subsidy" in eligible_programs:
            sequence.append({
                "step": 3,
                "programs": ["gr_housing_subsidy"],
                "location": "DPSS",
                "timeline": "Once housing secured",
                "note": "Reduces GR to $121 but adds $575 housing = net +$475"
            })
        
        # Step 4: IHSS (after SSI/Medi-Cal approved)
        if "ihss" in eligible_programs:
            sequence.append({
                "step": 4,
                "programs": ["ihss"],
                "location": "DPSS IHSS",
                "timeline": "After SSI/Medi-Cal approval",
                "note": "Family member can be paid $800-1,500/month as caregiver"
            })
        
        return sequence


class HousingPathwayRules:
    """
    Rules for determining appropriate housing pathway based on VI-SPDAT score.
    """
    
    @classmethod
    def recommend_pathway(cls, vi_spdat_score: int, client_info: Dict) -> Dict:
        """
        Recommend housing pathway based on VI-SPDAT score and client situation.
        
        Returns pathway recommendation with reasoning.
        """
        # Scores 0-3: Low acuity
        if vi_spdat_score <= 3:
            return {
                "pathway": "rapid_rehousing",
                "name": "Rapid Rehousing",
                "reasoning": "Low acuity score suggests client can achieve stability with time-limited assistance",
                "typical_duration": "6-12 months",
                "services": ["Rental assistance", "Light case management"]
            }
        
        # Scores 4-7: Moderate acuity
        elif vi_spdat_score <= 7:
            if client_info.get("has_substance_use"):
                return {
                    "pathway": "sober_living",
                    "name": "Sober Living",
                    "reasoning": "Moderate acuity with substance use - structured environment recommended",
                    "typical_duration": "3-6 months transitional",
                    "services": ["Treatment", "Structured environment", "Case management"]
                }
            else:
                return {
                    "pathway": "transitional_housing",
                    "name": "Transitional Housing",
                    "reasoning": "Moderate acuity - needs skills building before independent housing",
                    "typical_duration": "6-24 months",
                    "services": ["Life skills", "Employment support", "Case management"]
                }
        
        # Scores 8+: High acuity
        else:
            if client_info.get("is_chronic_homeless") or client_info.get("has_disability"):
                return {
                    "pathway": "psh",
                    "name": "Permanent Supportive Housing",
                    "reasoning": "High acuity with chronic homelessness/disability - needs long-term support",
                    "typical_duration": "Permanent with ongoing services",
                    "services": ["Case management", "Mental health", "Substance abuse treatment", "Life skills"]
                }
            else:
                return {
                    "pathway": "intensive_case_management",
                    "name": "Intensive Case Management + Housing",
                    "reasoning": "High acuity - needs intensive support but not necessarily permanent",
                    "typical_duration": "12-24 months",
                    "services": ["Daily check-ins", "Crisis intervention", "Benefit coordination"]
                }
