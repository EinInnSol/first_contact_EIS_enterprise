"""
Multi-Tenant Architecture Tests

Tests verify:
1. Every model has organization_id
2. Queries properly filter by organization_id  
3. Data isolation works via RLS

Strategy: Use existing seed data where possible. For isolation tests,
set tenant context appropriately before operations.
"""

import pytest
import uuid
from sqlalchemy import select, inspect, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.organization import Organization
from app.models.vendor import Vendor
from app.models.client import Client
from app.models.user import User
from app.models.qr_location import QRLocation
from app.models.qr_scan_event import QRScanEvent
from app.database import set_tenant_context


def unique_suffix() -> str:
    """Generate unique suffix for tests."""
    return uuid.uuid4().hex[:8]


@pytest.mark.asyncio
async def test_all_models_have_organization_id(db: AsyncSession):
    """
    CRITICAL: Every tenant model MUST have organization_id.
    This is the foundation of multi-tenant architecture.
    """
    tenant_models = [Vendor, User, Client, QRLocation, QRScanEvent]
    
    for model in tenant_models:
        mapper = inspect(model)
        column_names = [c.key for c in mapper.columns]
        assert "organization_id" in column_names, \
            f"CRITICAL: {model.__name__} is missing organization_id column!"


@pytest.mark.asyncio
async def test_vendor_belongs_to_organization(db: AsyncSession):
    """Vendor must have organization_id set. Uses existing seeded data."""
    # Set context to Long Beach (org 1)
    await set_tenant_context(db, 1)
    
    # Query for PATH vendor
    result = await db.execute(
        select(Vendor).where(Vendor.id == 101)
    )
    vendor = result.scalar_one_or_none()
    
    assert vendor is not None, "PATH vendor (id=101) should exist in seed data"
    assert vendor.organization_id == 1, "Vendor should belong to Long Beach org"


@pytest.mark.asyncio
async def test_client_belongs_to_organization_and_vendor(db: AsyncSession):
    """Client must have both organization_id and vendor_id."""
    # Set context to Long Beach
    await set_tenant_context(db, 1)
    
    # Get existing vendor
    result = await db.execute(select(Vendor).where(Vendor.id == 101))
    vendor = result.scalar_one_or_none()
    
    assert vendor is not None, "PATH vendor should exist"
    
    # Create client using existing org and vendor
    client = Client(
        organization_id=1,
        assigned_vendor_id=vendor.id,
        first_name="Test",
        last_name=f"Client-{unique_suffix()}"
    )
    db.add(client)
    await db.commit()
    await db.refresh(client)
    
    assert client.organization_id == 1
    assert client.assigned_vendor_id == vendor.id


@pytest.mark.asyncio
async def test_query_filters_by_organization(db: AsyncSession):
    """
    Queries with organization_id filter work correctly.
    """
    # Set context to Long Beach
    await set_tenant_context(db, 1)
    
    # Query vendors for org 1 specifically
    result = await db.execute(
        select(Vendor).where(Vendor.organization_id == 1)
    )
    vendors = result.scalars().all()
    
    # Should have seeded vendors
    assert len(vendors) >= 4, f"Expected at least 4 vendors, got {len(vendors)}"
    
    # All should be org 1
    for v in vendors:
        assert v.organization_id == 1, "All vendors should be org 1"


@pytest.mark.asyncio
async def test_clients_isolated_by_organization(db: AsyncSession):
    """
    Clients from one org should not be visible when querying another org.
    """
    # First create a client in Long Beach (org 1)
    await set_tenant_context(db, 1)
    
    client_name = f"IsolationTest-{unique_suffix()}"
    client = Client(
        organization_id=1,
        assigned_vendor_id=101,  # PATH
        first_name="Isolation",
        last_name=client_name
    )
    db.add(client)
    await db.commit()
    
    # Verify it exists in org 1
    result = await db.execute(
        select(Client).where(Client.last_name == client_name)
    )
    found = result.scalar_one_or_none()
    assert found is not None, "Client should exist in org 1"
    
    # Now create a new org and check isolation
    # First, create org using raw SQL (orgs table has no RLS)
    new_slug = f"iso-org-{unique_suffix()}"
    await db.execute(text(
        "INSERT INTO organizations (name, slug, city, state) VALUES (:name, :slug, :city, :state)"
    ), {"name": "Isolation Org", "slug": new_slug, "city": "Test", "state": "CA"})
    await db.commit()
    
    # Get the new org ID
    result = await db.execute(text("SELECT id FROM organizations WHERE slug = :slug"), {"slug": new_slug})
    new_org_id = result.scalar()
    
    # Switch context to new org
    await set_tenant_context(db, new_org_id)
    
    # Query clients - should NOT see the Long Beach client due to RLS
    result = await db.execute(select(Client))
    visible_clients = result.scalars().all()
    
    client_names = [c.last_name for c in visible_clients]
    assert client_name not in client_names, "Org 2 should NOT see org 1's clients due to RLS"


@pytest.mark.asyncio  
async def test_vendor_only_sees_own_clients(db: AsyncSession):
    """
    Within an organization, queries by vendor_id filter correctly.
    """
    await set_tenant_context(db, 1)
    
    # Create clients for different vendors
    path_client_name = f"PATH-Client-{unique_suffix()}"
    lbrm_client_name = f"LBRM-Client-{unique_suffix()}"
    
    client_path = Client(
        organization_id=1,
        assigned_vendor_id=101,  # PATH
        first_name="PATH",
        last_name=path_client_name
    )
    client_lbrm = Client(
        organization_id=1,
        assigned_vendor_id=102,  # LBRM
        first_name="LBRM",
        last_name=lbrm_client_name
    )
    db.add(client_path)
    db.add(client_lbrm)
    await db.commit()
    
    # Query clients for PATH only (vendor 101)
    result = await db.execute(
        select(Client).where(Client.assigned_vendor_id == 101)
    )
    path_clients = result.scalars().all()
    
    # Should NOT include the LBRM client
    client_names = [c.last_name for c in path_clients]
    assert path_client_name in client_names or any(c.first_name == "PATH" for c in path_clients), \
        "PATH clients should be included"
    assert lbrm_client_name not in client_names, \
        "LBRM client should NOT be in PATH query"


@pytest.mark.asyncio
async def test_city_admin_sees_all_vendors(db: AsyncSession):
    """
    City admin should see all vendors in their organization.
    This is essential for Layer 8 functionality.
    """
    await set_tenant_context(db, 1)  # Long Beach
    
    # Query all vendors in Long Beach
    result = await db.execute(
        select(Vendor).where(Vendor.organization_id == 1)
    )
    all_vendors = result.scalars().all()
    
    # Should see all 4 seeded vendors
    assert len(all_vendors) >= 4, f"Expected at least 4 vendors, got {len(all_vendors)}"
    
    vendor_names = [v.name for v in all_vendors]
    assert "PATH (People Assisting The Homeless)" in vendor_names
    assert "Long Beach Rescue Mission" in vendor_names


@pytest.mark.asyncio
async def test_rls_blocks_cross_org_read(db: AsyncSession):
    """
    When context is set to org 1, queries should NOT return org 2 data.
    This is the core RLS test.
    """
    # Create org 2 using raw SQL (orgs have no RLS)
    slug = f"rls-test-{unique_suffix()}"
    await db.execute(text(
        "INSERT INTO organizations (name, slug, city, state) VALUES (:name, :slug, :city, :state)"
    ), {"name": "RLS Test City", "slug": slug, "city": "Test", "state": "CA"})
    await db.commit()
    
    result = await db.execute(text("SELECT id FROM organizations WHERE slug = :slug"), {"slug": slug})
    org2_id = result.scalar()
    
    # Set context to org 2 so we can insert a vendor there
    await set_tenant_context(db, org2_id)
    
    # Create vendor in org 2 (context is now org 2, so RLS allows this)
    secret_vendor_name = f"Secret-Vendor-{unique_suffix()}"
    vendor = Vendor(
        organization_id=org2_id,
        name=secret_vendor_name,
        slug=f"secret-{unique_suffix()}"
    )
    db.add(vendor)
    await db.commit()
    
    # Now switch context to org 1 (Long Beach)
    await set_tenant_context(db, 1)
    
    # Try to query all vendors - should NOT see org 2's vendor due to RLS
    result = await db.execute(select(Vendor))
    visible_vendors = result.scalars().all()
    
    vendor_names = [v.name for v in visible_vendors]
    assert secret_vendor_name not in vendor_names, \
        f"RLS should block cross-org reads. Found: {vendor_names}"
