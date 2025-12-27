"""
AI Case Plan Generator Service

Uses Claude 4.5 to generate personalized case plans for homeless clients.
Plans are based on VI-SPDAT scores, acuity levels, barriers, and local resources.
"""

from typing import Dict, List, Optional
from datetime import date, timedelta
import json
import logging

logger = logging.getLogger(__name__)


class AICasePlanGenerator:
    """
    Generates AI-powered case plans using Claude 4.5.
    Plans include 30/60/90 day milestones, specific action items, and resource connections.
    """

    def __init__(self, anthropic_api_key: Optional[str] = None):
        """
        Initialize with Anthropic API key.
        Falls back to demo/rule-based plans if API key not available.
        """
        self.api_key = anthropic_api_key
        self.use_ai = bool(anthropic_api_key)

        if self.use_ai:
            try:
                from anthropic import Anthropic
                self.client = Anthropic(api_key=anthropic_api_key)
                logger.info("AI Case Plan Generator initialized with Claude API")
            except ImportError:
                logger.warning("Anthropic library not installed, using rule-based plans")
                self.use_ai = False
        else:
            logger.info("No API key provided, using rule-based case plans")

    async def generate_case_plan(
        self,
        client_data: Dict,
        vendor_name: str = "Vendor",
        organization_name: str = "Organization"
    ) -> Dict:
        """
        Generate a personalized case plan for a client.

        Args:
            client_data: Dict containing client info (name, vi_spdat_score, acuity, etc.)
            vendor_name: Name of assigned vendor
            organization_name: Name of CoC/organization

        Returns:
            Dict containing:
                - milestones: List of milestone objects (week, title, actions)
                - summary: Overall plan summary
                - estimated_days_to_housing: Prediction
                - confidence_score: AI confidence (0-100)
                - generated_at: Timestamp
        """
        if self.use_ai:
            try:
                return await self._generate_ai_plan(client_data, vendor_name, organization_name)
            except Exception as e:
                logger.error(f"AI plan generation failed: {str(e)}, falling back to rule-based")
                return self._generate_rule_based_plan(client_data, vendor_name)
        else:
            return self._generate_rule_based_plan(client_data, vendor_name)

    async def _generate_ai_plan(
        self,
        client_data: Dict,
        vendor_name: str,
        organization_name: str
    ) -> Dict:
        """Generate case plan using Claude 4.5."""

        # Build context from client data
        context = self._build_client_context(client_data)

        # Create system prompt
        system_prompt = f"""You are an expert case manager for homeless services working with {organization_name}.
You specialize in creating personalized, actionable case plans that lead to housing stability.

Your plans must be:
- Evidence-based and trauma-informed
- Specific with concrete action items
- Realistic based on typical timelines in homeless services
- Focused on the client's unique barriers and strengths
- Aligned with Housing First principles

Always consider:
- VI-SPDAT score indicates severity (0-4: low, 5-8: moderate, 9-13: high, 14-17: severe)
- Higher acuity requires more intensive services
- Benefit enrollment is critical for income stability
- Housing-focused goals, not treatment-first
- Client autonomy and choice"""

        # User prompt with client details
        user_prompt = f"""Create a detailed 90-day case plan for this client assigned to {vendor_name}:

{context}

Return a JSON object with this structure:
{{
  "summary": "Brief 2-3 sentence overview of the plan strategy",
  "estimated_days_to_housing": 45,
  "confidence_score": 85,
  "milestones": [
    {{
      "phase": "Week 1-2: Stabilization",
      "title": "Immediate Needs & Documentation",
      "goals": ["Goal 1", "Goal 2"],
      "actions": [
        {{
          "task": "Specific action item",
          "responsible": "caseworker" or "client" or "vendor",
          "estimated_days": 3,
          "dependencies": ["prerequisite if any"],
          "notes": "Additional context"
        }}
      ]
    }}
  ],
  "key_barriers": ["Barrier 1", "Barrier 2"],
  "critical_success_factors": ["Factor 1", "Factor 2"],
  "resources_needed": ["Resource 1", "Resource 2"]
}}

Focus on these typical phases:
1. Week 1-2: Stabilization (immediate needs, ID, assessment)
2. Week 3-4: Benefits Enrollment (SSI, CalFresh, General Relief)
3. Week 5-6: Housing Search (voucher, application, viewings)
4. Week 7-12: Housing Placement & Move-in Support

Be specific about timelines, who does what, and concrete next steps."""

        # Call Claude API
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            temperature=0.7,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )

        # Parse response
        response_text = message.content[0].text

        # Extract JSON from response (handle markdown code blocks)
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text.strip()

        plan_data = json.loads(json_str)

        # Add metadata
        plan_data["generated_at"] = date.today().isoformat()
        plan_data["generated_by"] = "ai"
        plan_data["model"] = "claude-sonnet-4"

        logger.info(f"AI case plan generated for client {client_data.get('id', 'unknown')}")

        return plan_data

    def _generate_rule_based_plan(self, client_data: Dict, vendor_name: str) -> Dict:
        """
        Fallback: Generate rule-based case plan based on VI-SPDAT score.
        Not as personalized as AI, but functional.
        """
        vi_spdat = client_data.get("vi_spdat_score", 5)
        acuity = client_data.get("acuity_level", "moderate")

        # Determine complexity and timeline based on acuity
        if vi_spdat >= 14 or acuity == "severe":
            timeline = 90
            confidence = 65
            intensity = "high"
        elif vi_spdat >= 9 or acuity == "high":
            timeline = 60
            confidence = 75
            intensity = "moderate-high"
        elif vi_spdat >= 5 or acuity == "moderate":
            timeline = 45
            confidence = 85
            intensity = "moderate"
        else:
            timeline = 30
            confidence = 90
            intensity = "low"

        # Build milestones
        milestones = [
            {
                "phase": "Week 1-2: Stabilization",
                "title": "Immediate Needs & Documentation",
                "goals": [
                    "Meet basic survival needs (food, shelter, safety)",
                    "Obtain valid government-issued ID",
                    "Complete comprehensive assessment"
                ],
                "actions": [
                    {
                        "task": "Schedule intake appointment with caseworker",
                        "responsible": "vendor",
                        "estimated_days": 1,
                        "dependencies": [],
                        "notes": "Initial relationship building and trust establishment"
                    },
                    {
                        "task": "Assist client in obtaining State ID or Driver's License",
                        "responsible": "caseworker",
                        "estimated_days": 7,
                        "dependencies": ["Birth certificate or passport"],
                        "notes": "Required for all benefit applications and housing"
                    },
                    {
                        "task": "Complete VI-SPDAT assessment if not done",
                        "responsible": "caseworker",
                        "estimated_days": 2,
                        "dependencies": [],
                        "notes": "Determines service intensity and prioritization"
                    },
                    {
                        "task": "Connect to emergency resources (food bank, shelter bed)",
                        "responsible": "caseworker",
                        "estimated_days": 1,
                        "dependencies": [],
                        "notes": "Stabilize immediate survival needs"
                    }
                ]
            },
            {
                "phase": "Week 3-4: Benefits Enrollment",
                "title": "Income Stabilization",
                "goals": [
                    "Apply for all eligible government benefits",
                    "Establish monthly income stream",
                    "Open bank account for direct deposit"
                ],
                "actions": [
                    {
                        "task": "Complete SSI/SSDI application with caseworker support",
                        "responsible": "caseworker",
                        "estimated_days": 5,
                        "dependencies": ["State ID", "Birth certificate", "Medical records"],
                        "notes": "Highest value benefit, 3-6 month processing time"
                    },
                    {
                        "task": "Apply for CalFresh (food stamps)",
                        "responsible": "caseworker",
                        "estimated_days": 3,
                        "dependencies": ["State ID"],
                        "notes": "Fastest approval, immediate impact on food security"
                    },
                    {
                        "task": "Apply for General Relief if SSI pending",
                        "responsible": "caseworker",
                        "estimated_days": 3,
                        "dependencies": ["State ID", "Proof of homelessness"],
                        "notes": "Bridge income while awaiting SSI approval"
                    },
                    {
                        "task": "Open bank account for benefit direct deposit",
                        "responsible": "caseworker",
                        "estimated_days": 2,
                        "dependencies": ["State ID"],
                        "notes": "Required for most benefits, builds financial stability"
                    }
                ]
            },
            {
                "phase": "Week 5-8: Housing Search",
                "title": "Identify & Secure Housing",
                "goals": [
                    "Complete housing applications",
                    "View available units",
                    "Pass screening and background checks"
                ],
                "actions": [
                    {
                        "task": "Apply for housing voucher or rapid rehousing",
                        "responsible": "caseworker",
                        "estimated_days": 7,
                        "dependencies": ["Income verification", "ID"],
                        "notes": "May have waitlist depending on availability"
                    },
                    {
                        "task": "Attend housing search workshops",
                        "responsible": "client",
                        "estimated_days": 3,
                        "dependencies": [],
                        "notes": "Learn tenant rights, application process, budgeting"
                    },
                    {
                        "task": "Schedule unit viewings with landlords",
                        "responsible": "caseworker",
                        "estimated_days": 10,
                        "dependencies": ["Voucher approval"],
                        "notes": "Coordinate transportation and accompaniment"
                    },
                    {
                        "task": "Complete rental applications and background checks",
                        "responsible": "caseworker",
                        "estimated_days": 5,
                        "dependencies": ["References", "Income proof"],
                        "notes": "Address any barriers (credit, background) proactively"
                    }
                ]
            },
            {
                "phase": "Week 9-12: Housing Placement",
                "title": "Move-in & Stabilization",
                "goals": [
                    "Sign lease and move into housing",
                    "Set up utilities and household essentials",
                    "Connect to ongoing support services"
                ],
                "actions": [
                    {
                        "task": "Sign lease agreement and complete move-in inspection",
                        "responsible": "caseworker",
                        "estimated_days": 2,
                        "dependencies": ["Approved application", "Move-in funds"],
                        "notes": "Review lease thoroughly, document unit condition"
                    },
                    {
                        "task": "Coordinate move-in assistance and furniture donation",
                        "responsible": "vendor",
                        "estimated_days": 3,
                        "dependencies": ["Lease signed"],
                        "notes": "Bed, kitchen basics, cleaning supplies"
                    },
                    {
                        "task": "Set up utilities (electric, gas, internet)",
                        "responsible": "caseworker",
                        "estimated_days": 2,
                        "dependencies": ["Lease signed"],
                        "notes": "Assist with deposits and low-income programs"
                    },
                    {
                        "task": "Schedule follow-up support visits (30/60/90 days)",
                        "responsible": "caseworker",
                        "estimated_days": 1,
                        "dependencies": ["Housing secured"],
                        "notes": "Monitor stability, address issues early, prevent returns to homelessness"
                    }
                ]
            }
        ]

        # Adjust milestones based on intensity
        if intensity == "high":
            # Add additional clinical/behavioral health milestones
            milestones.insert(2, {
                "phase": "Week 4-6: Clinical Support",
                "title": "Address Behavioral Health Needs",
                "goals": [
                    "Connect to mental health or substance use services",
                    "Establish medication management if needed",
                    "Build crisis support network"
                ],
                "actions": [
                    {
                        "task": "Schedule psychiatric evaluation",
                        "responsible": "caseworker",
                        "estimated_days": 7,
                        "dependencies": ["Medi-Cal enrollment"],
                        "notes": "Required for high-acuity clients with mental health needs"
                    },
                    {
                        "task": "Connect to outpatient treatment program",
                        "responsible": "caseworker",
                        "estimated_days": 5,
                        "dependencies": [],
                        "notes": "Harm reduction approach, client-centered goals"
                    },
                    {
                        "task": "Establish crisis plan and emergency contacts",
                        "responsible": "caseworker",
                        "estimated_days": 2,
                        "dependencies": [],
                        "notes": "24/7 crisis line, trusted contacts, de-escalation strategies"
                    }
                ]
            })

        return {
            "summary": f"This {intensity}-intensity plan focuses on rapid stabilization, benefit enrollment, and housing placement within {timeline} days. The client will work closely with {vendor_name} to address barriers systematically.",
            "estimated_days_to_housing": timeline,
            "confidence_score": confidence,
            "milestones": milestones,
            "key_barriers": self._identify_barriers(client_data),
            "critical_success_factors": [
                "Consistent engagement with caseworker",
                "Successful benefit enrollment",
                "Landlord willing to accept voucher",
                "Stable income stream established"
            ],
            "resources_needed": [
                "Housing voucher or rapid rehousing funds",
                "ID acquisition assistance",
                "Benefit application support",
                "Transportation to appointments",
                "Move-in assistance (furniture, deposits)"
            ],
            "generated_at": date.today().isoformat(),
            "generated_by": "rule_based",
            "model": "rule_based_v1"
        }

    def _build_client_context(self, client_data: Dict) -> str:
        """Build formatted context string for AI prompt."""
        context_parts = []

        # Basic info
        name = f"{client_data.get('first_name', 'Client')} {client_data.get('last_name', '')}"
        context_parts.append(f"Name: {name}")

        if client_data.get("date_of_birth"):
            dob = client_data["date_of_birth"]
            if isinstance(dob, str):
                from datetime import datetime
                dob = datetime.fromisoformat(dob.replace('Z', '+00:00')).date()
            age = (date.today() - dob).days // 365
            context_parts.append(f"Age: {age}")

        # VI-SPDAT and acuity
        if client_data.get("vi_spdat_score") is not None:
            context_parts.append(f"VI-SPDAT Score: {client_data['vi_spdat_score']}/17")

        if client_data.get("acuity_level"):
            context_parts.append(f"Acuity Level: {client_data['acuity_level']}")

        # Status
        if client_data.get("status"):
            context_parts.append(f"Current Status: {client_data['status']}")

        # Days homeless
        if client_data.get("intake_date"):
            intake = client_data["intake_date"]
            if isinstance(intake, str):
                from datetime import datetime
                intake = datetime.fromisoformat(intake.replace('Z', '+00:00')).date()
            days_homeless = (date.today() - intake).days
            context_parts.append(f"Days in system: {days_homeless}")

        return "\n".join(context_parts)

    def _identify_barriers(self, client_data: Dict) -> List[str]:
        """Identify likely barriers based on client data."""
        barriers = []

        vi_spdat = client_data.get("vi_spdat_score", 5)
        acuity = client_data.get("acuity_level", "moderate")

        if vi_spdat >= 14 or acuity == "severe":
            barriers.extend([
                "Chronic homelessness with complex needs",
                "Likely behavioral health or substance use challenges",
                "May require intensive case management"
            ])
        elif vi_spdat >= 9:
            barriers.extend([
                "Moderate-to-high service needs",
                "May have health or mental health barriers",
                "History of housing instability"
            ])

        if not client_data.get("phone"):
            barriers.append("No phone contact - communication challenges")

        if not client_data.get("date_of_birth"):
            barriers.append("Missing documentation - ID acquisition needed")

        return barriers or ["Standard barriers to housing stability"]
