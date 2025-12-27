"""
QR Intake Tests

These tests verify the core innovation:
1. Client scans QR code
2. System looks up location
3. Client auto-assigned to correct vendor
"""

import pytest
import uuid
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.models.organization import Organization
from app.models.vendor import Vendor
from app.models.qr_location import QRLocation
from app.models.client import Client
from app.database import set_tenant_context


@pytest.mark.asyncio
async def test_qr_intake_assigns_correct_vendor(
    client: AsyncClient,
    db: AsyncSession,
    test_org: Organization,
    test_vendor: Vendor,
    test_qr_location: QRLocation
):
    """
    Client scans QR code -> auto-assigned to vendor that owns the location.
    This is THE CORE INNOVATION of the platform.
    """
    response = await client.post(
        f"/api/v1/intake/qr/{test_qr_location.id}",
        json={
            "first_name": "Marcus",
            "last_name": "Thompson"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["success"] == True
    assert data["assigned_vendor"] == test_vendor.name
    assert "case_number" in data
    assert "client_id" in data


@pytest.mark.asyncio
async def test_qr_intake_returns_404_for_invalid_location(client: AsyncClient):
    """Invalid QR location ID should return 404."""
    response = await client.post(
        "/api/v1/intake/qr/invalid-location-id",
        json={
            "first_name": "Test",
            "last_name": "User"
        }
    )
    
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_qr_intake_creates_client_record(
    client: AsyncClient,
    db: AsyncSession,
    test_org: Organization,
    test_vendor: Vendor,
    test_qr_location: QRLocation
):
    """
    QR intake should create a client record in the database.
    """
    # Use unique name to avoid conflicts
    unique_last = f"Johnson-{uuid.uuid4().hex[:8]}"
    
    response = await client.post(
        f"/api/v1/intake/qr/{test_qr_location.id}",
        json={
            "first_name": "Sarah",
            "last_name": unique_last,
            "phone": "555-1234"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    client_id = data.get("client_id")
    
    assert client_id is not None, "Response should include client_id"
    
    # Query using the returned client_id
    result = await db.execute(
        select(Client).where(Client.id == uuid.UUID(client_id))
    )
    created_client = result.scalar_one_or_none()
    
    assert created_client is not None, f"Client with id {client_id} should exist"
    assert created_client.last_name == unique_last
    assert created_client.organization_id == test_org.id
    assert created_client.assigned_vendor_id == test_vendor.id
    assert created_client.intake_qr_location_id == test_qr_location.id


@pytest.mark.asyncio
async def test_qr_scan_increments_location_counter(
    client: AsyncClient,
    db: AsyncSession,
    test_qr_location: QRLocation
):
    """
    Each QR scan should increment the scan_count on the location.
    This data powers Layer 8 geographic analytics.
    """
    # Get initial count by querying directly
    result = await db.execute(
        select(QRLocation).where(QRLocation.id == test_qr_location.id)
    )
    location = result.scalar_one()
    initial_count = location.scan_count or 0
    
    # Perform intake
    response = await client.post(
        f"/api/v1/intake/qr/{test_qr_location.id}",
        json={
            "first_name": "Test",
            "last_name": f"Counter-{uuid.uuid4().hex[:8]}"
        }
    )
    
    assert response.status_code == 200
    
    # Query fresh from database to get updated count
    await db.execute(text("SELECT 1"))  # Force session sync
    result = await db.execute(
        select(QRLocation).where(QRLocation.id == test_qr_location.id)
    )
    updated_location = result.scalar_one()
    
    assert updated_location.scan_count == initial_count + 1, \
        f"Expected scan_count to be {initial_count + 1}, got {updated_location.scan_count}"


@pytest.mark.asyncio
async def test_qr_intake_inactive_location_rejected(
    client: AsyncClient,
    db: AsyncSession,
    test_org: Organization,
    test_vendor: Vendor
):
    """Inactive QR locations should reject intake attempts."""
    # Create inactive location with unique ID
    location_id = f"inactive-{uuid.uuid4().hex[:8]}"
    inactive_location = QRLocation(
        id=location_id,
        organization_id=test_org.id,
        vendor_id=test_vendor.id,
        name="Inactive Location",
        active=False
    )
    db.add(inactive_location)
    await db.flush()  # Flush to make visible in same transaction
    
    response = await client.post(
        f"/api/v1/intake/qr/{location_id}",
        json={
            "first_name": "Test",
            "last_name": "User"
        }
    )
    
    assert response.status_code == 400
