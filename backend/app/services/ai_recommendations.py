"""
AI Recommendations Service - Strategic Insights Using Claude

Generates vendor-specific insights, service gap analysis,
and contract optimization recommendations.
"""

from typing import Dict, List, Optional
import anthropic
import os

from app.models.vendor import Vendor
from app.models.client import Client


class AIRecommendationsService:
    """
    Generates strategic recommendations using Claude Haiku 4.5.
    
    This is the "Calling Audibles" feature - AI suggests policy
    and contract changes based on Layer 8 data.
    """
    
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        self.model = "claude-haiku-4-20250514"
    
    async def generate_vendor_insights(
        self,
        vendor_name: str,
        performance_data: Dict
    ) -> List[str]:
        """
        Generate AI insights for a specific vendor.
        
        Returns list of insight strings for display in vendor panel.
        """
        prompt = f"""Analyze this vendor's performance data and provide 2-3 brief strategic insights.

Vendor: {vendor_name}

Performance Metrics:
- Housing Rate: {performance_data.get('housing_rate', 0):.0%}
- 6-Month Retention: {performance_data.get('retention_6mo', 0):.0%}
- Cost Per Outcome: ${performance_data.get('cost_per_outcome', 0):,}
- Average Days to Housing: {performance_data.get('avg_days_to_housing', 0):.0f}
- Rank: #{performance_data.get('rank', 0)} out of total vendors

Provide actionable insights in bullet points. Each insight should be 1-2 sentences.
Focus on what the city should do with this data."""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=300,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            response_text = message.content[0].text
            
            # Parse bullet points
            insights = [
                line.strip().lstrip('•-*').strip()
                for line in response_text.split('\n')
                if line.strip() and len(line.strip()) > 10
            ]
            
            return insights[:3]  # Max 3 insights
            
        except Exception as e:
            # Fallback to rule-based insights
            return self._generate_rule_based_insights(vendor_name, performance_data)
    
    def _generate_rule_based_insights(
        self,
        vendor_name: str,
        perf: Dict
    ) -> List[str]:
        """Fallback rule-based insights if AI fails."""
        insights = []
        
        housing_rate = perf.get('housing_rate', 0)
        retention = perf.get('retention_6mo', 0)
        cost = perf.get('cost_per_outcome', 0)
        rank = perf.get('rank', 0)
        
        # Cost efficiency
        if cost < 30000:
            insights.append(f"{vendor_name} delivers excellent cost efficiency at ${cost:,} per outcome. Consider expanding their contract.")
        elif cost > 60000:
            insights.append(f"At ${cost:,} per outcome, {vendor_name} is 2-3x more expensive than top performers. Contract review recommended.")
        
        # Housing rate
        if housing_rate > 0.70:
            insights.append(f"Strong {housing_rate:.0%} housing placement rate indicates effective client engagement and resource coordination.")
        elif housing_rate < 0.40:
            insights.append(f"Housing rate of {housing_rate:.0%} is below industry benchmark. Additional support or performance improvement plan needed.")
        
        # Retention
        if retention > 0.80:
            insights.append(f"Exceptional {retention:.0%} retention rate demonstrates sustainable outcomes and strong follow-up services.")
        elif retention < 0.60:
            insights.append(f"Retention rate of {retention:.0%} suggests clients may need more intensive stabilization support post-housing.")
        
        # Overall rank
        if rank == 1:
            insights.append(f"{vendor_name} is the top-performing vendor. Model contract structure for other vendors.")
        
        return insights[:3]
    
    async def generate_system_recommendations(
        self,
        all_vendor_performance: List[Dict]
    ) -> List[Dict]:
        """
        Generate system-wide strategic recommendations.
        
        Returns list of recommendation objects with:
        - title: Brief summary
        - description: Full explanation
        - impact: Estimated impact (e.g., "47 additional placements annually")
        - priority: high, medium, low
        """
        # Find best and worst performers
        sorted_vendors = sorted(
            all_vendor_performance,
            key=lambda x: x.get('efficiency_score', 0),
            reverse=True
        )
        
        best = sorted_vendors[0] if sorted_vendors else None
        worst = sorted_vendors[-1] if len(sorted_vendors) > 1 else None
        
        recommendations = []
        
        # Contract reallocation recommendation
        if best and worst:
            cost_diff = worst['cost_per_outcome'] - best['cost_per_outcome']
            if cost_diff > 20000:
                potential_savings = cost_diff * worst['total_clients']
                additional_placements = int(potential_savings / best['cost_per_outcome'])
                
                recommendations.append({
                    "title": f"Reallocate funding from {worst['vendor_name']} to {best['vendor_name']}",
                    "description": f"{worst['vendor_name']} costs ${worst['cost_per_outcome']:,} per outcome vs {best['vendor_name']}'s ${best['cost_per_outcome']:,}. Reallocating 30% of {worst['vendor_name']}'s contract could fund {additional_placements} additional placements at the same total cost.",
                    "impact": f"~{additional_placements} additional placements annually",
                    "priority": "high",
                    "type": "contract_optimization"
                })
        
        # Performance improvement opportunities
        for vendor in sorted_vendors:
            if vendor.get('retention_6mo', 0) < 0.65:
                recommendations.append({
                    "title": f"{vendor['vendor_name']}: Implement retention support program",
                    "description": f"6-month retention rate of {vendor['retention_6mo']:.0%} is below 65% benchmark. Clients may need intensive case management post-housing. Consider requiring weekly check-ins for first 90 days.",
                    "impact": "Could improve retention by 10-15 percentage points",
                    "priority": "medium",
                    "type": "performance_improvement"
                })
        
        # Service expansion for top performers
        for vendor in sorted_vendors[:2]:  # Top 2
            if vendor.get('efficiency_score', 0) > 75:
                recommendations.append({
                    "title": f"{vendor['vendor_name']}: Expand service capacity",
                    "description": f"Efficiency score of {vendor['efficiency_score']}/100 demonstrates strong performance. Expanding their client capacity could maximize return on investment.",
                    "impact": "Potential to serve 20-30% more clients effectively",
                    "priority": "medium",
                    "type": "capacity_expansion"
                })
        
        return recommendations[:5]  # Max 5 recommendations
    
        return gaps

    async def generate_orchestration_narrative(
        self,
        event_type: str,
        client_profile: Dict,
        recommendation: Dict
    ) -> List[str]:
        """
        Generate human-like reasoning for an automated recommendation.
        
        This is the "AI reasoning" layer that explains the deterministic decisions.
        """
        prompt = f"""You are the 'Brain' of First Contact E.I.S., an AI-powered human services nervous system. 
Explain the reasoning behind this automated recommendation to a caseworker.

EVENT: {event_type}
CLIENT: {client_profile.get('name')}
PATHWAY: {recommendation.get('summary')}

FACTORS ANALYZED:
{chr(10).join([f"- {r}" for r in recommendation.get('reasoning', [])])}

TASK: Provide 2-3 brief, professional bullet points explaining why this is the optimal pathway.
Include a compassionate tone and focus on the client's stability.
Do not mention 'deterministic rules' or 'AI' - speak as a core coordination system.
"""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=250,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            response_text = message.content[0].text
            
            # Parse bullet points
            insights = [
                line.strip().lstrip('•-*').strip()
                for line in response_text.split('\n')
                if line.strip() and len(line.strip()) > 5
            ]
            
            return insights[:3]
            
        except Exception as e:
            # Fallback to the original reasoning if AI fails
            return recommendation.get('reasoning', [])
