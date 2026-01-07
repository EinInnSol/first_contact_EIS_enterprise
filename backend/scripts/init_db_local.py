#!/usr/bin/env python3
"""
Local Database Initialization Script
Connects to Cloud SQL via the deployed API endpoint
"""

import asyncio
import httpx
import sys

API_URL = "https://firstcontact-api-403538493221.us-east5.run.app"


async def init_via_api():
    """Initialize database by calling the API's internal init endpoint."""
    
    print("=" * 60)
    print("🚀 First Contact E.I.S. - Database Initialization")
    print("=" * 60)
    print()
    print(f"📡 Connecting to API: {API_URL}")
    print()
    
    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            # Call the health endpoint first
            print("🔍 Checking API health...")
            response = await client.get(f"{API_URL}/health")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.json()}")
            print()
            
            # Now we need to create an init endpoint in the API
            # For now, let's just verify the API is accessible
            print("✅ API is accessible!")
            print()
            print("⚠️  Next step: We need to add an /init endpoint to the API")
            print("   that will run the database initialization.")
            print()
            
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return False


if __name__ == "__main__":
    success = asyncio.run(init_via_api())
    sys.exit(0 if success else 1)
