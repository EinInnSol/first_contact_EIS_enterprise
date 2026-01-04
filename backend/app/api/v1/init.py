"""
Database initialization endpoint - ONE-TIME USE ONLY
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db, Base, engine
from app.services.pilot_seeder import PilotSeederService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Safety flag - set to True after first successful init
_INITIALIZED = False


@router.post("/init-database")
async def initialize_database(db: AsyncSession = Depends(get_db)):
    """
    ONE-TIME database initialization endpoint.
    Creates all tables and seeds demo data.
    
    ⚠️ WARNING: This should only be called ONCE during initial deployment.
    """
    global _INITIALIZED
    
    if _INITIALIZED:
        raise HTTPException(
            status_code=400,
            detail="Database already initialized. This endpoint can only be called once."
        )
    
    try:
        logger.info("=" * 60)
        logger.info("🚀 Starting database initialization...")
        logger.info("=" * 60)
        
        # Create all tables
        logger.info("📋 Creating database tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Tables created")
        
        # Seed demo data
        logger.info("🌱 Seeding demo data...")
        seeder = PilotSeederService(db)
        await seeder.seed_pilot_data()
        logger.info("✅ Demo data seeded")
        
        _INITIALIZED = True
        
        logger.info("=" * 60)
        logger.info("🎉 Database initialization complete!")
        logger.info("=" * 60)
        
        return {
            "success": True,
            "message": "Database initialized successfully",
            "demo_credentials": {
                "email": "admin@longbeach.gov",
                "password": "demo123",
                "organization": "longbeach"
            },
            "app_url": "https://firstcontact-web-403538493221.us-east5.run.app"
        }
        
    except Exception as e:
        logger.error(f"❌ Initialization failed: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Initialization failed: {str(e)}")
