"""
Orchestration Engine - The "Brain" of the human services industry.
"""

import logging
import uuid
from typing import Optional, Any, Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.models.orchestration_event import OrchestrationEvent
from app.services.ai_recommendations import AIRecommendationsService
from app.services.business_rules import BenefitRules, HousingPathwayRules
from app.services.firestore_sync import FirestoreSyncService
from app.services.scheduling_service import SchedulingService
from app.models.client import Client
from sqlalchemy import select

logger = logging.getLogger(__name__)

class OrchestrationEngine:
    """
    Highly efficient, trigger-based orchestration engine.
    
    Implements the 90% automation / 10% human-in-the-loop principle.
    Uses deterministic rules for 95% of logic to keep costs near zero.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ai_service = AIRecommendationsService()
        self.scheduling_service = SchedulingService(db)
        self.firestore = FirestoreSyncService()
        # In the future, Firestore client will be initialized here
        
    async def trigger_event(
        self,
        event_type: str,
        organization_id: int,
        client_id: Optional[uuid.UUID] = None,
        vendor_id: Optional[int] = None,
        payload: Optional[Dict[str, Any]] = None,
        priority: int = 1
    ) -> OrchestrationEvent:
        """
        Public entry point to trigger the nervous system.
        """
        event = OrchestrationEvent(
            id=uuid.uuid4(),
            event_type=event_type,
            organization_id=organization_id,
            client_id=client_id,
            vendor_id=vendor_id,
            payload=payload or {},
            priority=priority,
            processed=False
        )
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        
        logger.info(f"Triggered orchestration event: {event_type} for client {client_id}")
        
        # Immediate processing (Low Latency)
        await self.process_event(event)
        
        return event

    async def process_event(self, event: OrchestrationEvent):
        """
        The core orchestration logic.
        """
        try:
            # 1. Rules-Based Logic (Deterministic, Free)
            recommendation = await self._apply_deterministic_rules(event)
            
            # 2. AI Reasoning (Generative, Paid - only if needed or for narrative)
            if self._requires_ai_reasoning(event, recommendation):
                ai_insights = await self._generate_ai_narative(event, recommendation)
                if recommendation:
                    recommendation['reasoning'].extend(ai_insights)
            
            # 3. Store and Notify
            if recommendation:
                await self._publish_recommendation(event, recommendation)
            
            # 4. Mark Complete
            event.processed = True
            await self.db.commit()
            
        except Exception as e:
            logger.error(f"Orchestration failure for event {event.id}: {str(e)}")
            await self.db.rollback()

    async def _apply_deterministic_rules(self, event: OrchestrationEvent) -> Optional[Dict[str, Any]]:
        """
        TIER 1 logic: Business rules and deterministic optimization.
        """
        if event.event_type == "appointment_cancelled":
            # Tier 1: Find replacement candidates
            candidates = await self.scheduling_service.find_best_replacement_for_cancellation(
                appointment_type=event.payload.get("appointment_type", "General"),
                datetime_slot=datetime.fromisoformat(event.payload.get("slot_time")) if event.payload.get("slot_time") else datetime.now(),
                organization_id=event.organization_id,
                vendor_id=event.vendor_id
            )
            
            if not candidates:
                return None
                
            top_candidate = candidates[0]
            
            return {
                "type": "appointment_swap",
                "summary": f"Bump {top_candidate['name']} to cancelled slot?",
                "priority": "high",
                "reasoning": [
                    f"Cancelled slot identified: {event.payload.get('appointment_type', 'General')}",
                    f"Top candidate {top_candidate['name']} has urgency {top_candidate['urgency']}/15",
                    f"Wait time reduced by ~{top_candidate.get('wait_days', 0)} days"
                ],
                "actions": [
                    {"action": "swap_appointment", "details": {
                        "original_event": str(event.id),
                        "client_id": str(top_candidate['client_id']),
                        "client_name": top_candidate['name']
                    }}
                ]
            }
        
        # Example: Benefit opportunity detection
        if event.event_type == "intake_completed":
            # Fetch client data for rules engine
            stmt = select(Client).where(Client.id == event.client_id)
            result = await self.db.execute(stmt)
            client = result.scalar_one_or_none()
            
            if not client:
                return None
                
            # Simulate VI-SPDAT lookup (in real app, this would be from the payload or client record)
            vi_spdat_score = event.payload.get("vi_spdat_score", 0)
            
            # TIER 1: Deterministic Pathway Recommendation
            pathway = HousingPathwayRules.recommend_pathway(vi_spdat_score, {})
            
            # TIER 1: Benefit Sequencing
            # For now, recommend base sequence for any low-income homeless person
            sequence = BenefitRules.recommend_application_sequence(["calfresh", "medi_cal", "gr", "ssi"])
            
            return {
                "type": "care_plan_generation",
                "summary": f"AI Care Plan: {client.first_name} {client.last_name}",
                "priority": "high",
                "reasoning": [
                    f"Pathway: {pathway['name']} ({pathway['reasoning']})",
                    "Immediate Action: Expedited CalFresh & Medi-Cal Application"
                ],
                "actions": [
                    {"action": "generate_pathway", "details": {"pathway": pathway['pathway']}},
                    {"action": "schedule_dpss", "details": {"timeline": "Next 48h"}}
                ]
            }
            
        return None

    def _requires_ai_reasoning(self, event: OrchestrationEvent, recommendation: Optional[Dict]) -> bool:
        """Determines if we need to spend tokens on Claude."""
        if not recommendation:
            return False
            
        # We always use AI for Care Plans and high-priority swaps to provide the "Human-Like" reasoning
        if recommendation['type'] in ['care_plan_generation', 'appointment_swap']:
            return True
            
        return False

    async def _generate_ai_narative(self, event: OrchestrationEvent, recommendation: Optional[Dict]) -> List[str]:
        """
        TIER 2 logic: Use Claude to explain the "Why".
        """
        if not recommendation:
            return []
            
        # Build client profile for the prompt
        client_profile = {
            "name": event.payload.get("first_name", "the client")
        }
        
        return await self.ai_service.generate_orchestration_narrative(
            event_type=event.event_type,
            client_profile=client_profile,
            recommendation=recommendation
        )

    async def _publish_recommendation(self, event: OrchestrationEvent, recommendation: Dict[str, Any]):
        """
        Publishes the recommendation to external systems (Firestore, SMS, etc.)
        """
        # 1. Push to Real-Time Dashboard via Firestore
        await self.firestore.publish_recommendation(
            organization_id=str(event.organization_id),
            recommendation=recommendation
        )
        
        # 2. Log to system alerts/database if needed
        logger.info(f"ORCHESTRATOR: Published {recommendation.get('type')} recommendation")
