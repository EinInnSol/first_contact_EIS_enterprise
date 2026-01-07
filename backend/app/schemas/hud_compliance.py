from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date

class HUDIntakeAssessment(BaseModel):
    # Universal Data Elements (HUD HMIS)
    first_name: str
    last_name: str
    dob: date
    ssn_last_4: Optional[str]
    
    # Core Demographics (VI-SPDAT Alignment)
    veteran_status: bool
    disabling_condition: bool
    
    # Living Situation 
    current_residence: str
    prior_residence_duration: str
    homeless_start_date: date
    
    # Vulnerability Factors (The "41 Questions" subset for Triage)
    daily_functioning_score: int # 0-10
    wellness_score: int # 0-10
    social_risk_score: int # 0-10
    
    # Client Needs
    immediate_needs: List[str]
    income_sources: List[str]
