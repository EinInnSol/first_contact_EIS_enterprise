"""
First Contact E.I.S. - Main FastAPI Application

This is the entry point for the backend API.

API Structure:
- PUBLIC: /intake/* - QR intake (no auth)
- AUTH: /auth/* - Login/register
- LAYERS 1-7: /clients/*, /benefits/*, /orchestrator/* - Vendor access
- LAYER 8: /analytics/*, /maps/* - City admin only (THE TROJAN HORSE)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, init_db

# Import all models to register them with SQLAlchemy
from app.models import (
    Organization, Vendor, User, UserRole,
    QRLocation, QRScanEvent, Client
)

from app.middleware import OrganizationMiddleware
from app.api.v1 import auth, intake, analytics, clients, benefits, orchestrator, maps


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print("=" * 60)
    print("🚀 FIRST CONTACT E.I.S. - Starting...")
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    print(f"🔗 Database: {settings.DB_HOST or 'default'}")
    print("=" * 60)
    
    # Initialize database connection
    try:
        await init_db()
        print("✅ Database connection established")
    except Exception as e:
        print(f"⚠️ Database connection warning: {e}")
        print("   (API will still start - some endpoints may fail)")
    
    print("=" * 60)
    print("📋 API ENDPOINTS:")
    print("  PUBLIC (No Auth):")
    print("    POST /api/v1/intake/qr/{qr_id} - QR intake")
    print("  AUTH:")
    print("    POST /api/v1/auth/login")
    print("    POST /api/v1/auth/register")
    print("  LAYERS 1-7 (Vendor Access):")
    print("    GET/PATCH /api/v1/clients/*")
    print("    GET/POST /api/v1/clients/{id}/benefits/*")
    print("    GET/POST /api/v1/orchestrator/*")
    print("  LAYER 8 (City Admin Only):")
    print("    GET /api/v1/analytics/* - Vendor performance")
    print("    GET /api/v1/maps/* - Geographic intelligence")
    print("=" * 60)
    print("🟢 First Contact E.I.S. API is READY")
    print("=" * 60)
    
    yield
    
    # Shutdown
    print("👋 Shutting down First Contact E.I.S. API...")


app = FastAPI(
    title="First Contact E.I.S.",
    description="""
## AI Orchestration Platform for Homeless Services Coordination

### The Trojan Horse Strategy
- **Layers 1-7**: Free efficiency software for vendors (they love it!)
- **Layer 8**: Hidden accountability dashboard for cities (they mandate it!)

### Key Features
- QR code intake with auto vendor assignment
- Benefit stack optimization (SSI, CalFresh, GR, IHSS)
- "Calling Audibles" - AI recommendations with one-click approval
- Vendor performance analytics (Layer 8 - cities only)
- Geographic intelligence with map visualization

### The Innovation
Vendors adopt voluntarily because it saves them 3+ hours daily.
Cities see Layer 8 and mandate adoption for ALL vendors.
**That's the Trojan Horse.**
    """,
    version="0.1.0",
    lifespan=lifespan
)


# CORS middleware - allow all for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Organization context middleware (for RLS)
app.add_middleware(OrganizationMiddleware)


# ============================================
# PUBLIC ROUTES (No Auth Required)
# ============================================
app.include_router(
    intake.router,
    prefix="/api/v1",
    tags=["Public - QR Intake"]
)


# ============================================
# AUTH ROUTES
# ============================================
app.include_router(
    auth.router,
    prefix="/api/v1",
    tags=["Authentication"]
)


# ============================================
# LAYERS 1-7 (Vendor Access)
# ============================================
app.include_router(
    clients.router,
    prefix="/api/v1",
    tags=["Layers 1-7 - Clients"]
)

app.include_router(
    benefits.router,
    prefix="/api/v1",
    tags=["Layers 1-7 - Benefits"]
)

app.include_router(
    orchestrator.router,
    prefix="/api/v1",
    tags=["Layers 1-7 - Orchestrator (Calling Audibles)"]
)


# ============================================
# LAYER 8 (City Admin Only - THE TROJAN HORSE)
# ============================================
app.include_router(
    analytics.router,
    prefix="/api/v1",
    tags=["Layer 8 - Analytics (City Admin Only)"]
)

app.include_router(
    maps.router,
    prefix="/api/v1",
    tags=["Layer 8 - Map Data (City Admin Only)"]
)



# ============================================
# HEALTH & INFO ENDPOINTS
# ============================================
@app.get("/")
async def root():
    """Root endpoint - service info and API overview."""
    return {
        "service": "First Contact E.I.S.",
        "tagline": "The Trojan Horse for Homeless Services",
        "description": "AI Orchestration Platform for Homeless Services Coordination",
        "status": "operational",
        "version": "0.1.0",
        "docs": "/docs",
        "trojan_horse": {
            "layers_1_7": "Free efficiency software vendors love",
            "layer_8": "Hidden accountability dashboard cities mandate"
        },
        "endpoints": {
            "public": [
                "POST /api/v1/intake/qr/{qr_id} - QR intake (auto-assigns to vendor)"
            ],
            "auth": [
                "POST /api/v1/auth/login",
                "POST /api/v1/auth/register"
            ],
            "layers_1_7": [
                "GET /api/v1/clients",
                "GET /api/v1/clients/{id}/benefits",
                "POST /api/v1/orchestrator/recommendations"
            ],
            "layer_8_city_only": [
                "GET /api/v1/analytics/vendor-performance",
                "GET /api/v1/analytics/geographic",
                "GET /api/v1/analytics/bottlenecks",
                "GET /api/v1/maps/vendor-territories",
                "GET /api/v1/maps/qr-locations",
                "GET /api/v1/maps/client-density",
                "GET /api/v1/maps/performance-overlay"
            ]
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run and monitoring."""
    return {
        "status": "healthy",
        "service": "first-contact-eis",
        "version": "0.1.0"
    }
