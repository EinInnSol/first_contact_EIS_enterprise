"""
Executor Service - Performs the actions decreed by the AI Brain.
"""

import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import asyncio

logger = logging.getLogger(__name__)

class ExecutorService:
    """
    Takes approved recommendations and executes their constituent actions.
    
    This is the "Hands" of the human services nervous system.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def execute_recommendation(self, recommendation_id: str, actions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes a sequence of actions from a recommendation.
        """
        results = []
        start_time = datetime.utcnow()
        
        logger.info(f"Executing recommendation {recommendation_id} with {len(actions)} actions")
        
        for action in actions:
            action_type = action.get("action")
            action_details = action.get("details", {})
            try:
                result = await self.dispatch_action(action_type, action_details)
                results.append({"action": action_type, "status": "completed", "result": result})
            except Exception as e:
                logger.error(f"Action {action_type} failed: {str(e)}")
                results.append({"action": action_type, "status": "failed", "error": str(e)})
                # Depending on priority, we might want to halt the rest of the sequence
        
        end_time = datetime.utcnow()
        execution_time_ms = int((end_time - start_time).total_seconds() * 1000)
        
        return {
            "recommendation_id": recommendation_id,
            "results": results,
            "execution_time_ms": execution_time_ms,
            "completed_at": end_time.isoformat()
        }

    async def dispatch_action(self, action_type: str, details: Dict[str, Any]) -> Any:
        """
        Routes an action type to the specific implementation.
        """
        if action_type == "send_sms":
            return await self._send_sms(details)
        elif action_type == "book_appointment":
            return await self._book_appointment(details)
        elif action_type == "swap_appointment":
            return await self._swap_appointment(details)
        elif action_type == "generate_pathway":
            return await self._generate_pathway(details)
        else:
            logger.warning(f"No executor found for action type: {action_type}")
            return {"status": "unsupported", "action": action_type}

    async def _send_sms(self, details: Dict[str, Any]) -> Dict[str, str]:
        """Simulates Twilio integration."""
        message = details.get("message")
        recipient = details.get("recipient")
        logger.info(f"EXECUTOR: Sending SMS to {recipient}: {message}")
        await asyncio.sleep(0.1) # Simulating API latency
        return {"status": "sent", "provider": "twilio_mock", "sid": "SM" + str(datetime.timestamp(datetime.now()))}

    async def _book_appointment(self, details: Dict[str, Any]) -> Dict[str, str]:
        """Performs internal DB update or external provider booking."""
        logger.info(f"EXECUTOR: Booking appointment: {details}")
        await asyncio.sleep(0.2)
        return {"status": "booked", "id": "APP" + str(datetime.timestamp(datetime.now()))}

    async def _swap_appointment(self, details: Dict[str, Any]) -> Dict[str, str]:
        """Handles the complex logic of swapping clients in a slot."""
        logger.info(f"EXECUTOR: Swapping appointment: {details}")
        # In real app: Update db, Notify Original (cancellation confirmed), Notify New (booked)
        await self._send_sms({
            "recipient": "client_phone_placeholder",
            "message": f"Good news! Your appointment has been moved up to today at 2pm."
        })
        return {"status": "swapped"}

    async def _generate_pathway(self, details: Dict[str, Any]) -> Dict[str, str]:
        """Triggers the creation of a full Care Plan document."""
        logger.info(f"EXECUTOR: Generating Care Plan Pathway: {details}")
        return {"status": "generated", "pathway": details.get("pathway")}
