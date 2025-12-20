import asyncio
from sqlalchemy import text
from app.database import engine

async def check():
    async with engine.connect() as conn:
        r = await conn.execute(text("SELECT id, active FROM qr_locations WHERE id = 'inactive-location'"))
        print("Result:", r.fetchall())

asyncio.run(check())
