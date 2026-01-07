"""
Complete Demo Data Seeder for First Contact E.I.S.

Run this script to populate the database with realistic demo data for presentations.
Creates organizations, vendors, users, clients, and all related data.

Usage:
    python seed_complete_demo.py

Creates:
    - 1 Organization (Long Beach CoC)
    - 4 Vendors (PATH, MHALA, LAMP, HOPICS)
    - Multiple users (city admin, caseworkers)
    - 50+ clients with realistic data
    - QR locations
    - Case plans, benefits, etc.
"""

import asyncio
import sys
import os
from datetime import date, datetime, timedelta
import random

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
import bcrypt

from app.database import Base
from app.models.organization import Organization
from app.models.vendor import Vendor
from app.models.user import User, UserRole
from app.models.client import Client
from app.models.qr_location import QRLocation


# Demo data
DEMO_ORG = {
    "name": "Long Beach Continuum of Care",
    "slug": "longbeach",
    "city": "Long Beach",
    "state": "CA",
    "settings": {}
}

DEMO_VENDORS = [
    {"name": "PATH (People Assisting the Homeless)", "slug": "path", "performance": "excellent"},
    {"name": "HOPICS", "slug": "hopics", "performance": "good"},
    {"name": "LAMP Community", "slug": "lamp", "performance": "average"},
    {"name": "MHALA (Mental Health America of Los Angeles)", "slug": "mhala", "performance": "poor"}
]

DEMO_USERS = [
    {"email": "admin@longbeach.gov", "password": "demo123", "role": UserRole.CITY_ADMIN, "name": "Sarah Chen"},
    {"email": "maria@path.org", "password": "demo123", "role": UserRole.CASEWORKER, "name": "Maria Garcia", "vendor": "path"},
    {"email": "john@hopics.org", "password": "demo123", "role": UserRole.CASEWORKER, "name": "John Williams", "vendor": "hopics"},
    {"email": "lisa@lamp.org", "password": "demo123", "role": UserRole.CASEWORKER, "name": "Lisa Thompson", "vendor": "lamp"},
    {"email": "mike@mhala.org", "password": "demo123", "role": UserRole.CASEWORKER, "name": "Mike Rodriguez", "vendor": "mhala"},
]

FIRST_NAMES = ["Robert", "Maria", "Jennifer", "Marcus", "James", "Lisa", "David", "Sarah", "Michael", "Jessica",
               "William", "Ashley", "Christopher", "Michelle", "Daniel", "Amanda", "Matthew", "Stephanie"]

LAST_NAMES = ["Thompson", "Garcia", "Rodriguez", "Wu", "Miller", "Johnson", "Williams", "Brown", "Jones", "Davis",
              "Martinez", "Lopez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson"]


def generate_case_number():
    """Generate unique case number."""
    return f"FC-2025-{random.randint(100000, 999999)}"


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


async def seed_demo_data():
    """Seed complete demo data."""

    # Create async engine
    # Create async engine
    from app.config import settings
    engine = create_async_engine(settings.DATABASE_URL, echo=True)

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        print("\n" + "="*60)
        print("SEEDING DEMO DATA FOR FIRST CONTACT E.I.S.")
        print("="*60 + "\n")

        # 1. Create Organization
        print("Creating Organization: Long Beach CoC...")
        org = Organization(**DEMO_ORG)
        session.add(org)
        await session.commit()
        await session.refresh(org)
        print(f"   Organization created: {org.name} (ID: {org.id})")

        # 2. Create Vendors
        print("\nCreating Vendors...")
        vendors = {}
        for vendor_data in DEMO_VENDORS:
            vendor = Vendor(
                organization_id=org.id,
                name=vendor_data["name"],
                slug=vendor_data["slug"],
                contact_email=f"info@{vendor_data['slug']}.org",
                contact_phone="(562) 555-0100",
                address="Long Beach, CA",
                active=True
            )
            session.add(vendor)
            await session.commit()
            await session.refresh(vendor)
            vendors[vendor_data["slug"]] = vendor
            print(f"   Vendor: {vendor.name} (ID: {vendor.id})")

        # 3. Create Users
        print("\nCreating Users...")
        users = {}
        for user_data in DEMO_USERS:
            vendor_id = vendors[user_data["vendor"]].id if "vendor" in user_data else None

            user = User(
                email=user_data["email"],
                password_hash=hash_password(user_data["password"]),
                role=user_data["role"].value,
                organization_id=org.id,
                vendor_id=vendor_id,
                active=True
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            users[user_data["email"]] = user
            print(f"   User: {user_data['email']} ({user_data['role'].value})")

        # 4. Create QR Locations
        print("\nCreating QR Locations...")
        qr_locations = []
        locations_data = [
            {"name": "MLK Park Entrance", "vendor": "path", "lat": 33.7866, "lng": -118.1589},
            {"name": "Beach Shelter", "vendor": "path", "lat": 33.7701, "lng": -118.1937},
            {"name": "Downtown Library", "vendor": "hopics", "lat": 33.7683, "lng": -118.1956},
            {"name": "Community Center", "vendor": "lamp", "lat": 33.7700, "lng": -118.1880},
        ]

        for loc_data in locations_data:
            qr_loc = QRLocation(
                id=f"{loc_data['vendor']}-{random.randint(1000,9999)}",
                organization_id=org.id,
                vendor_id=vendors[loc_data["vendor"]].id,
                name=loc_data["name"],
                address=f"{loc_data['name']}, Long Beach, CA",
                latitude=loc_data["lat"],
                longitude=loc_data["lng"],
                qr_code_url=f"https://firstcontact.app/intake/{loc_data['vendor']}-{random.randint(1000,9999)}",
                active=True,
                scan_count=random.randint(50, 200)
            )
            session.add(qr_loc)
            qr_locations.append(qr_loc)

        await session.commit()
        print(f"   ✅ Created {len(qr_locations)} QR locations")

        # 5. Create Clients
        print("\n👤 Creating Clients...")

        # Performance targets for each vendor (matches demo story)
        vendor_targets = {
            "path": {"housing_rate": 0.73, "avg_days": 35, "count": 15},      # Excellent
            "hopics": {"housing_rate": 0.68, "avg_days": 42, "count": 12},    # Good
            "lamp": {"housing_rate": 0.54, "avg_days": 51, "count": 10},      # Average
            "mhala": {"housing_rate": 0.24, "avg_days": 68, "count": 15}      # Poor (THE COMPARISON)
        }

        caseworkers_by_vendor = {
            "path": users["maria@path.org"],
            "hopics": users["john@hopics.org"],
            "lamp": users["lisa@lamp.org"],
            "mhala": users["mike@mhala.org"]
        }

        total_clients = 0
        for vendor_slug, target in vendor_targets.items():
            vendor = vendors[vendor_slug]
            caseworker = caseworkers_by_vendor[vendor_slug]

            num_clients = target["count"]
            num_housed = int(num_clients * target["housing_rate"])

            for i in range(num_clients):
                first_name = random.choice(FIRST_NAMES)
                last_name = random.choice(LAST_NAMES)

                # Generate intake date (last 90 days)
                intake_date = date.today() - timedelta(days=random.randint(1, 90))

                # Determine status and housed date
                status = "housed" if i < num_housed else random.choice(["intake", "active"])
                housed_date = None

                if status == "housed":
                    days_to_housing = int(target["avg_days"] + random.randint(-10, 10))
                    housed_date = intake_date + timedelta(days=days_to_housing)

                # VI-SPDAT score (0-17, higher = more vulnerable)
                vi_spdat_score = random.randint(5, 16)
                acuity_level = (
                    "severe" if vi_spdat_score >= 14 else
                    "high" if vi_spdat_score >= 9 else
                    "moderate" if vi_spdat_score >= 5 else
                    "low"
                )

                client = Client(
                    organization_id=org.id,
                    assigned_vendor_id=vendor.id,
                    assigned_caseworker_id=caseworker.id,
                    case_number=generate_case_number(),
                    first_name=first_name,
                    last_name=last_name,
                    date_of_birth=date(random.randint(1960, 2000), random.randint(1, 12), random.randint(1, 28)),
                    phone=f"(562) {random.randint(100,999)}-{random.randint(1000,9999)}",
                    email=f"{first_name.lower()}.{last_name.lower()}@example.com" if random.random() > 0.3 else None,
                    vi_spdat_score=vi_spdat_score,
                    vi_spdat_date=intake_date,
                    acuity_level=acuity_level,
                    status=status,
                    intake_date=intake_date,
                    housed_date=housed_date,
                    housing_type="permanent" if status == "housed" else None,
                    exit_income_monthly=random.randint(1200, 2500) if status == "housed" else None
                )
                session.add(client)
                total_clients += 1

            print(f"   ✅ {vendor.name}: {num_clients} clients ({num_housed} housed, {target['housing_rate']*100:.0f}% rate)")

        await session.commit()
        print(f"\n   📊 Total clients created: {total_clients}")

        # 6. Create Orchestrator Specific Stories (Crucial for "Calling Audibles" Demo)
        print("\n🎭 Creating Orchestrator Demo Scenarios...")
        
        # Get PATH vendor for these scenarios
        path_vendor = vendors["path"]
        maria_caseworker = caseworkers_by_vendor["path"] 

        # Story 1: Appointment Swap (Maria Cancels, Robert takes slot)
        # Maria Garcia
        maria = Client(
            organization_id=org.id,
            assigned_vendor_id=path_vendor.id,
            assigned_caseworker_id=maria_caseworker.id,
            case_number="FC-2025-MARIA",
            first_name="Maria",
            last_name="Garcia",
            status="active",
            vi_spdat_score=6,
            date_of_birth=date(1980, 5, 20),
            intake_date=date.today() - timedelta(days=45),
            notes="Requires wheelchair access. consistently attends appointments. Has upcoming DPSS appointment."
        )
        session.add(maria)

        # Robert Thompson (Waitlist, High Urgency)
        robert = Client(
            organization_id=org.id,
            assigned_vendor_id=path_vendor.id,
            assigned_caseworker_id=maria_caseworker.id, # Assigning to same/pool
            case_number="FC-2025-ROB",
            first_name="Robert",
            last_name="Thompson",
            status="waitlist",
            vi_spdat_score=8, 
            date_of_birth=date(1975, 3, 12),
            intake_date=date.today() - timedelta(days=12),
            notes="High vulnerability. Veteran. Document ready. Currently at Library shelter. Needs DPSS appointment."
        )
        session.add(robert)

        # Story 2: At Risk (Jennifer)
        jennifer = Client(
            organization_id=org.id,
            assigned_vendor_id=path_vendor.id,
            assigned_caseworker_id=maria_caseworker.id,
            case_number="FC-2025-JEN",
            first_name="Jennifer",
            last_name="Wu",
            status="active",
            vi_spdat_score=12,
            date_of_birth=date(1998, 11, 2),
            intake_date=date.today() - timedelta(days=30),
            notes="History of trauma. Needs female case manager. Missed last 3 check-ins."
        )
        session.add(jennifer)

        # Story 3: Benefit Opp (Marcus)
        marcus = Client(
            organization_id=org.id,
            assigned_vendor_id=path_vendor.id,
            assigned_caseworker_id=maria_caseworker.id,
            case_number="FC-2025-MARC",
            first_name="Marcus",
            last_name="Johnson",
            status="housed",
            vi_spdat_score=4,
            date_of_birth=date(1985, 7, 7),
            intake_date=date.today() - timedelta(days=90),
            exit_date=date.today() - timedelta(days=3),
            notes="Recently housed. Receiving GR ($221)."
        )
        session.add(marcus)

        await session.commit()
        print("   ✅ Created specific demo characters: Maria, Robert, Jennifer, Marcus")

        # Summary
        print("\n" + "="*60)
        print("✅ DEMO DATA SEEDING COMPLETE!")
        print("="*60)
        print("\n📋 Demo Login Credentials:")
        print("-" * 60)
        print("   City Admin (Layer 8):")
        print("   Email: admin@longbeach.gov")
        print("   Password: demo123")
        print("   Org Slug: longbeach")
        print()
        print("   Caseworker (PATH - Best Performer):")
        print("   Email: maria@path.org")
        print("   Password: demo123")
        print("   Org Slug: longbeach")
        print()
        print("   Caseworker (MHALA - Poor Performer):")
        print("   Email: mike@mhala.org")
        print("   Password: demo123")
        print("   Org Slug: longbeach")
        print("-" * 60)

        print("\n🎯 Demo Story:")
        print("   PATH: 73% housing rate, $21K cost-per-outcome (EXCELLENT)")
        print("   HOPICS: 68% housing rate (GOOD)")
        print("   LAMP: 54% housing rate (AVERAGE)")
        print("   MHALA: 24% housing rate, $78K cost-per-outcome (POOR)")
        print("\n   👉 City sees this comparison in Layer 8 → Mandates system adoption")
        print("="*60 + "\n")


if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(seed_demo_data())
