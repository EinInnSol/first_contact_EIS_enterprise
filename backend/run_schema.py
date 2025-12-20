"""
Run schema against Cloud SQL PostgreSQL
"""
import psycopg2
from pathlib import Path

# Connection details - via Cloud SQL Proxy
DB_HOST = "127.0.0.1"  # Proxy runs locally
DB_NAME = "firstcontact"
DB_USER = "firstcontact_app"
DB_PASSWORD = "FCeis2025!Secure"
DB_PORT = 5432

# Read schema file
schema_path = Path(__file__).parent.parent / "database" / "schema.sql"
schema_sql = schema_path.read_text()

print(f"Connecting to {DB_HOST}:{DB_PORT}/{DB_NAME}...")

try:
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    print("Connected! Running schema...")
    
    # Execute schema
    cursor.execute(schema_sql)
    
    print("Schema executed successfully!")
    
    # Verify tables created
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    print(f"\nTables created ({len(tables)}):")
    for table in tables:
        print(f"  - {table[0]}")
    
    # Verify RLS enabled
    cursor.execute("""
        SELECT tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' AND rowsecurity = true;
    """)
    rls_tables = cursor.fetchall()
    print(f"\nRLS enabled on ({len(rls_tables)} tables):")
    for table in rls_tables:
        print(f"  - {table[0]}")
    
    # Verify seed data
    cursor.execute("SELECT COUNT(*) FROM organizations;")
    org_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM vendors;")
    vendor_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM qr_locations;")
    qr_count = cursor.fetchone()[0]
    
    print(f"\nSeed data:")
    print(f"  - Organizations: {org_count}")
    print(f"  - Vendors: {vendor_count}")
    print(f"  - QR Locations: {qr_count}")
    
    cursor.close()
    conn.close()
    print("\n✅ Database setup complete!")

except Exception as e:
    print(f"❌ Error: {e}")
    raise
