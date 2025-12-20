"""
Test Configuration and Fixtures

Using SQLite for local testing (RLS simulated via application logic).
PostgreSQL RLS testing requires Cloud SQL Proxy running.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy import text, select, event
import os
import asyncio

# Set test environment - use SQLite
os.environ["ENVIRONMENT"] = "test"
os.environ["USE_SQLITE"] = "true"
os.environ["JWT_SECRET"] = "test-secret-key-for-testing-only"
os.environ["JWT_ALGORITHM"] = "HS256"

# SQLite test database (in-memory for speed)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create test engine BEFORE importing app (to avoid connection issues)
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # Share single connection for in-memory SQLite
)

TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Now import app components
from app.database import Base
from app.models.organization import Organization
from app.models.vendor import Vendor
from app.models.user import User, UserRole
from app.models.client import Client
from app.models.qr_location import QRLocation
from app.models.qr_scan_event import QRScanEvent


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for the entire test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db():
    """Create test database session with fresh schema each test."""
    # Create all tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed test data
    async with TestSessionLocal() as session:
        # Create test organization
        org = Organization(
            id=1,
            name="Long Beach Homeless Services",
            slug="longbeach",
            city="Long Beach",
            state="CA"
        )
        session.add(org)
        
        # Create second org for isolation tests
        org2 = Organization(
            id=2,
            name="Pasadena Services",
            slug="pasadena",
            city="Pasadena",
            state="CA"
        )
        session.add(org2)
        
        # Create vendors
        vendor1 = Vendor(
            id=101,
            organization_id=1,
            name="PATH",
            slug="path"
        )
        vendor2 = Vendor(
            id=102,
            organization_id=1,
            name="Long Beach Rescue Mission",
            slug="lbrm"
        )
        vendor3 = Vendor(
            id=201,
            organization_id=2,
            name="Pasadena Vendor",
            slug="pas-vendor"
        )
        session.add_all([vendor1, vendor2, vendor3])
        
        # Create QR locations
        qr1 = QRLocation(
            id="lb-mlk-park",
            organization_id=1,
            vendor_id=101,
            name="MLK Park",
            address="1950 Lemon Ave, Long Beach, CA"
        )
        qr2 = QRLocation(
            id="pas-library",
            organization_id=2,
            vendor_id=201,
            name="Pasadena Library",
            address="285 E Walnut St, Pasadena, CA"
        )
        session.add_all([qr1, qr2])
        
        # Create users for each role
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        city_admin = User(
            id="11111111-1111-1111-1111-111111111111",
            organization_id=1,
            email="admin@longbeach.gov",
            password_hash=pwd_context.hash("testpass"),
            first_name="Diana",
            last_name="CityAdmin",
            role=UserRole.CITY_ADMIN
        )
        caseworker = User(
            id="22222222-2222-2222-2222-222222222222",
            organization_id=1,
            vendor_id=101,
            email="sarah@path.org",
            password_hash=pwd_context.hash("testpass"),
            first_name="Sarah",
            last_name="Caseworker",
            role=UserRole.CASEWORKER
        )
        vendor_admin = User(
            id="33333333-3333-3333-3333-333333333333",
            organization_id=1,
            vendor_id=101,
            email="mike@path.org",
            password_hash=pwd_context.hash("testpass"),
            first_name="Mike",
            last_name="VendorAdmin",
            role=UserRole.VENDOR_ADMIN
        )
        # User in different org for isolation tests
        other_admin = User(
            id="44444444-4444-4444-4444-444444444444",
            organization_id=2,
            email="admin@pasadena.gov",
            password_hash=pwd_context.hash("testpass"),
            first_name="Other",
            last_name="Admin",
            role=UserRole.CITY_ADMIN
        )
        session.add_all([city_admin, caseworker, vendor_admin, other_admin])
        
        await session.commit()
        
        yield session
        
        await session.rollback()


@pytest_asyncio.fixture(scope="function")
async def client(db):
    """Create test client with overridden database dependency."""
    from app.main import app
    from app.database import get_db
    
    async def override_get_db():
        yield db
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    
    app.dependency_overrides.clear()


def create_test_token(user_id: str, org_id: int, role: str, vendor_id: int = None) -> str:
    """Helper to create JWT tokens for testing."""
    from jose import jwt
    from datetime import datetime, timedelta
    
    payload = {
        "sub": user_id,
        "org_id": org_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    if vendor_id:
        payload["vendor_id"] = vendor_id
    
    return jwt.encode(payload, "test-secret-key-for-testing-only", algorithm="HS256")


@pytest.fixture
def city_admin_token():
    """JWT token for city admin user."""
    return create_test_token(
        "11111111-1111-1111-1111-111111111111",
        org_id=1,
        role="city_admin"
    )


@pytest.fixture
def caseworker_token():
    """JWT token for caseworker user."""
    return create_test_token(
        "22222222-2222-2222-2222-222222222222",
        org_id=1,
        role="caseworker",
        vendor_id=101
    )


@pytest.fixture
def vendor_admin_token():
    """JWT token for vendor admin user."""
    return create_test_token(
        "33333333-3333-3333-3333-333333333333",
        org_id=1,
        role="vendor_admin",
        vendor_id=101
    )


@pytest.fixture
def other_org_token():
    """JWT token for user in different organization."""
    return create_test_token(
        "44444444-4444-4444-4444-444444444444",
        org_id=2,
        role="city_admin"
    )


@pytest_asyncio.fixture
async def test_org(db: AsyncSession):
    """Get the test Long Beach organization."""
    result = await db.execute(
        select(Organization).where(Organization.id == 1)
    )
    return result.scalar_one()


@pytest_asyncio.fixture
async def test_vendor(db: AsyncSession):
    """Get the test PATH vendor."""
    result = await db.execute(
        select(Vendor).where(Vendor.id == 101)
    )
    return result.scalar_one()


@pytest_asyncio.fixture
async def test_qr_location(db: AsyncSession):
    """Get the test QR location."""
    result = await db.execute(
        select(QRLocation).where(QRLocation.id == "lb-mlk-park")
    )
    return result.scalar_one()
