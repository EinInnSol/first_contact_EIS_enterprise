import asyncio
import os
from google.cloud.sql.connector import Connector, IPTypes
import pg8000

# Configuration
INSTANCE_CONNECTION_NAME = "einharjer-valhalla:us-east5:first-contact-db"
DB_USER = "postgres"
DB_PASS = "postgres"
DB_NAME = "firstcontact"

APP_USER = "app_user"
APP_PASS = "test_pass_123"

async def main():
    connector = Connector()
    
    # 1. ADMIN CONNECTION: Setup Data & User
    print("--- 1. ADMIN SETUP (postgres) ---")
    conn = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pg8000",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME,
        ip_type=IPTypes.PUBLIC,
    )
    conn.autocommit = True
    cursor = conn.cursor()

    # Create Data
    try:
        # Org A
        cursor.execute("INSERT INTO organizations (name, slug, city, state) VALUES ('Test Org A', 'test-org-a', 'City A', 'CA') RETURNING id")
        org_a_id = cursor.fetchone()[0]
        cursor.execute(f"INSERT INTO vendors (organization_id, name, slug) VALUES ({org_a_id}, 'Vendor A1', 'vendor-a1') RETURNING id")
        vendor_a1_id = cursor.fetchone()[0]
        # Org B
        cursor.execute("INSERT INTO organizations (name, slug, city, state) VALUES ('Test Org B', 'test-org-b', 'City B', 'CA') RETURNING id")
        org_b_id = cursor.fetchone()[0]
        cursor.execute(f"INSERT INTO vendors (organization_id, name, slug) VALUES ({org_b_id}, 'Vendor B1', 'vendor-b1') RETURNING id")
        vendor_b1_id = cursor.fetchone()[0]
        print(f"   Created Org A: {org_a_id}, Org B: {org_b_id}")
    except Exception:
        # Fetch if exists
        cursor.execute("SELECT id FROM organizations WHERE slug='test-org-a'")
        org_a_id = cursor.fetchone()[0]
        cursor.execute("SELECT id FROM organizations WHERE slug='test-org-b'")
        org_b_id = cursor.fetchone()[0]
        cursor.execute(f"SELECT id FROM vendors WHERE slug='vendor-a1'")
        vendor_a1_id = cursor.fetchone()[0]
        cursor.execute(f"SELECT id FROM vendors WHERE slug='vendor-b1'")
        vendor_b1_id = cursor.fetchone()[0]
        print(f"   Fetched existing Org A: {org_a_id}, Org B: {org_b_id}")

    # Create/Update Role
    try:
        cursor.execute(f"CREATE ROLE {APP_USER} WITH LOGIN PASSWORD '{APP_PASS}'")
        print(f"   Created role {APP_USER}")
    except Exception as e:
        print(f"   Role {APP_USER} setup note: {e}")
        # Reset password to ensure we can login
        cursor.execute(f"ALTER ROLE {APP_USER} WITH PASSWORD '{APP_PASS}'")

    # Permissions
    cursor.execute(f"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {APP_USER}")
    cursor.execute(f"GRANT USAGE ON SCHEMA public TO {APP_USER}")
    cursor.execute(f"GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO {APP_USER}")
    cursor.execute(f"GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO {APP_USER}")
    
    conn.close()

    # 2. APP USER CONNECTION: Verify RLS
    print(f"--- 2. VERIFYING RLS (as {APP_USER}) ---")
    
    conn_app = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pg8000",
        user=APP_USER,
        password=APP_PASS,
        db=DB_NAME,
        ip_type=IPTypes.PUBLIC,
    )
    conn_app.autocommit = True
    cursor_app = conn_app.cursor()
    
    # A. Set Context to Org A
    print(f"   Setting Session Context to Org A ({org_a_id})...")
    cursor_app.execute(f"SELECT set_config('app.organization_id', '{org_a_id}', false)")
    
    # B. Insert Client for Org A
    print("   Inserting Client for Org A...")
    try:
        cursor_app.execute(f"""
            INSERT INTO clients (
                organization_id, assigned_vendor_id, first_name, last_name, case_number
            ) VALUES (
                {org_a_id}, {vendor_a1_id}, 'Client', 'A', 'CASE-A-002'
            ) RETURNING id
        """)
        client_a_id = cursor_app.fetchone()[0]
        print(f"   Success: Created Client A ({client_a_id})")
    except Exception as e:
        print(f"   FAILED to insert Client A: {e}")

    # C. Try to Insert Client for Org B (SHOULD FAIL)
    print("   Attempting to Insert Client for Org B (Should Fail)...")
    try:
        cursor_app.execute(f"""
            INSERT INTO clients (
                organization_id, assigned_vendor_id, first_name, last_name, case_number
            ) VALUES (
                {org_b_id}, {vendor_b1_id}, 'Client', 'B', 'CASE-B-002'
            ) RETURNING id
        """)
        print("   CRITICAL FAILURE: Was able to insert Org B data while authenticated as Org A!")
    except Exception as e:
        if "policy" in str(e) or "RLS" in str(e) or "row-level security" in str(e):
             print(f"   SUCCESS: Blocked insert for Org B. Error: {e}")
        else:
             print(f"   Unexpected error: {e}")

    # D. Query All Clients (Should only see Org A)
    print("   Querying All Clients...")
    cursor_app.execute("SELECT id, organization_id, case_number FROM clients")
    rows = cursor_app.fetchall()
    
    found_org_b = False
    count_org_a = 0
    for row in rows:
        # row[1] is org_id
        if row[1] == org_b_id:
            found_org_b = True
            print(f"   !! FOUND ORG B DATA: {row}")
        if row[1] == org_a_id:
            count_org_a += 1
            
    if found_org_b:
        print("   CRITICAL FAILURE: Found Org B data!")
    else:
        print("   SUCCESS: Only Org A visible.")

    if count_org_a > 0:
        print(f"   Verified Org A data is visible ({count_org_a} rows).")
    else:
        print("   Warning: No Org A data found.")
        
    conn_app.close()
    connector.close()

if __name__ == "__main__":
    asyncio.run(main())
