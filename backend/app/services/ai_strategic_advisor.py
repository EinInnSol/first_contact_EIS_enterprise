"""
AI Strategic Advisor Service

Provides AI-powered strategic insights for city administrators using RAG
(Retrieval-Augmented Generation) with real-time database context.

This is the Layer 8 "killer feature" - city officials can ask natural language
questions and get data-driven recommendations.
"""

from typing import Dict, List, Optional, Any
from datetime import date, datetime, timedelta
import json
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

logger = logging.getLogger(__name__)


class AIStrategicAdvisor:
    """
    AI-powered strategic advisor for city decision-makers.
    Uses Claude 4.5 with database context injection for accurate, data-driven insights.
    """

    def __init__(self, anthropic_api_key: Optional[str] = None):
        """Initialize with Anthropic API key."""
        self.api_key = anthropic_api_key
        self.use_ai = bool(anthropic_api_key)

        if self.use_ai:
            try:
                from anthropic import Anthropic
                self.client = Anthropic(api_key=anthropic_api_key)
                logger.info("AI Strategic Advisor initialized with Claude API")
            except ImportError:
                logger.warning("Anthropic library not installed, using rule-based responses")
                self.use_ai = False
        else:
            logger.info("No API key provided, using rule-based advisor")

    async def get_strategic_insight(
        self,
        question: str,
        organization_id: int,
        db: AsyncSession,
        context_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Answer a strategic question using AI with database context.

        Args:
            question: Natural language question from city administrator
            organization_id: Organization ID for data scoping
            db: Database session for context retrieval
            context_data: Optional pre-fetched context data

        Returns:
            Dict containing:
                - answer: AI-generated response
                - data_sources: List of data points used
                - recommendations: Specific actionable items
                - confidence: AI confidence score
        """
        # Fetch relevant context from database
        if not context_data:
            context_data = await self._fetch_context(organization_id, db)

        if self.use_ai:
            try:
                return await self._generate_ai_insight(question, context_data, organization_id)
            except Exception as e:
                logger.error(f"AI insight generation failed: {str(e)}, falling back to rule-based")
                return self._generate_rule_based_insight(question, context_data)
        else:
            return self._generate_rule_based_insight(question, context_data)

    async def _fetch_context(self, organization_id: int, db: AsyncSession) -> Dict[str, Any]:
        """
        Fetch comprehensive context data from database.
        This is the RAG component - we're retrieving relevant data for AI context.
        """
        from app.models.client import Client
        from app.models.vendor import Vendor

        context = {}

        # Vendor performance summary
        vendors_result = await db.execute(
            select(Vendor).where(Vendor.organization_id == organization_id)
        )
        vendors = vendors_result.scalars().all()

        vendor_stats = []
        for vendor in vendors:
            # Get client metrics for this vendor
            clients_result = await db.execute(
                select(Client).where(
                    and_(
                        Client.organization_id == organization_id,
                        Client.assigned_vendor_id == vendor.id
                    )
                )
            )
            clients = clients_result.scalars().all()

            total_clients = len(clients)
            housed = len([c for c in clients if c.status == "housed"])
            housing_rate = (housed / total_clients * 100) if total_clients > 0 else 0

            # Calculate average days to housing
            days_to_housing = []
            for client in clients:
                if client.housed_date and client.intake_date:
                    days = (client.housed_date - client.intake_date).days
                    days_to_housing.append(days)

            avg_days = sum(days_to_housing) / len(days_to_housing) if days_to_housing else 0

            vendor_stats.append({
                "name": vendor.name,
                "total_clients": total_clients,
                "housed_count": housed,
                "housing_rate": round(housing_rate, 1),
                "avg_days_to_housing": round(avg_days, 1)
            })

        context["vendor_performance"] = vendor_stats

        # Overall system metrics
        all_clients_result = await db.execute(
            select(Client).where(Client.organization_id == organization_id)
        )
        all_clients = all_clients_result.scalars().all()

        context["total_clients"] = len(all_clients)
        context["total_housed"] = len([c for c in all_clients if c.status == "housed"])
        context["overall_housing_rate"] = round(
            (context["total_housed"] / context["total_clients"] * 100) if context["total_clients"] > 0 else 0,
            1
        )

        # Acuity distribution
        acuity_counts = {}
        for client in all_clients:
            acuity = client.acuity_level or "unknown"
            acuity_counts[acuity] = acuity_counts.get(acuity, 0) + 1

        context["acuity_distribution"] = acuity_counts

        # Recent trends (last 30 days)
        thirty_days_ago = date.today() - timedelta(days=30)
        recent_intakes = len([c for c in all_clients if c.intake_date and c.intake_date >= thirty_days_ago])
        recent_housed = len([c for c in all_clients if c.housed_date and c.housed_date >= thirty_days_ago])

        context["recent_trends"] = {
            "intakes_last_30d": recent_intakes,
            "housed_last_30d": recent_housed
        }

        return context

    async def _generate_ai_insight(
        self,
        question: str,
        context_data: Dict[str, Any],
        organization_id: int
    ) -> Dict[str, Any]:
        """Generate strategic insight using Claude 4.5 with RAG context."""

        # Build context string from data
        context_str = self._format_context_for_ai(context_data)

        system_prompt = """You are a strategic advisor for homeless services systems.
You specialize in analyzing vendor performance, identifying inefficiencies, and recommending
data-driven policy changes to improve housing outcomes.

Your recommendations must be:
- Evidence-based using the provided data
- Specific and actionable
- Fiscally responsible
- Focused on maximizing housing placements
- Respectful of vendor partnerships while holding them accountable

Always cite specific data points in your answers.
When recommending changes, include potential impact estimates."""

        user_prompt = f"""Question from City Administrator:
{question}

Current System Data:
{context_str}

Provide a comprehensive answer with:
1. Direct answer to the question
2. Supporting data analysis
3. 2-4 specific, actionable recommendations
4. Potential risks or considerations

Format your response as JSON:
{{
  "answer": "Your comprehensive answer",
  "key_insights": ["Insight 1", "Insight 2"],
  "recommendations": [
    {{
      "title": "Recommendation title",
      "description": "Detailed recommendation",
      "impact": "Expected impact with metrics",
      "priority": "high|medium|low"
    }}
  ],
  "data_citations": ["Data point 1", "Data point 2"],
  "confidence_score": 85
}}"""

        # Call Claude API
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2500,
            temperature=0.3,  # Lower temp for more factual responses
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )

        # Parse response
        response_text = message.content[0].text

        # Extract JSON
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text.strip()

        result = json.loads(json_str)

        # Add metadata
        result["generated_at"] = datetime.now().isoformat()
        result["model"] = "claude-sonnet-4"
        result["question"] = question
        result["organization_id"] = organization_id

        logger.info(f"AI strategic insight generated for org {organization_id}")

        return result

    def _generate_rule_based_insight(
        self,
        question: str,
        context_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Fallback: Generate rule-based insights when AI is unavailable.
        Uses simple pattern matching and heuristics.
        """
        question_lower = question.lower()

        # Vendor performance question
        if any(word in question_lower for word in ["vendor", "performance", "compare", "best", "worst"]):
            vendors = context_data.get("vendor_performance", [])
            if vendors:
                sorted_vendors = sorted(vendors, key=lambda v: v["housing_rate"], reverse=True)
                best = sorted_vendors[0]
                worst = sorted_vendors[-1]

                return {
                    "answer": f"Based on current data, {best['name']} is the top performer with a {best['housing_rate']}% housing rate and {best['avg_days_to_housing']} average days to housing. {worst['name']} has the lowest performance at {worst['housing_rate']}% housing rate with {worst['avg_days_to_housing']} days to housing.",
                    "key_insights": [
                        f"{best['name']} houses clients {best['housing_rate'] - worst['housing_rate']:.1f}% more successfully",
                        f"Performance gap suggests different service models or client acuity",
                        f"{worst['name']} may need additional support or contract restructuring"
                    ],
                    "recommendations": [
                        {
                            "title": "Conduct Performance Audit",
                            "description": f"Analyze why {worst['name']} underperforms compared to {best['name']}. Examine client acuity match, staffing ratios, and service delivery models.",
                            "impact": "Could improve overall system housing rate by 5-10%",
                            "priority": "high"
                        },
                        {
                            "title": "Best Practice Sharing",
                            "description": f"Facilitate knowledge transfer from {best['name']} to lower-performing vendors through quarterly workshops.",
                            "impact": "Improved vendor capabilities, higher success rates",
                            "priority": "medium"
                        }
                    ],
                    "data_citations": [
                        f"{best['name']}: {best['housing_rate']}% housing rate",
                        f"{worst['name']}: {worst['housing_rate']}% housing rate",
                        f"Total vendors analyzed: {len(vendors)}"
                    ],
                    "confidence_score": 75,
                    "generated_at": datetime.now().isoformat(),
                    "model": "rule_based",
                    "question": question
                }

        # Cost/budget question
        elif any(word in question_lower for word in ["cost", "budget", "money", "save", "reduce"]):
            total_clients = context_data.get("total_clients", 0)
            vendors = context_data.get("vendor_performance", [])

            return {
                "answer": f"Your system is currently serving {total_clients} clients across {len(vendors)} vendors. Cost optimization opportunities exist through performance-based contract allocation and reducing days-to-housing.",
                "key_insights": [
                    "Every day a client remains unhoused costs approximately $150-200 in services",
                    "High-performing vendors achieve housing faster, reducing total costs",
                    "Contract reallocation can yield 15-25% cost savings without reducing services"
                ],
                "recommendations": [
                    {
                        "title": "Performance-Based Contract Allocation",
                        "description": "Reallocate 20% of contracts from lowest-performing vendors to highest-performing over 12 months.",
                        "impact": "Estimated $500K-1.2M annual savings with improved outcomes",
                        "priority": "high"
                    },
                    {
                        "title": "Days-to-Housing Bonus Incentive",
                        "description": "Implement bonus payments for vendors who house clients under 45 days, funded by savings from reduced service days.",
                        "impact": "Accelerated housing placements, neutral cost impact",
                        "priority": "medium"
                    }
                ],
                "data_citations": [
                    f"Total clients served: {total_clients}",
                    f"Active vendors: {len(vendors)}",
                    "Industry benchmark: $150-200/day service cost"
                ],
                "confidence_score": 70,
                "generated_at": datetime.now().isoformat(),
                "model": "rule_based",
                "question": question
            }

        # General fallback
        else:
            return {
                "answer": f"I can help analyze vendor performance, cost optimization, housing outcomes, and system efficiency. Please ask a more specific question about these topics.",
                "key_insights": [
                    f"System overview: {context_data.get('total_clients', 0)} total clients",
                    f"Overall housing rate: {context_data.get('overall_housing_rate', 0)}%",
                    f"Active vendors: {len(context_data.get('vendor_performance', []))}"
                ],
                "recommendations": [],
                "data_citations": [],
                "confidence_score": 50,
                "generated_at": datetime.now().isoformat(),
                "model": "rule_based",
                "question": question
            }

    def _format_context_for_ai(self, context_data: Dict[str, Any]) -> str:
        """Format context data into readable string for AI prompt."""
        lines = []

        # System overview
        lines.append(f"=== SYSTEM OVERVIEW ===")
        lines.append(f"Total Clients: {context_data.get('total_clients', 0)}")
        lines.append(f"Total Housed: {context_data.get('total_housed', 0)}")
        lines.append(f"Overall Housing Rate: {context_data.get('overall_housing_rate', 0)}%")
        lines.append("")

        # Recent trends
        trends = context_data.get('recent_trends', {})
        lines.append(f"=== RECENT TRENDS (Last 30 Days) ===")
        lines.append(f"New Intakes: {trends.get('intakes_last_30d', 0)}")
        lines.append(f"Housed: {trends.get('housed_last_30d', 0)}")
        lines.append("")

        # Vendor performance
        lines.append(f"=== VENDOR PERFORMANCE ===")
        vendors = context_data.get('vendor_performance', [])
        for vendor in sorted(vendors, key=lambda v: v.get('housing_rate', 0), reverse=True):
            lines.append(f"{vendor['name']}:")
            lines.append(f"  - Total Clients: {vendor['total_clients']}")
            lines.append(f"  - Housed: {vendor['housed_count']}")
            lines.append(f"  - Housing Rate: {vendor['housing_rate']}%")
            lines.append(f"  - Avg Days to Housing: {vendor['avg_days_to_housing']}")
            lines.append("")

        # Acuity distribution
        acuity = context_data.get('acuity_distribution', {})
        if acuity:
            lines.append(f"=== CLIENT ACUITY DISTRIBUTION ===")
            for level, count in acuity.items():
                lines.append(f"{level.capitalize()}: {count}")
            lines.append("")

        return "\n".join(lines)
