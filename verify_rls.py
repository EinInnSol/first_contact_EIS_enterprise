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

    print("--- STARTING RLS VERIFICATION ---")

    # 1. Setup Test Data (Need to bypass RLS to insert foundations? 
    # Or insert as a superuser/admin that has bypassrls or just insert correctly)
    # The 'postgres' user usually bypasses RLS if it is a superuser or table owner.
    # Owners bypass RLS by default in Postgres unless FORCE ROW LEVEL SECURITY is set.
    # Let's see if we can just insert directly.
    
    print("1. Creating Test Organizations and Vendors...")
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
        
        print(f"   Org A ID: {org_a_id}, Vendor A1 ID: {vendor_a1_id}")
        print(f"   Org B ID: {org_b_id}, Vendor B1 ID: {vendor_b1_id}")
    except Exception as e:
        print(f"Setup failed (maybe data exists): {e}")
        # Need IDs if they exist. Rough fetch:
        cursor.execute("SELECT id FROM organizations WHERE slug='test-org-a'")
        org_a_id = cursor.fetchone()[0]
        cursor.execute("SELECT id FROM organizations WHERE slug='test-org-b'")
        org_b_id = cursor.fetchone()[0]

    # 2. Insert Data while masquerading as Org A? 
    # Or just insert data generally (as owner) and then test SELECTs as a restricted role?
    # Since we are logging in as 'postgres' (owner), RLS is NOT applied by default unless we force it or use a non-owner role.
    # BUT, the `current_setting('app.organization_id')` is used in the policy.
    # If the policy is `USING (organization_id = ...)`
    # And we are owner, postgres ignores the policy.
    
    # CRITICAL: We need to test AS A APP USER would.
    # App users connect as 'postgres' (in this dev setup) but the App Code sets the session variable.
    # Wait, does owner bypass RLS? YES.
    # To test RLS with 'postgres' user, we need `ALTER TABLE ... FORCE ROW LEVEL SECURITY`.
    # OR create a least-privileged user `app_user` for the application to use.
    # Creating a dedicated app user is Best Practice.
    # But for now, let's try to FORCE RLS on a table or just assume we should test with a non-superuser.
    
    # Or, we create a user `test_user` with NOLOGIN? No.
    # Let's create a role `app_role` and `SET ROLE app_role` in the session.
    
    print("2. Setting up test role to verify RLS...")
    try:
        cursor.execute("CREATE ROLE app_user WITH LOGIN PASSWORD 'test'")
        cursor.execute("GRANT ALL PRIVILEGES ON DATABASE firstcontact TO app_user")
        # Grant permissions on schema/tables
        cursor.execute("GRANT USAGE ON SCHEMA public TO app_user")
        cursor.execute("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user")
        cursor.execute("GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user") # Important for SERIAL
    except Exception as e:
        print(f"Role setup note: {e}")

    # Now reconnect as `app_user` OR just `SET ROLE app_user` in this session?
    # `SET ROLE` works if the current user is member or superuser.
    
    cursor.execute("SET ROLE app_user")
    user = cursor.execute("SELECT current_user").fetchone()[0]
    print(f"   Current Role: {user}")
    
    # 3. Test: "Can query as Org A, cannot see Org B data"
    
    # A. Set Context to Org A
    print(f"3. Setting Session Context to Org A ({org_a_id})...")
    cursor.execute(f"SELECT set_config('app.organization_id', '{org_a_id}', false)")
    
    # B. Insert Client for Org A
    print("   Inserting Client for Org A...")
    try:
        # Note: We must include org_id in insert, and it must match the session var due to 'WITH CHECK' (implied by FOR ALL)
        cursor.execute(f"""
            INSERT INTO clients (
                organization_id, assigned_vendor_id, first_name, last_name, case_number
            ) VALUES (
                {org_a_id}, {vendor_a1_id}, 'Client', 'A', 'CASE-A-001'
            ) RETURNING id
        """)
        client_a_id = cursor.fetchone()[0]
        print(f"   Success: Created Client A ({client_a_id})")
    except Exception as e:
        print(f"   FAILED to insert Client A: {e}")

    # C. Try to Insert Client for Org B (SHOULD FAIL)
    print("4. Attempting to Insert Client for Org B (Should Fail)...")
    try:
        cursor.execute(f"""
            INSERT INTO clients (
                organization_id, assigned_vendor_id, first_name, last_name, case_number
            ) VALUES (
                {org_b_id}, {vendor_b1_id}, 'Client', 'B', 'CASE-B-001'
            ) RETURNING id
        """)
        print("   CRITICAL FAILURE: Was able to insert Org B data while authenticated as Org A!")
    except Exception as e:
        # Expected error: new row violates row-level security policy for table "clients"
        if "policy" in str(e) or "RLS" in str(e) or "new row violates row-level security policy" in str(e):
             print(f"   SUCCESS: Blocked insert for Org B. Error: {e}")
        else:
             print(f"   Unexpected error: {e}")

    # D. Query All Clients (Should only see Org A)
    print("5. Querying All Clients...")
    cursor.execute("SELECT id, organization_id, case_number FROM clients")
    rows = cursor.fetchall()
    
    found_org_b = False
    count_org_a = 0
    for row in rows:
        print(f"   Found Row: Org: {row[1]}, Case: {row[2]}")
        if row[1] == org_b_id:
            found_org_b = True
        if row[1] == org_a_id:
            count_org_a += 1
            
    if found_org_b:
        print("   CRITICAL FAILURE: Found Org B data!")
    else:
        print("   SUCCESS: Only Org A visible.")

    if count_org_a > 0:
        print("   Verified Org A data is visible.")
    else:
        print("   Warning: No Org A data found (Insert failed?)")
        
    print("--- RLS VERIFICATION COMPLETE ---")
    conn.close()
    connector.close()

if __name__ == "__main__":
    asyncio.run(main())
