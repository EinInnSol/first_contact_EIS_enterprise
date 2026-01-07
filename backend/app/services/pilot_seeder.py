"""
Pilot Seeder Service - Generates high-impact data for City Proof-of-Concept.
"""

import logging
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta
import random
import uuid

from app.models.organization import Organization
from app.models.vendor import Vendor
from app.models.client import Client
from app.models.user import User

logger = logging.getLogger(__name__)

class PilotSeederService:
    """
    Populates a new environment with realistic Pilot data.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def seed_pilot_data(self, organization_slug: str = "city-of-long-beach"):
        """
        Creates a full ecosystem of data for a specific organization.
        """
        logger.info(f"SEEDER: Starting high-impact seed for {organization_slug}")
        
        # 1. Fetch or Create Organization
        from sqlalchemy import select
        from app.models.organization import Organization
        from app.models.vendor import Vendor
        from app.models.client import Client
        from app.models.qr_location import QRLocation
        
        stmt = select(Organization).where(Organization.slug == organization_slug)
        result = await self.db.execute(stmt)
        org = result.scalar_one_or_none()
        
        if not org:
            org = Organization(
                name="City of Long Beach",
                slug=organization_slug,
                active=True
            )
            self.db.add(org)
            await self.db.flush()
        
        # 2. Create Vendors with performance profiles
        vendors_to_create = [
            {"name": "Pathways Long Beach", "profile": "top"},
            {"name": "Urban Outreach LB", "profile": "moderate"},
            {"name": "Project Home LB", "profile": "low_efficiency"}
        ]
        
        vendors = []
        for v_data in vendors_to_create:
            stmt = select(Vendor).where(Vendor.name == v_data["name"])
            res = await self.db.execute(stmt)
            vendor = res.scalar_one_or_none()
            if not vendor:
                vendor = Vendor(
                    name=v_data["name"],
                    organization_id=org.id,
                    active=True
                )
                self.db.add(vendor)
                await self.db.flush()
            vendors.append((vendor, v_data["profile"]))

        # 3. Create QR Locations
        loc_names = ["Civic Center", "Lincoln Park", "Atlantic & 6th", "Ocean Blvd"]
        for name in loc_names:
            stmt = select(QRLocation).where(QRLocation.name == name)
            res = await self.db.execute(stmt)
            if not res.scalar_one_or_none():
                loc = QRLocation(
                    name=name,
                    organization_id=org.id,
                    latitude=Decimal(f"33.7{random.randint(6000, 8000)}"),
                    longitude=Decimal(f"-118.1{random.randint(8000, 9999)}"),
                    active=True
                )
                self.db.add(loc)

        # 4. Create Clients and Outcomes
        for vendor, profile in vendors:
            # Create 30-50 clients per vendor
            num_clients = random.randint(30, 50)
            for i in range(num_clients):
                # Probability of housing based on profile
                if profile == "top": h_prob = 0.82
                elif profile == "moderate": h_prob = 0.55
                else: h_prob = 0.35
                
                is_housed = random.random() < h_prob
                intake_date = datetime.now() - timedelta(days=random.randint(10, 180))
                
                exit_date = None
                status = "active"
                if is_housed:
                    exit_date = intake_date + timedelta(days=random.randint(20, 90))
                    status = "housed"
                
                client = Client(
                    first_name=f"Client_{vendor.id}_{i}",
                    last_name="Seed",
                    organization_id=org.id,
                    assigned_vendor_id=vendor.id,
                    intake_date=intake_date,
                    exit_date=exit_date,
                    status=status
                )
                self.db.add(client)

        # 5. Inject Specific Demo Stories (The "Maria & Robert" Scenario)
        await self.seed_demo_stories(org, vendors)

        await self.db.commit()
        logger.info("SEEDER: Pilot data seeding complete. Dashboards now high-impact.")

    async def seed_demo_stories(self, org: Organization, vendors_list: List[Any]):
        """
        Injects the specific narrative characters for the 'Calling Audibles' demo.
        """
        from app.models.client import Client
        from app.models.user import User # Assuming we might need this later
        
        # We need specific vendors for the story
        dpss_vendor = next((v for v, p in vendors_list if v.name == "Pathways Long Beach"), vendors_list[0][0])
        
        # STORY 1: The Appointment Swap
        # Maria Garcia: The Cancellation
        maria = Client(
            first_name="Maria",
            last_name="Garcia",
            organization_id=org.id,
            assigned_vendor_id=dpss_vendor.id,
            status="active",
            vi_spdat_score=6,
            intake_date=datetime.now() - timedelta(days=45),
            notes="Requires wheelchair access. consistently attends appointments."
        )
        self.db.add(maria)
        
        # Robert Thompson: The Waitlist Candidate
        robert = Client(
            first_name="Robert", 
            last_name="Thompson",
            organization_id=org.id,
            assigned_vendor_id=dpss_vendor.id,
            status="waitlist",
            vi_spdat_score=8, # Higher urgency
            intake_date=datetime.now() - timedelta(days=12),
            notes="High vulnerability. Veteran. Document ready. Currently at Library shelter."
        )
        self.db.add(robert)

        # STORY 2: The At-Risk Youth
        # Jennifer Wu: The 'Ghosting' Risk
        jennifer = Client(
            first_name="Jennifer",
            last_name="Wu", 
            organization_id=org.id,
            assigned_vendor_id=dpss_vendor.id,
            status="active",
            vi_spdat_score=12,
            intake_date=datetime.now() - timedelta(days=30),
            notes="History of trauma. Needs female case manager. Missed last 3 check-ins."
        )
        self.db.add(jennifer)

        # STORY 3: The Benefit Opportunity
        # Marcus Johnson
        marcus = Client(
            first_name="Marcus",
            last_name="Johnson",
            organization_id=org.id,
            assigned_vendor_id=dpss_vendor.id,
            status="housed",
            vi_spdat_score=4,
            intake_date=datetime.now() - timedelta(days=90),
            exit_date=datetime.now() - timedelta(days=3),
            notes="Recently housed. Receiving GR ($221)."
        )
        self.db.add(marcus)
        
        # Flush to get IDs for potential future appointments/events linkage
        await self.db.flush()
        logger.info("SEEDER: Injected 'Maria', 'Robert', 'Jennifer', and 'Marcus' for demo scenarios.")

from decimal import Decimal
