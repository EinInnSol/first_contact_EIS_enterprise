
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_orchestrator():
    print("🔹 Authenticating as Admin...")
    try:
        login_resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@longbeach.gov",
            "password": "demo123",
            "organization_slug": "longbeach"
        })
        login_resp.raise_for_status()
        token_data = login_resp.json()
        token = token_data["access_token"]
        print(f"   ✅ Login Successful. Token obtained.")
    except Exception as e:
        print(f"   ❌ Login Failed: {e}")
        if 'login_resp' in locals():
            print(login_resp.text)
        sys.exit(1)

    headers = {"Authorization": f"Bearer {token}"}

    print("\n🔹 Requesting AI Recommendations (Calling Audibles)...")
    try:
        rec_resp = requests.get(f"{BASE_URL}/orchestrator/recommendations", headers=headers)
        rec_resp.raise_for_status()
        recs = rec_resp.json()
        
        print(f"   ✅ Success! Received {len(recs['recommendations'])} recommendations.")
        print("   Recent Recommendations:")
        for r in recs['recommendations']:
            print(f"    - [{r['confidence']*100:.0f}%] {r['type']}: {r['summary']}")
            if r['priority'] == 'urgent':
                print(f"      URGENT ACTION REQUIRED!")
    except Exception as e:
        print(f"   ❌ Orchestrator Failed: {e}")
        if 'rec_resp' in locals():
            print(rec_resp.text)

    print("\n🔹 Checking Self-Learning Stats...")
    try:
        stats_resp = requests.get(f"{BASE_URL}/orchestrator/stats", headers=headers)
        stats_resp.raise_for_status()
        stats = stats_resp.json()
        print(f"   ✅ Stats Retrieved.")
        print(f"   - Approx Time Saved: {stats['time_saved_hours']} hours")
        print(f"   - Approval Rate: {stats['approval_rate']*100}%")
    except Exception as e:
         print(f"   ❌ Stats Failed: {e}")

if __name__ == "__main__":
    test_orchestrator()
