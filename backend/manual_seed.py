import asyncio
import sys
import os

# Ensure backend path is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# Add parent directory if run from inside backend
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from app.database import init_db, AsyncSessionLocal, engine, Base
from app.services.pilot_seeder import PilotSeederService

async def main():
    print("🚀 Starting Manual Pilot Seed...")
    
    # 1. Initialize Connection
    await init_db()
    
    # 2. Create Tables
    print("📋 Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created.")

    # 3. Seed Data
    async with AsyncSessionLocal() as session:
        seeder = PilotSeederService(session)
        await seeder.seed_pilot_data(organization_slug="city-of-long-beach")
        print("✅ Pilot Data Seeded Successfully!")
        
        # 3. Quick Verification Query
        from sqlalchemy import text
        result = await session.execute(text("SELECT count(*) FROM clients"))
        count = result.scalar()
        print(f"📊 Verification: Found {count} clients in database.")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
