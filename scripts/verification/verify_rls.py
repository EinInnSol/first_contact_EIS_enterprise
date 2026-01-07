"""Quick RLS verification script"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://firstcontact_app:FCeis2025!Secure@127.0.0.1:5432/firstcontact"

async def test_rls():
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.connect() as conn:
        # Set tenant context to org 1
        await conn.execute(text("SET app.organization_id = '1'"))
        
        # Query vendors - should only see org 1's vendors
        result = await conn.execute(text("SELECT id, name, organization_id FROM vendors"))
        rows = result.fetchall()
        print(f"With org_id=1, found {len(rows)} vendors:")
        for row in rows:
            print(f"  ID={row[0]}, Name={row[1]}, OrgID={row[2]}")
        
        # Now set to org 999 (doesn't exist)
        await conn.execute(text("SET app.organization_id = '999'"))
        result2 = await conn.execute(text("SELECT id, name, organization_id FROM vendors"))
        rows2 = result2.fetchall()
        print(f"\nWith org_id=999, found {len(rows2)} vendors")
        
        if len(rows2) == 0:
            print("\n[SUCCESS] RLS IS WORKING! Org 999 sees no data.")
        else:
            print("\n[FAILURE] RLS NOT WORKING! Org 999 should see 0 vendors.")
        
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_rls())
