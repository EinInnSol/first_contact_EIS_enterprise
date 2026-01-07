"""
Neural Nexus Service - The Autonomic Nervous System
"""

import logging
import uuid
import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.orchestration_event import OrchestrationEvent
from app.services.orchestration_engine import OrchestrationEngine

# Vertex AI
try:
    from anthropic import AnthropicVertex
except ImportError:
    AnthropicVertex = None

logger = logging.getLogger(__name__)

class NeuralNexusService:
    """
    Layer 9 Intelligence.
    Monitors system-wide patterns and triggers autonomic responses.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.orchestrator = OrchestrationEngine(db)
        
        # Initialize Vertex AI
        self.use_ai = False
        if AnthropicVertex:
            try:
                self.client = AnthropicVertex(
                    region=os.getenv("GCP_REGION", "us-east5"),
                    project_id=os.getenv("GCP_PROJECT_ID", "einharjer-valhalla")
                )
                self.model = "claude-3-5-sonnet@20240620"
                self.use_ai = True
                logger.info("Neural Nexus initialized with Vertex AI")
            except Exception as e:
                logger.warning(f"Failed to initialize Vertex AI for Nexus: {e}")

    async def run_system_scan(self, organization_id: int):
        """
        The "Heartbeat" of the nervous system. 
        Analyzes the last 60 minutes of events to find systemic issues.
        """
        logger.info(f"NEXUS: Scanning system vitality for Org {organization_id}")
        
        # 1. Gather Telemetry (The "Vitals")
        vitals = await self._gather_vitals(organization_id)
        
        # 2. AI Diagnosis
        if self.use_ai:
            diagnosis = await self._diagnose_system(vitals)
            
            # 3. Prescribe Interventions (if needed)
            if diagnosis.get("requires_intervention"):
                await self._execute_intervention(diagnosis, organization_id)
                return diagnosis
        
        return {"status": "nominal", "vitals": vitals}

    async def _gather_vitals(self, organization_id: int) -> Dict[str, Any]:
        """
        Query the database for system health metrics.
        """
        # Time window: Last 60 minutes
        window_start = datetime.utcnow() - timedelta(minutes=60)
        
        # Query: Count recent events by type
        stmt = select(
            OrchestrationEvent.event_type,
            func.count(OrchestrationEvent.id)
        ).where(
            OrchestrationEvent.organization_id == organization_id,
            OrchestrationEvent.created_at >= window_start
        ).group_by(OrchestrationEvent.event_type)
        
        result = await self.db.execute(stmt)
        event_counts = dict(result.all())
        
        return {
            "window_minutes": 60,
            "timestamp": datetime.utcnow().isoformat(),
            "event_counts": event_counts,
            # In a real system, we'd add queue depths, API latency, etc.
            "system_load": "moderate" if sum(event_counts.values()) > 50 else "low"
        }

    async def _diagnose_system(self, vitals: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ask Claude to analyze the vitals and find patterns.
        """
        prompt = f"""You are the 'Neural Nexus', an autonomic nervous system for a homeless services network.
        Analyze these system vitals (past 60 mins) and detect any patterns requiring intervention.
        
        VITALS:
        {json.dumps(vitals, indent=2)}
        
        RULES:
        - High 'appointment_cancelled' count (>5) suggests a transport or communication failure.
        - Zero 'intake_completed' events during business hours suggests a bottleneck.
        - High 'urgent_intervention' count means the system is stressed.
        
        OUTPUT (JSON):
        {{
            "status": "nominal" | "stressed" | "critical",
            "analysis": "Brief analysis string...",
            "requires_intervention": boolean,
            "intervention_plan": {{
                "type": "system_alert" | "rebalance_resources",
                "reason": "Why we are doing this",
                "suggested_action": "Description of action"
            }}
        }}"""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.content[0].text
            
            # Extract JSON
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text.strip()
                
            return json.loads(json_str)

        except Exception as e:
            logger.error(f"Nexus AI diagnosis failed: {e}")
            return {"status": "error", "requires_intervention": False}

    async def _execute_intervention(self, diagnosis: Dict, organization_id: int):
        """
        Trigger the Orchestrator to solve the systemic issue.
        """
        intervention = diagnosis.get("intervention_plan", {})
        
        logger.info(f"NEXUS: Executing intervention - {intervention.get('type')}")
        
        # Create a high-priority 'system_event'
        await self.orchestrator.trigger_event(
            event_type="system_intervention",
            organization_id=organization_id,
            priority=10, # Maximal priority
            payload={
                "diagnosis": diagnosis,
                "source": "NeuralNexus",
                "recommended_action": intervention.get("suggested_action")
            }
        )
