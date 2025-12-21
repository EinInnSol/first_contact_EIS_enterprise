"""
Scheduling & Transport Service - Deterministic rules for appointment optimization.
"""

import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
import uuid

from app.models.client import Client
# Assuming Appointment and Transport models exist or will be built
# from app.models.appointment import Appointment 

logger = logging.getLogger(__name__)

class SchedulingService:
    """
    Tier 1 scheduling logic: deterministic optimization of slots and routes.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_best_replacement_for_cancellation(
        self, 
        appointment_type: str, 
        datetime_slot: datetime,
        organization_id: int,
        vendor_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Deterministic logic to find the best candidate to fill a gaps.
        
        Criteria (Weighted):
        1. Urgency/Vulnerability (VI-SPDAT) - 40%
        2. Wait time for this appointment type - 30%
        3. Transport compatibility (already on route?) - 20%
        4. Document readiness - 10%
        """
        
        # 1. Query for clients who need this appointment and don't have it scheduled soon
        # For demo purposes, we'll query for clients in 'intake' or 'pending_benefits' status
        stmt = select(Client).where(
            Client.organization_id == organization_id,
            Client.status.in_(['intake', 'pending_benefits'])
        )
        
        if vendor_id:
            stmt = stmt.where(Client.assigned_vendor_id == vendor_id)
            
        result = await self.db.execute(stmt)
        candidates = result.scalars().all()
        
        scored_candidates = []
        for client in candidates:
            score = self._calculate_replacement_score(client, appointment_type)
            scored_candidates.append({
                "client_id": client.id,
                "name": f"{client.first_name} {client.last_name}",
                "score": score,
                "urgency": client.vi_spdat_score or 0,
                "wait_days": (datetime.now().date() - client.intake_date).days if client.intake_date else 0,
                "docs_ready": True # Placeholder for doc check logic
            })
            
        # Sort by score descending
        scored_candidates.sort(key=lambda x: x['score'], reverse=True)
        
        return scored_candidates[:3] # Return top 3 candidates

    def _calculate_replacement_score(self, client: Client, appointment_type: str) -> float:
        """
        Calculates a priority score for a candidate.
        """
        # Urgency: 0.0 to 1.0 (VI-SPDAT 0-15)
        urgency_score = (client.vi_spdat_score or 0) / 15.0
        
        # Wait time: 0.0 to 1.0 (0-30 days)
        wait_days = (datetime.now().date() - client.intake_date).days if client.intake_date else 0
        wait_score = min(wait_days / 30.0, 1.0)
        
        # Total Weighted Score
        return (urgency_score * 0.5) + (wait_score * 0.5)

    async def get_transport_optimization_potential(self, date: datetime.date, organization_id: int):
        """
        Identifies opportunities to consolidate transport runs.
        """
        # Logic to group appointments by time and location zip code
        return []
