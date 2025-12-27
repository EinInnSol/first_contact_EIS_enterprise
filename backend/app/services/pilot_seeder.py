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

        await self.db.commit()
        logger.info("SEEDER: Pilot data seeding complete. Dashboards now high-impact.")

from decimal import Decimal
