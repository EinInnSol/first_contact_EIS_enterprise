import asyncio
import os
from google.cloud.sql.connector import Connector, IPTypes
import pg8000

# Configuration
INSTANCE_CONNECTION_NAME = "einharjer-valhalla:us-east5:first-contact-db"
DB_USER = "postgres"
DB_PASS = "postgres"
DB_NAME = "firstcontact"

async def main():
    connector = Connector()
    
    # Connect directly with pg8000 (no sqlalchemy)
    conn = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pg8000",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME,
        ip_type=IPTypes.PUBLIC,
    )
    
    conn.autocommit = True # Useful for some DDL, though not strictly required if we commit

    print("Connecting...")
    
    with open("docs/DATABASE_SCHEMA.sql", "r") as f:
        schema_sql = f.read()

    # Manual split
    statements = []
    current_statement = []
    
    for line in schema_sql.splitlines():
        if line.strip().startswith("--"):
            continue
        if not line.strip():
            continue
            
        current_statement.append(line)
        if line.strip().endswith(";"):
            statements.append("\n".join(current_statement))
            current_statement = []
    
    if current_statement:
         statements.append("\n".join(current_statement))

    print(f"Found {len(statements)} statements.")

    cursor = conn.cursor()
    
    for i, stmt in enumerate(statements):
        if not stmt.strip():
            continue
            
        # Basic filter for extensions if we want (optional)
        if "CREATE EXTENSION" in stmt and "uuid-ossp" in stmt:
            # We know we did this or might fail
            pass 

        try:
            cursor.execute(stmt)
        except Exception as e:
            print(f"Error executing statement {i}:\n{stmt[:100]}...\nError: {e}")
            if "already exists" in str(e) or "Duplicate" in str(e):
                print("Ignoring existence error.")
            else:
                # raise e # Don't raise, try to finish? No, RLS relies on tables.
                # If table create failed, next steps fail.
                # But if "relation exists", we continue.
                if "relation" in str(e) and "already exists" in str(e):
                    continue
                if "already exists" in str(e): # catch-all
                     continue
                raise e
    
    print("Schema applied successfully via raw cursor.")
    conn.close()
    connector.close()

if __name__ == "__main__":
    asyncio.run(main())
