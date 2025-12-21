"""
Firestore Sync Service - The real-time nervous system link.
"""

import logging
from google.cloud import firestore
from typing import Dict, Any, Optional
import os

logger = logging.getLogger(__name__)

class FirestoreSyncService:
    """
    Manages real-time data push to Caseworker and City dashboards.
    
    This ensures that when the AI 'Brain' makes a recommendation, 
    the UI 'Pulses' instantly.
    """
    
    def __init__(self, project_id: Optional[str] = None):
        self.db = firestore.Client(project=project_id or os.getenv("GOOGLE_CLOUD_PROJECT"))

    async def publish_recommendation(self, organization_id: str, recommendation: Dict[str, Any]):
        """
        Pushes a new AI recommendation to the organization's real-time feed.
        """
        try:
            doc_ref = self.db.collection("organizations").document(organization_id).collection("recommendations").document()
            
            # Add timestamp and ID
            recommendation["id"] = doc_ref.id
            recommendation["created_at"] = firestore.SERVER_TIMESTAMP
            
            doc_ref.set(recommendation)
            logger.info(f"FIRESTORE: Published recommendation {doc_ref.id} for ORG {organization_id}")
            return doc_ref.id
        except Exception as e:
            logger.error(f"FIRESTORE: Failed to publish recommendation: {str(e)}")
            return None

    async def update_vendor_status(self, organization_id: str, vendor_id: str, status_update: Dict[str, Any]):
        """
        Updates vendor performance metrics in real-time on the map.
        """
        try:
            doc_ref = self.db.collection("organizations").document(organization_id).collection("vendors").document(vendor_id)
            doc_ref.set(status_update, merge=True)
            logger.info(f"FIRESTORE: Updated status for VENDOR {vendor_id}")
        except Exception as e:
            logger.error(f"FIRESTORE: Failed to update vendor status: {str(e)}")

    async def push_system_event(self, organization_id: str, event_type: str, message: str):
        """
        Pushes a system-wide 'Pulse' notification.
        """
        try:
            doc_ref = self.db.collection("organizations").document(organization_id).collection("events").document()
            doc_ref.set({
                "type": event_type,
                "message": message,
                "timestamp": firestore.SERVER_TIMESTAMP
            })
        except Exception as e:
            logger.error(f"FIRESTORE: Failed to push system event: {str(e)}")
