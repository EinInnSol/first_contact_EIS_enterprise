"""
EventListener Service - The persistent 24/7 monitor for the human services nervous system.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.models.orchestration_event import OrchestrationEvent
from app.services.ai_recommendations import AIRecommendationsService

logger = logging.getLogger(__name__)


class EventListener:
    """
    24/7 Monitoring service that detects system events and triggers orchestration.
    
    This service runs in a continuous loop, querying for unprocessed OrchestrationEvents.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        # We will integrate the Orchestrator here once built.
        # For now, it will use the existing AIRecommendationsService as a placeholder.
        self.orchestrator = AIRecommendationsService(db)
        
    async def run_forever(self, interval_seconds: int = 5):
        """
        Main operation loop. 
        In production, this could be a separate background process or worker.
        """
        logger.info("Starting EventListener 24/7 monitor...")
        
        while True:
            try:
                processed_count = await self.process_pending_events()
                if processed_count > 0:
                    logger.info(f"EventListener processed {processed_count} events.")
                
                await asyncio.sleep(interval_seconds)
            except Exception as e:
                logger.error(f"Error in EventListener loop: {str(e)}")
                await asyncio.sleep(interval_seconds * 2) # Back off on error
                
    async def process_pending_events(self) -> int:
        """
        Queries for unprocessed events and triggers orchestration logic.
        """
        # 1. Fetch unprocessed events
        stmt = select(OrchestrationEvent).where(
            OrchestrationEvent.processed == False
        ).order_by(OrchestrationEvent.priority.desc(), OrchestrationEvent.created_at.asc())
        
        result = await self.db.execute(stmt)
        events = result.scalars().all()
        
        if not events:
            return 0
            
        for event in events:
            await self.orchestrate_event(event)
            
        return len(events)
        
    async def orchestrate_event(self, event: OrchestrationEvent):
        """
        The "Brain" logic for a single event.
        """
        logger.info(f"Orchestrating event: {event.event_type} ({event.id})")
        
        try:
            # Mark as being processed
            event.orchestration_triggered = True
            
            # TODO: Integrate with the true AI Orchestrator
            # This is where the 95% rules + 5% AI logic lives.
            
            # Example logic for placeholder:
            if event.event_type == "appointment_cancelled":
                # Logic to find replacement client
                pass
            elif event.event_type == "intake_completed":
                # Trigger care plan generation
                pass
                
            # Mark as processed
            event.processed = True
            await self.db.commit()
            
        except Exception as e:
            logger.error(f"Failed to orchestrate event {event.id}: {str(e)}")
            await self.db.rollback()
            # We could implement a retry counter here.

    @staticmethod
    async def create_event(
        db: AsyncSession,
        event_type: str,
        organization_id: int,
        client_id: Optional[str] = None,
        vendor_id: Optional[int] = None,
        priority: int = 1,
        payload: Optional[dict] = None
    ) -> OrchestrationEvent:
        """
        Helper to create a new event from anywhere in the system.
        """
        new_event = OrchestrationEvent(
            event_type=event_type,
            organization_id=organization_id,
            client_id=client_id,
            vendor_id=vendor_id,
            priority=priority,
            payload=payload or {},
            processed=False
        )
        db.add(new_event)
        await db.commit()
        await db.refresh(new_event)
        return new_event
