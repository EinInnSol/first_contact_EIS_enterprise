import asyncio
import os
from google.cloud.sql.connector import Connector, IPTypes
import sqlalchemy
from sqlalchemy import text

# Configuration
INSTANCE_CONNECTION_NAME = "einharjer-valhalla:us-east5:first-contact-db"
DB_USER = "postgres"
DB_PASS = "postgres"  # We set this earlier
DB_NAME = "firstcontact"

async def main():
    # Initialize Connector
    connector = Connector()

    def getconn():
        conn = connector.connect(
            INSTANCE_CONNECTION_NAME,
            "pg8000",
            user=DB_USER,
            password=DB_PASS,
            db=DB_NAME,
            ip_type=IPTypes.PUBLIC,
        )
        return conn

    # Create connection pool
    pool = sqlalchemy.create_engine(
        "postgresql+pg8000://",
        creator=getconn,
    )

    print("Connecting to database...")
    
    # Read Schema
    with open("docs/DATABASE_SCHEMA.sql", "r") as f:
        schema_sql = f.read()

    # Split into statements (rough split by ;) for better error handling, 
    # but pgcrypto functions often use ; inside $$ blocks.
    # Ideally we execute the whole block if the driver supports it.
    # pg8000 might prefer single statements, but let's try execution block first.
    
    print("Applying schema...")
    with pool.connect() as db_conn:
        with db_conn.begin(): # Transaction
             # Remove extensions from SQL file since they require superuser/special handling often
             # or handle them separately.
             # Actually, Cloud SQL postgres user is usually not superuser but has Create Role/DB.
             # Extensions: uuid-ossp, pgcrypto. These usually require flags or come pre-installed.
             # Let's try running it.
             
             # We need to execute the sql. 
             # SQLAlchemy text() might handle multiple statements if supported by driver,
             # but pg8000 is strict.
             # Let's try to execute as one big block first.
             try:
                db_conn.execute(text(schema_sql))
                print("Schema applied successfully!")
             except Exception as e:
                print(f"Error applying schema block: {e}")
                print("Retrying statement by statement (naive split)...")
                # This is risky with stored procs but let's see.
                statements = schema_sql.split(';')
                for stmt in statements:
                    if stmt.strip():
                        try:
                            db_conn.execute(text(stmt))
                        except Exception as inner_e:
                            print(f"Failed statement: {stmt[:50]}... Error: {inner_e}")
                            raise inner_e

    connector.close()
    print("Done.")

if __name__ == "__main__":
    asyncio.run(main())
