import asyncio
import os
from google.cloud.sql.connector import Connector, IPTypes
import sqlalchemy
from sqlalchemy import text

# Configuration
INSTANCE_CONNECTION_NAME = "einharjer-valhalla:us-east5:first-contact-db"
DB_USER = "postgres"
DB_PASS = "postgres"
DB_NAME = "firstcontact"

async def main():
    connector = Connector()
    def getconn():
        return connector.connect(
            INSTANCE_CONNECTION_NAME,
            "pg8000",
            user=DB_USER,
            password=DB_PASS,
            db=DB_NAME,
            ip_type=IPTypes.PUBLIC,
        )

    pool = sqlalchemy.create_engine(
        "postgresql+pg8000://",
        creator=getconn,
    )

    print("Connecting...")
    with pool.connect() as conn:
        print("Connected.")
        
        # Check version
        v = conn.execute(text("SELECT version()")).fetchone()
        print(f"Version: {v[0]}")
        
        # Try extensions
        extensions = ["uuid-ossp", "pgcrypto"]
        for ext in extensions:
            print(f"Trying to create extension {ext}...")
            try:
                # Use auto-commit for extensions if needed, though usually OK in transaction
                conn.execute(text(f'CREATE EXTENSION IF NOT EXISTS "{ext}"'))
                conn.commit()
                print(f"Extension {ext} created/verified.")
            except Exception as e:
                print(f"Error creating extension {ext}: {e}")
                # Don't re-raise, let's see which one fails

    connector.close()

if __name__ == "__main__":
    asyncio.run(main())
