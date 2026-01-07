
import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

async def check_data():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT count(*) FROM clients"))
        count = result.scalar()
        print(f"Client Count: {count}")
        
        if count > 0:
            result = await conn.execute(text("SELECT first_name, last_name FROM clients WHERE first_name IN ('Maria', 'Robert')"))
            rows = result.fetchall()
            print(f"Found specific demo clients: {rows}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_data())
