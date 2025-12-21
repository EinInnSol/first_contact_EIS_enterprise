"""
Self-Learning Service - Tracks feedback and improves the AI Brain.
"""

import logging
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class SelfLearningService:
    """
    The 'Self-Improvement' layer of the platform.
    Analyses how humans interact with AI suggestions to retrain/refine logic.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def record_feedback(
        self, 
        recommendation_id: str, 
        user_action: str, 
        notes: str = None,
        modifications: Dict[str, Any] = None
    ):
        """
        Logs feedback on an AI recommendation.
        - user_action: approved, rejected, modified
        """
        # In a real app, this would update a 'recommendation_feedback' table
        logger.info(f"SELF-LEARNING: Recorded {user_action} for REC {recommendation_id}")
        
        # simulated DB insert
        # await self.db.execute(...)
        
        if user_action == "modified":
            await self._analyze_modifications(recommendation_id, modifications)

    async def _analyze_modifications(self, recommendation_id: str, modifications: Dict[str, Any]):
        """
        Identifies discrepancies between AI output and human expertise.
        """
        logger.info(f"SELF-LEARNING: Analyzing human modifications for REC {recommendation_id}")
        # Logic to identify if specific rules or prompt patterns caused the modification

    async def get_accuracy_metrics(self) -> Dict[str, Any]:
        """
        Computes system-wide performance scores.
        """
        # Simulated calculation
        return {
            "approval_rate": 0.92, # Target is 90%+
            "modification_rate": 0.05,
            "rejection_rate": 0.03,
            "top_reason_for_mod": "Scheduling conflict with transport",
            "last_refined_at": datetime.utcnow().isoformat()
        }

    async def suggest_rule_refinements(self) -> List[Dict[str, str]]:
        """
        AI Analyser suggests updates to deterministic rules based on aggregate feedback.
        """
        return [
            {"target": "BenefitRules", "suggestion": "Increase wait-time weight for GR applications in Sector 7"},
            {"target": "SchedulingService", "suggestion": "Add 15m buffer for transport in Downtown during peak hours"}
        ]
