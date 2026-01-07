import requests
import json
import sys
import asyncio
from google.cloud.sql.connector import Connector, IPTypes
import pg8000
import sqlalchemy
from sqlalchemy import text

# Configuration
INSTANCE_CONNECTION_NAME = "einharjer-valhalla:us-east5:first-contact-db"
DB_USER = "postgres"
DB_PASS = "postgres"
DB_NAME = "firstcontact"

BASE_URL = "https://first-contact-backend-4fmsifz77q-ul.a.run.app"
API_PREFIX = "/api/v1"

async def get_valid_slug():
    """Fetch the first valid organization slug from the DB."""
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
    
    slug = None
    with pool.connect() as conn:
        result = conn.execute(text("SELECT slug FROM organizations LIMIT 1"))
        row = result.fetchone()
        if row:
            slug = row[0]
            print(f"   Fetched Organization Slug: {slug}")
        else:
            print("   ERROR: No organizations found in DB!")
            
    connector.close()
    return slug

def test_auth_flow(org_slug):
    print(f"Testing against: {BASE_URL}")
    
    # 1. Register
    print(f"\n1. Registering City Admin for org '{org_slug}'...")
    reg_payload = {
        "email": "city.admin@test.com",
        "password": "securepassword123",
        "first_name": "City",
        "last_name": "Admin",
        "organization_slug": org_slug, # Fixed: Use slug, not ID
        "role": "city_admin"
    }
    
    # Try register
    resp = requests.post(f"{BASE_URL}{API_PREFIX}/auth/register", json=reg_payload)
    if resp.status_code == 200:
        print("   Registration successful.")
    elif resp.status_code == 400 and "already registered" in resp.text:
        print("   User already exists (expected if re-running).")
    else:
        print(f"   Registration FAILED: {resp.status_code} - {resp.text}")
        # sys.exit(1)

    # 2. Login
    print("\n2. Logging in...")
    # Fixed: Use custom JSON schema, not OAuth2 form
    login_payload = {
        "email": "city.admin@test.com",
        "password": "securepassword123",
        "organization_slug": org_slug
    }
    
    resp = requests.post(f"{BASE_URL}{API_PREFIX}/auth/login", json=login_payload)
    
    if resp.status_code != 200:
        print(f"   Login FAILED: {resp.status_code} - {resp.text}")
        sys.exit(1)
        
    token_data = resp.json()
    access_token = token_data.get("access_token")
    print("   Login successful. Token received.")
    print(f"   Token: {access_token[:20]}...")
    
    # 3. Access Protected Layer 8 Endpoint
    print("\n3. Accessing Protected Layer 8 Endpoint (City Only)...")
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    # Check vendor performance (this triggers DB RLS check too)
    resp = requests.get(f"{BASE_URL}{API_PREFIX}/analytics/vendor-performance", headers=headers)
    
    if resp.status_code == 200:
        print("   SUCCESS! Accessed Layer 8 data.")
        data = resp.json()
        print(f"   Data received: {len(data)} records")
        # print(json.dumps(data, indent=2))
    elif resp.status_code == 403:
        print("   FORBIDDEN (403). Role check failed?")
    else:
         print(f"   FAILED: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    slug = asyncio.run(get_valid_slug())
    if slug:
        test_auth_flow(slug)
