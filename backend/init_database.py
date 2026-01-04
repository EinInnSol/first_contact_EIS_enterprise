#!/usr/bin/env python3
"""
Database Initialization Script for First Contact E.I.S.
Runs migrations and seeds demo data for Cloud Run deployment.
"""

import asyncio
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.config import settings
from app.models import *  # Import all models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init_database():
    """Initialize database with tables and demo data."""
    
    logger.info("=" * 60)
    logger.info("🚀 First Contact E.I.S. - Database Initialization")
    logger.info("=" * 60)
    
    # Create async engine
    logger.info(f"📡 Connecting to database...")
    engine = create_async_engine(
        settings.database_url,
        echo=False,
        pool_pre_ping=True
    )
    
    try:
        # Create all tables
        logger.info("📋 Creating database tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Tables created successfully")
        
        # Create session for seeding
        async_session = sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        
        async with async_session() as session:
            # Import and run the seeder
            logger.info("🌱 Seeding demo data...")
            from app.services.pilot_seeder import PilotSeederService
            
            seeder = PilotSeederService(session)
            await seeder.seed_pilot_data()
            
            logger.info("✅ Demo data seeded successfully")
        
        logger.info("=" * 60)
        logger.info("🎉 Database initialization complete!")
        logger.info("=" * 60)
        logger.info("")
        logger.info("📋 Demo Credentials:")
        logger.info("   Email: admin@longbeach.gov")
        logger.info("   Password: demo123")
        logger.info("   Organization: longbeach")
        logger.info("")
        logger.info("🌐 Your app is ready at:")
        logger.info("   https://firstcontact-web-403538493221.us-east5.run.app")
        logger.info("=" * 60)
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        await engine.dispose()


if __name__ == "__main__":
    success = asyncio.run(init_database())
    sys.exit(0 if success else 1)
