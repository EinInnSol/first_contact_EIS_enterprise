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
    
    with open("docs/DATABASE_SCHEMA.sql", "r") as f:
        schema_sql = f.read()

    # Manual split because pg8000/sqlalchemy execute() doesn't like multiple statements in one call usually
    # And we want to handle errors per block
    
    # Simple semantic splitter: split by ";" but respect logic.
    # The file has CREATE TABLE, INSERT, etc.
    # We will split by semicolon, filter empty, and run.
    # We will skip key extensions if they fail or just ignore.
    
    # Better approach: Read the file, replace the extensions lines with empty if we already did them, 
    # but actually the 'IF NOT EXISTS' should handle it.
    
    # The issue might be specific pg8000/sqlalchemy handling of the entire script.
    # Let's clean the SQL: remove comments and split carefully.
    
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

    with pool.connect() as conn:
        for i, stmt in enumerate(statements):
            # Skip empty
            if not stmt.strip():
                continue
                
            try:
                # print(f"Executing stmt {i}...") # Too verbose
                conn.execute(text(stmt))
                conn.commit()
            except Exception as e:
                print(f"Error executing statement {i}:\n{stmt[:100]}...\nError: {e}")
                # Decide to stop or continue? 
                # If it's "relation already exists", we might want to continue (idempotency)
                if "already exists" in str(e):
                    print("Ignoring 'already exists' error.")
                else:
                    raise e
        
    print("Schema applied.")
    connector.close()

if __name__ == "__main__":
    asyncio.run(main())
