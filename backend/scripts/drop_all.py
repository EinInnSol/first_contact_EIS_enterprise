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
    
    tables = [
        "compliance_reports",
        "vendor_performance_metrics",
        "case_plan_actions", 
        "case_plans",
        "benefit_stack_projections",
        "client_benefit_enrollments",
        "benefit_programs",
        "clients",
        "qr_scan_events",
        "qr_locations",
        "vendor_territories",
        "users",
        "vendors",
        "organizations"
    ]
    
    print("Dropping tables...")
    for table in tables:
        try:
            cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
            print(f"Dropped {table}")
        except Exception as e:
            print(f"Error dropping {table}: {e}")
            
    print("Done dropping tables.")
    conn.close()
    connector.close()

if __name__ == "__main__":
    asyncio.run(main())
