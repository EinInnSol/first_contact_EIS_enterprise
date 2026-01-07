
import requests
import json
import sys
from enum import Enum

# Configuration
BASE_URL = "http://localhost:8000/api/v1"

class UserRole(str, Enum):
    CITY_ADMIN = "city_admin"
    VENDOR_ADMIN = "vendor_admin"
    CASEWORKER = "caseworker"

def get_token(email, password, org_slug="longbeach"):
    print(f"   🔑 Authenticating as {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password,
            "organization_slug": org_slug
        })
        resp.raise_for_status()
        return resp.json()["access_token"]
    except Exception as e:
        print(f"      ❌ Login Failed: {e}")
        return None

def test_layer8_access(token, user_label, expected_behavior):
    if not token:
        return

    headers = {"Authorization": f"Bearer {token}"}
    print(f"\n   🕵️ Testing Layer 8 (Orchestrator) Access for [{user_label}]...")
    
    try:
        resp = requests.get(f"{BASE_URL}/orchestrator/recommendations", headers=headers)
        resp.raise_for_status()
        data = resp.json()
        
        recs = data.get("recommendations", [])
        meta = data.get("meta", {})
        
        print(f"      Response Code: {resp.status_code}")
        print(f"      Recs Found: {len(recs)}")
        print(f"      Meta: {meta}")

        if expected_behavior == "ACCESS_GRANTED":
            if len(recs) > 0:
                print("      ✅ PASS: Access Granted and Data Returned.")
            else:
                print("      ⚠️ WARNING: Access Granted but No Data (Could be valid if no recs generated yet).")
        
        elif expected_behavior == "STEALTH_HIDDEN":
            if len(recs) == 0 and meta.get("status") == "hidden":
                print("      ✅ PASS: Layer 8 Successfully Hidden (Trojan Horse Active).")
            else:
                print(f"      ❌ FAIL: Vendor saw data! Recs: {len(recs)}")
                
    except Exception as e:
        print(f"      ❌ Request Failed: {e}")

def run_security_audit():
    print("🔒 STARTING SECURITY AUDIT: PHASE 4 - IRONCLAD SECURITY")
    print("="*60)

    # 1. Test City Admin (Should See Everything)
    admin_token = get_token("admin@longbeach.gov", "demo123")
    test_layer8_access(admin_token, "CITY ADMIN", "ACCESS_GRANTED")

    # 2. Test Vendor Admin (Should See NOTHING)
    vendor_token = get_token("director@mhala.org", "demo123")
    test_layer8_access(vendor_token, "VENDOR ADMIN", "STEALTH_HIDDEN")

    print("\n" + "="*60)
    print("🔒 AUDIT COMPLETE")

if __name__ == "__main__":
    run_security_audit()
