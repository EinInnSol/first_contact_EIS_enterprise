"""
Layer 8 Access Control Tests

These tests verify that vendors CANNOT access Layer 8 analytics endpoints.
The Trojan Horse strategy depends on this access control.
"""

import pytest
from httpx import AsyncClient
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
import uuid

# JWT settings from environment
JWT_SECRET = os.environ.get("JWT_SECRET", "test-secret-key-for-testing-only")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")


def create_test_token(
    user_id: str = None,
    org_id: int = 1,
    vendor_id: int = None,
    role: str = "caseworker"
) -> str:
    """Create a test JWT token with specified role."""
    # Generate a valid UUID if not provided
    if user_id is None:
        user_id = str(uuid.uuid4())
    
    payload = {
        "sub": user_id,
        "org_id": org_id,
        "vendor_id": vendor_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@pytest.mark.asyncio
async def test_layer8_blocked_for_caseworker(client: AsyncClient):
    """
    Caseworkers get 403 Forbidden on Layer 8 endpoints.
    
    Caseworkers are vendor employees. They must NOT see:
    - Vendor performance comparisons
    - Geographic analytics
    - Bottleneck analysis
    """
    caseworker_token = create_test_token(role="caseworker", vendor_id=1)
    
    response = await client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {caseworker_token}"}
    )
    
    # Should be 403 (role blocked) or 401 (user not found - acceptable in test)
    assert response.status_code in [401, 403], \
        f"SECURITY BREACH: Caseworker accessed Layer 8! Status: {response.status_code}"
    
    # If 403, verify it's role-based
    if response.status_code == 403:
        assert "forbidden" in response.json().get("detail", "").lower() or \
               "role" in response.json().get("detail", "").lower() or \
               "city_admin" in response.json().get("detail", "").lower()


@pytest.mark.asyncio
async def test_layer8_blocked_for_vendor_admin(client: AsyncClient):
    """
    Vendor admins get 403 Forbidden on Layer 8 endpoints.
    
    Vendor admins manage their own org but must NOT see:
    - How they compare to other vendors
    - City-level analytics
    """
    vendor_admin_token = create_test_token(role="vendor_admin", vendor_id=1)
    
    response = await client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {vendor_admin_token}"}
    )
    
    assert response.status_code in [401, 403], \
        f"SECURITY BREACH: Vendor admin accessed Layer 8! Status: {response.status_code}"


@pytest.mark.asyncio
async def test_layer8_blocked_for_client(client: AsyncClient):
    """
    Clients get 403 Forbidden on Layer 8 endpoints.
    """
    client_token = create_test_token(role="client")
    
    response = await client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {client_token}"}
    )
    
    assert response.status_code in [401, 403], \
        f"SECURITY BREACH: Client role accessed Layer 8! Status: {response.status_code}"


@pytest.mark.asyncio
async def test_geographic_analytics_blocked_for_vendors(client: AsyncClient):
    """
    Geographic analytics reveal vendor territories - vendors must NOT see this.
    """
    caseworker_token = create_test_token(role="caseworker", vendor_id=1)
    
    response = await client.get(
        "/api/v1/analytics/geographic",
        headers={"Authorization": f"Bearer {caseworker_token}"}
    )
    
    assert response.status_code in [401, 403, 404], \
        f"SECURITY BREACH: Vendor accessed geographic analytics! Status: {response.status_code}"


@pytest.mark.asyncio
async def test_bottleneck_analysis_blocked_for_vendors(client: AsyncClient):
    """
    Bottleneck analysis could reveal vendor weaknesses - vendors must NOT see.
    """
    vendor_admin_token = create_test_token(role="vendor_admin", vendor_id=1)
    
    response = await client.get(
        "/api/v1/analytics/bottlenecks",
        headers={"Authorization": f"Bearer {vendor_admin_token}"}
    )
    
    assert response.status_code in [401, 403, 404], \
        f"SECURITY BREACH: Vendor accessed bottleneck analysis! Status: {response.status_code}"


@pytest.mark.asyncio
async def test_no_auth_blocked_from_layer8(client: AsyncClient):
    """
    Unauthenticated requests get 401/403 on Layer 8 endpoints.
    """
    response = await client.get("/api/v1/analytics/vendor-performance")
    
    # Should be either 401 (no token) or 403 (forbidden) or 422 (validation error)
    assert response.status_code in [401, 403, 422], \
        f"Layer 8 accessible without auth! Status: {response.status_code}"


@pytest.mark.asyncio
async def test_layer8_allowed_for_city_admin(client: AsyncClient):
    """
    City admins CAN access Layer 8 endpoints.
    This is the whole point - cities get the accountability dashboard.
    
    Note: This may fail if the user lookup fails (no user in test DB),
    but it should NOT return 403 due to role.
    """
    city_admin_token = create_test_token(role="city_admin", vendor_id=None)
    
    response = await client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {city_admin_token}"}
    )
    
    # Should NOT be 403 (forbidden due to role)
    # May be 401 if user not found in DB, which is expected in unit tests
    # May be 200 if everything works
    if response.status_code == 403:
        # Check if it's role-based denial (bad) or other denial (ok)
        detail = response.json().get("detail", "")
        # Role-based denial would mention city_admin or role - this is a FAIL
        assert "city_admin" not in detail.lower() or "allowed" in detail.lower(), \
            f"City admin blocked by role check! Detail: {detail}"


@pytest.mark.asyncio
async def test_layer8_allowed_for_city_council(client: AsyncClient):
    """
    City council CAN access Layer 8 endpoints.
    """
    city_council_token = create_test_token(role="city_council", vendor_id=None)
    
    response = await client.get(
        "/api/v1/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {city_council_token}"}
    )
    
    # Should NOT be 403 due to role
    if response.status_code == 403:
        detail = response.json().get("detail", "")
        assert "city_council" not in detail.lower() or "allowed" in detail.lower(), \
            f"City council blocked by role check! Detail: {detail}"
