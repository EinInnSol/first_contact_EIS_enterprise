"""
First Contact E.I.S. - Demo Data Seeder
Creates realistic demo data for the 5-minute pitch demo
"""

import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy import select
from app.database import AsyncSessionLocal, engine, Base
from app.models.organization import Organization
from app.models.vendor import Vendor
from app.models.user import User
from app.models.client import Client
from app.models.qr_location import QRLocation
from app.models.qr_scan_event import QRScanEvent
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def create_demo_data():
    """Create complete demo dataset for Long Beach"""

    async with AsyncSessionLocal() as db:
        print("🎬 Creating First Contact E.I.S. Demo Data...")
        print("=" * 60)

        # 1. CREATE ORGANIZATION
        print("\n1️⃣ Creating Organization: Long Beach Homeless Services")
        org = Organization(
            id=1,
            name="Long Beach Homeless Services",
            slug="long-beach",
            city="Long Beach",
            state="CA",
            settings={"demo_mode": True}
        )
        db.add(org)
        await db.commit()
        print("✅ Organization created")

        # 2. CREATE VENDORS (with realistic performance profiles)
        print("\n2️⃣ Creating Vendors...")

        vendors_data = [
            {
                "id": 1,
                "name": "PATH (People Assisting The Homeless)",
                "slug": "path",
                "contact_email": "admin@pathpartners.org",
                "housing_rate": 0.73,  # 73% - Top performer
                "cost_per_outcome": 21000,
                "avg_days_to_housing": 32,
                "retention_6mo": 0.85
            },
            {
                "id": 2,
                "name": "Long Beach Rescue Mission",
                "slug": "lbrm",
                "contact_email": "admin@lbrm.org",
                "housing_rate": 0.68,  # 68% - Good
                "cost_per_outcome": 29000,
                "avg_days_to_housing": 45,
                "retention_6mo": 0.79
            },
            {
                "id": 3,
                "name": "CityNet",
                "slug": "citynet",
                "contact_email": "admin@citynet.org",
                "housing_rate": 0.61,  # 61% - Average
                "cost_per_outcome": 33000,
                "avg_days_to_housing": 58,
                "retention_6mo": 0.72
            },
            {
                "id": 4,
                "name": "Mental Health America of LA (MHALA)",
                "slug": "mhala",
                "contact_email": "admin@mhala.org",
                "housing_rate": 0.42,  # 42% - Bottom performer (THE REVEAL)
                "cost_per_outcome": 78000,
                "avg_days_to_housing": 89,
                "retention_6mo": 0.61
            }
        ]

        vendors = []
        for v_data in vendors_data:
            vendor = Vendor(
                id=v_data["id"],
                organization_id=1,
                name=v_data["name"],
                slug=v_data["slug"],
                contact_email=v_data["contact_email"],
                active=True
            )
            db.add(vendor)
            vendors.append(vendor)
            print(f"   ✅ {v_data['name']}")

        await db.commit()
        print(f"✅ {len(vendors)} vendors created")

        # 3. CREATE QR LOCATIONS
        print("\n3️⃣ Creating QR Locations...")

        qr_locations_data = [
            {
                "id": "lb-mlk-park",
                "vendor_id": 1,
                "name": "MLK Park",
                "address": "1950 Lemon Ave, Long Beach, CA",
                "latitude": 33.7866,
                "longitude": -118.1589,
                "location_type": "park",
                "scan_count": 89,
                "conversion_rate": 0.31  # Lower conversion
            },
            {
                "id": "lb-downtown-library",
                "vendor_id": 2,
                "name": "Downtown Library",
                "address": "101 Pacific Ave, Long Beach, CA",
                "latitude": 33.7688,
                "longitude": -118.1935,
                "location_type": "library",
                "scan_count": 247,
                "conversion_rate": 0.68  # High conversion (KEY INSIGHT)
            },
            {
                "id": "lb-lincoln-park",
                "vendor_id": 3,
                "name": "Lincoln Park",
                "address": "2285 E Pacific Coast Hwy, Long Beach, CA",
                "latitude": 33.7701,
                "longitude": -118.1550,
                "location_type": "park",
                "scan_count": 156,
                "conversion_rate": 0.52
            },
            {
                "id": "lb-multi-service",
                "vendor_id": 4,
                "name": "Multi-Service Center",
                "address": "1301 W 12th St, Long Beach, CA",
                "latitude": 33.7858,
                "longitude": -118.2005,
                "location_type": "service_center",
                "scan_count": 203,
                "conversion_rate": 0.59
            }
        ]

        qr_locations = []
        for qr_data in qr_locations_data:
            qr_loc = QRLocation(
                id=qr_data["id"],
                organization_id=1,
                vendor_id=qr_data["vendor_id"],
                name=qr_data["name"],
                address=qr_data["address"],
                latitude=qr_data["latitude"],
                longitude=qr_data["longitude"],
                location_type=qr_data["location_type"],
                active=True,
                scan_count=0  # Will increment as we create events
            )
            db.add(qr_loc)
            qr_locations.append(qr_loc)
            print(f"   ✅ {qr_data['name']} ({qr_data['scan_count']} scans)")

        await db.commit()
        print(f"✅ {len(qr_locations)} QR locations created")

        # 4. CREATE USERS (Demo accounts)
        print("\n4️⃣ Creating Demo Users...")

        users_data = [
            {
                "email": "admin@longbeach.gov",
                "password": "demo123",
                "first_name": "Sarah",
                "last_name": "Chen",
                "role": "city_admin",
                "vendor_id": None
            },
            {
                "email": "caseworker@path.org",
                "password": "demo123",
                "first_name": "Marcus",
                "last_name": "Johnson",
                "role": "caseworker",
                "vendor_id": 1
            },
            {
                "email": "admin@path.org",
                "password": "demo123",
                "first_name": "Jennifer",
                "last_name": "Rodriguez",
                "role": "vendor_admin",
                "vendor_id": 1
            }
        ]

        for u_data in users_data:
            user = User(
                organization_id=1,
                vendor_id=u_data["vendor_id"],
                email=u_data["email"],
                password_hash=pwd_context.hash(u_data["password"]),
                first_name=u_data["first_name"],
                last_name=u_data["last_name"],
                role=u_data["role"],
                active=True
            )
            db.add(user)
            print(f"   ✅ {u_data['email']} ({u_data['role']})")

        await db.commit()
        print(f"✅ {len(users_data)} demo users created")

        # 5. CREATE CLIENTS (Realistic outcomes distribution)
        print("\n5️⃣ Creating Clients with Realistic Outcomes...")

        first_names = ["Maria", "James", "Sarah", "Michael", "Jennifer", "David", "Lisa", "Robert", "Jessica", "William",
                      "Amanda", "Christopher", "Michelle", "Matthew", "Emily", "Joshua", "Ashley", "Daniel", "Samantha", "Andrew"]
        last_names = ["Garcia", "Rodriguez", "Martinez", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson",
                     "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris"]

        clients_created = 0

        for vendor_data in vendors_data:
            vendor_id = vendor_data["id"]
            target_count = 20  # 20 clients per vendor = 80 total
            housed_target = int(target_count * vendor_data["housing_rate"])

            for i in range(target_count):
                is_housed = i < housed_target
                intake_days_ago = random.randint(30, 180)
                intake_date = datetime.now().date() - timedelta(days=intake_days_ago)

                if is_housed:
                    days_to_housing = random.randint(
                        int(vendor_data["avg_days_to_housing"] * 0.7),
                        int(vendor_data["avg_days_to_housing"] * 1.3)
                    )
                    housed_date = intake_date + timedelta(days=days_to_housing)
                    status = "housed"
                    exit_income = random.randint(800, 2800)  # Monthly income range
                else:
                    housed_date = None
                    status = random.choice(["intake", "enrolled", "enrolled", "enrolled"])
                    exit_income = None

                client = Client(
                    organization_id=1,
                    assigned_vendor_id=vendor_id,
                    intake_qr_location_id=random.choice([qr.id for qr in qr_locations]),
                    case_number=f"LB-{1000 + clients_created}",
                    first_name=random.choice(first_names),
                    last_name=random.choice(last_names),
                    date_of_birth=datetime(
                        random.randint(1960, 2000),
                        random.randint(1, 12),
                        random.randint(1, 28)
                    ).date(),
                    phone=f"562{random.randint(1000000, 9999999)}",
                    status=status,
                    housing_type="unsheltered" if not is_housed else "permanent_housing",
                    intake_date=intake_date,
                    housed_date=housed_date,
                    exit_income_monthly=exit_income,
                    vi_spdat_score=random.randint(4, 15),
                    acuity_level=random.choice(["moderate", "high", "high", "severe"])
                )
                db.add(client)
                clients_created += 1

        await db.commit()
        print(f"✅ {clients_created} clients created with realistic outcome distributions")

        # 6. CREATE QR SCAN EVENTS (30 days history)
        print("\n6️⃣ Creating QR Scan Events (30-day history)...")

        scan_events_created = 0
        for qr_data in qr_locations_data:
            qr_location = next(qr for qr in qr_locations if qr.id == qr_data["id"])
            total_scans = qr_data["scan_count"]
            conversion_rate = qr_data["conversion_rate"]
            converted_scans = int(total_scans * conversion_rate)

            for scan_num in range(total_scans):
                # Random time in last 30 days
                days_ago = random.randint(0, 30)
                hours_ago = random.randint(6, 20)  # Daytime scans
                scanned_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)

                resulted_in_intake = scan_num < converted_scans

                event = QRScanEvent(
                    organization_id=1,
                    qr_location_id=qr_data["id"],
                    scanned_at=scanned_at,
                    device_type=random.choice(["iOS", "iOS", "Android", "Android", "Desktop"]),
                    resulted_in_intake=resulted_in_intake,
                    client_id=None  # Could link to actual clients but not required for demo
                )
                db.add(event)
                scan_events_created += 1

            # Update scan count on QR location
            qr_location.scan_count = total_scans

        await db.commit()
        print(f"✅ {scan_events_created} QR scan events created")

        # 7. SUMMARY
        print("\n" + "=" * 60)
        print("🎉 DEMO DATA CREATION COMPLETE!")
        print("=" * 60)
        print("\n📊 Demo Data Summary:")
        print(f"   • Organization: Long Beach Homeless Services")
        print(f"   • Vendors: 4 (PATH, LBRM, CityNet, MHALA)")
        print(f"   • QR Locations: 4")
        print(f"   • Clients: 80 (distributed across vendors)")
        print(f"   • QR Scans: {scan_events_created}")
        print(f"   • Demo Users: 3")
        print("\n🔑 Login Credentials:")
        print("   City Admin: admin@longbeach.gov / demo123")
        print("   Caseworker: caseworker@path.org / demo123")
        print("   Vendor Admin: admin@path.org / demo123")
        print("\n🎯 Key Demo Insights:")
        print("   • PATH: 73% housing rate, $21K cost (GREEN - Top)")
        print("   • MHALA: 42% housing rate, $78K cost (RED - Bottom)")
        print("   • Efficiency gap: 3.7x cost difference")
        print("   • Downtown Library: 68% conversion (vs 31% at MLK Park)")
        print("\n🚀 Ready to demo the Trojan Horse!")
        print("=" * 60)


async def main():
    """Main entry point"""
    # Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed demo data
    await create_demo_data()


if __name__ == "__main__":
    asyncio.run(main())
