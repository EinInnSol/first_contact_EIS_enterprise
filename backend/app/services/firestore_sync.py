"""
Firestore Sync Service - The real-time nervous system link.
"""

import logging
from typing import Dict, Any, Optional
import os

logger = logging.getLogger(__name__)

# Try to import Firestore, but make it optional for deployment
try:
    from google.cloud import firestore_v1 as firestore
    FIRESTORE_AVAILABLE = True
except ImportError:
    logger.warning("Firestore not available - real-time sync disabled")
    FIRESTORE_AVAILABLE = False
    firestore = None

class FirestoreSyncService:
    """
    Manages real-time data push to Caseworker and City dashboards.
    
    This ensures that when the AI 'Brain' makes a recommendation, 
    the UI 'Pulses' instantly.
    """
    
    def __init__(self, project_id: Optional[str] = None):
        if not FIRESTORE_AVAILABLE:
            logger.warning("FirestoreSyncService initialized but Firestore is not available")
            self.db = None
            return
        self.db = firestore.Client(project=project_id or os.getenv("GOOGLE_CLOUD_PROJECT"))

    async def publish_recommendation(self, organization_id: str, recommendation: Dict[str, Any]):
        """
        Pushes a new AI recommendation to the organization's real-time feed.
        """
        if not self.db:
            logger.debug("Firestore unavailable - skipping recommendation publish")
            return None
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
        if not self.db:
            logger.debug("Firestore unavailable - skipping vendor status update")
            return
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
        if not self.db:
            logger.debug("Firestore unavailable - skipping system event")
            return
        try:
            doc_ref = self.db.collection("organizations").document(organization_id).collection("events").document()
            doc_ref.set({
                "type": event_type,
                "message": message,
                "timestamp": firestore.SERVER_TIMESTAMP
            })
        except Exception as e:
            logger.error(f"FIRESTORE: Failed to push system event: {str(e)}")
