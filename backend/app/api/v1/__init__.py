"""
API v1 package - All API routers.

Structure:
- auth: Login, register, token management
- intake: Public QR intake (no auth)
- clients: CRUD for clients (Layers 1-7)
- benefits: Benefit stack management (Layers 1-7)
- orchestrator: "Calling Audibles" (Layers 1-7)
- analytics: Layer 8 - City admin only (THE TROJAN HORSE)
"""

from app.api.v1 import auth, intake, clients, benefits, orchestrator, analytics, maps, ai_advisor

__all__ = ["auth", "intake", "clients", "benefits", "orchestrator", "analytics", "maps", "ai_advisor"]
