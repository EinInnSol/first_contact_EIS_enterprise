
import asyncio
import sys
from sqlalchemy import text
from app.database import async_session

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def test_rls_mechanism():
    print("🧪 Testing RLS Session Variable Mechanism...")
    
    async with async_session() as session:
        # 1. Set the variable
        org_id = 999
        await session.execute(text(f"SELECT set_config('app.current_org_id', '{org_id}', false)"))
        
        # 2. Read it back
        result = await session.execute(text("SELECT current_setting('app.current_org_id', true)"))
        val = result.scalar()
        
        print(f"   Set: {org_id}")
        print(f"   Got: {val}")
        
        if str(val) == str(org_id):
            print("   ✅ Mechanism Works!")
        else:
            print("   ❌ Mechanism Failed.")

if __name__ == "__main__":
    asyncio.run(test_rls_mechanism())
