"""
Analytics Engine - Layer 8 Data Calculations

Calculates vendor performance metrics, geographic analytics,
and cost-per-outcome analysis.

This is the data that makes cities mandate the platform.
"""

from sqlalchemy import select, func, and_, case
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta, datetime
from typing import Dict, List, Optional, Tuple
import statistics

from app.models.vendor import Vendor
from app.models.client import Client
from app.models.qr_scan_event import QRScanEvent
from app.models.qr_location import QRLocation


class AnalyticsEngine:
    """
    Core analytics engine for Layer 8 calculations.
    
    All methods assume organization_id is already set via RLS.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def calculate_vendor_performance(
        self,
        start_date: date,
        end_date: date
    ) -> List[Dict]:
        """
        Calculate comprehensive vendor performance metrics.
        
        Returns list of vendor performance data sorted by efficiency.
        """
        # Get all vendors for this org (RLS automatically filters)
        vendors_result = await self.db.execute(
            select(Vendor).where(Vendor.active == True)
        )
        vendors = vendors_result.scalars().all()
        
        performance_data = []
        
        for vendor in vendors:
            metrics = await self._calculate_vendor_metrics(
                vendor.id,
                start_date,
                end_date
            )
            
            performance_data.append({
                "vendor_id": vendor.id,
                "vendor_name": vendor.name,
                "vendor_slug": vendor.slug,
                **metrics
            })
        
        # Sort by efficiency score (descending)
        performance_data.sort(
            key=lambda x: x.get("efficiency_score", 0),
            reverse=True
        )
        
        # Add rankings
        for rank, vendor_data in enumerate(performance_data, start=1):
            vendor_data["rank"] = rank
        
        return performance_data
    
    async def _calculate_vendor_metrics(
        self,
        vendor_id: int,
        start_date: date,
        end_date: date
    ) -> Dict:
        """Calculate all metrics for a single vendor."""
        
        # Get all clients for this vendor in date range
        clients_result = await self.db.execute(
            select(Client).where(
                and_(
                    Client.assigned_vendor_id == vendor_id,
                    Client.intake_date >= start_date,
                    Client.intake_date <= end_date
                )
            )
        )
        clients = clients_result.scalars().all()
        
        total_clients = len(clients)
        
        if total_clients == 0:
            return self._empty_metrics()
        
        # Housing outcomes
        housed_clients = [c for c in clients if c.housed_date is not None]
        housed_count = len(housed_clients)
        housing_rate = housed_count / total_clients if total_clients > 0 else 0
        
        # Calculate average days to housing
        days_to_housing = []
        for client in housed_clients:
            if client.intake_date and client.housed_date:
                delta = (client.housed_date - client.intake_date).days
                days_to_housing.append(delta)
        
        avg_days_to_housing = (
            statistics.mean(days_to_housing) if days_to_housing else 0
        )
        
        # Calculate retention rate (6-month check)
        # For demo purposes, using mock retention calculation
        # In production: query actual retention check-ins
        retention_6mo = self._estimate_retention_rate(housed_count, total_clients)
        
        # Calculate average exit income
        exit_incomes = [
            c.exit_income_monthly for c in clients 
            if c.exit_income_monthly and c.exit_income_monthly > 0
        ]
        avg_exit_income = (
            statistics.mean(exit_incomes) if exit_incomes else 0
        )
        
        # Cost per outcome (estimated)
        # In production: pull from actual contract amounts
        cost_per_outcome = self._estimate_cost_per_outcome(
            vendor_id, housed_count
        )
        
        # Calculate efficiency score (0-100)
        efficiency_score = self._calculate_efficiency_score(
            housing_rate=housing_rate,
            retention_rate=retention_6mo,
            avg_days=avg_days_to_housing,
            cost_per_outcome=cost_per_outcome
        )
        
        return {
            "total_clients": total_clients,
            "housed_count": housed_count,
            "housing_rate": round(housing_rate, 2),
            "avg_days_to_housing": round(avg_days_to_housing, 1),
            "retention_6mo": round(retention_6mo, 2),
            "avg_exit_income": round(avg_exit_income, 2),
            "cost_per_outcome": int(cost_per_outcome),
            "efficiency_score": int(efficiency_score)
        }
    
    def _empty_metrics(self) -> Dict:
        """Return empty metrics for vendors with no clients."""
        return {
            "total_clients": 0,
            "housed_count": 0,
            "housing_rate": 0,
            "avg_days_to_housing": 0,
            "retention_6mo": 0,
            "avg_exit_income": 0,
            "cost_per_outcome": 0,
            "efficiency_score": 0
        }
    
    def _estimate_retention_rate(self, housed: int, total: int) -> float:
        """
        Estimate 6-month retention rate.
        
        In production: Query actual retention check-ins.
        For demo: Use formula based on housing rate.
        """
        if housed == 0:
            return 0
        
        # Better performers tend to have better retention
        housing_rate = housed / total if total > 0 else 0
        base_retention = 0.60  # Industry average
        bonus = (housing_rate - 0.30) * 0.5  # Bonus for high housing rate
        
        return min(0.95, max(0.45, base_retention + bonus))
    
    def _estimate_cost_per_outcome(self, vendor_id: int, housed_count: int) -> float:
        """
        Estimate cost per successful outcome.
        
        In production: Pull from actual contract amounts.
        For demo: Use vendor-based estimates from research.
        """
        # Demo costs based on Long Beach research
        vendor_costs = {
            1: 21000,   # PATH (best performer)
            2: 45000,   # Vendor 2
            3: 78000,   # MHALA (worst performer)
            4: 54000    # Vendor 4
        }
        
        base_cost = vendor_costs.get(vendor_id, 40000)
        
        if housed_count == 0:
            return base_cost * 2  # Penalty for no outcomes
        
        return base_cost
    
    def _calculate_efficiency_score(
        self,
        housing_rate: float,
        retention_rate: float,
        avg_days: float,
        cost_per_outcome: float
    ) -> float:
        """
        Calculate overall efficiency score (0-100).
        
        Weighted formula:
        - 35% housing rate
        - 30% retention rate
        - 20% speed (inverse of days)
        - 15% cost (inverse of cost per outcome)
        """
        # Housing rate component (0-35)
        housing_component = housing_rate * 35
        
        # Retention component (0-30)
        retention_component = retention_rate * 30
        
        # Speed component (0-20) - faster is better
        # Normalize: 30 days = 20 points, 90 days = 0 points
        speed_score = max(0, 20 - (avg_days / 90 * 20)) if avg_days > 0 else 0
        
        # Cost component (0-15) - lower is better
        # Normalize: $20K = 15 points, $80K = 0 points
        cost_score = max(0, 15 - ((cost_per_outcome - 20000) / 60000 * 15))
        
        total_score = (
            housing_component +
            retention_component +
            speed_score +
            cost_score
        )
        
        return min(100, max(0, total_score))
    
    async def get_qr_analytics(
        self,
        start_date: date,
        end_date: date
    ) -> List[Dict]:
        """
        Get analytics for all QR code locations.
        
        Returns scan counts, conversion rates, and territory assignments.
        """
        # Get all QR locations (RLS filters by org)
        locations_result = await self.db.execute(
            select(QRLocation).where(QRLocation.active == True)
        )
        locations = locations_result.scalars().all()
        
        analytics = []
        
        for location in locations:
            # Count scans in date range
            scans_result = await self.db.execute(
                select(func.count(QRScanEvent.id)).where(
                    and_(
                        QRScanEvent.qr_location_id == location.id,
                        QRScanEvent.scanned_at >= datetime.combine(start_date, datetime.min.time()),
                        QRScanEvent.scanned_at <= datetime.combine(end_date, datetime.max.time())
                    )
                )
            )
            total_scans = scans_result.scalar() or 0
            
            # Count completed intakes
            intakes_result = await self.db.execute(
                select(func.count(QRScanEvent.id)).where(
                    and_(
                        QRScanEvent.qr_location_id == location.id,
                        QRScanEvent.resulted_in_intake == True,
                        QRScanEvent.scanned_at >= datetime.combine(start_date, datetime.min.time()),
                        QRScanEvent.scanned_at <= datetime.combine(end_date, datetime.max.time())
                    )
                )
            )
            completed_intakes = intakes_result.scalar() or 0
            
            conversion_rate = (
                completed_intakes / total_scans if total_scans > 0 else 0
            )
            
            # Get vendor info
            vendor_result = await self.db.execute(
                select(Vendor).where(Vendor.id == location.vendor_id)
            )
            vendor = vendor_result.scalar_one_or_none()
            
            analytics.append({
                "location_id": location.id,
                "location_name": location.name,
                "address": location.address,
                "latitude": float(location.latitude) if location.latitude else None,
                "longitude": float(location.longitude) if location.longitude else None,
                "vendor_id": location.vendor_id,
                "vendor_name": vendor.name if vendor else "Unknown",
                "total_scans": total_scans,
                "completed_intakes": completed_intakes,
                "conversion_rate": round(conversion_rate, 2),
                "qr_code_url": location.qr_code_url
            })
        
        return analytics
    
    async def get_client_density_heatmap(self) -> List[Dict]:
        """
        Get client location data for heat map visualization.
        
        Returns list of lat/lng coordinates for mapping.
        """
        # For demo: return QR scan locations as proxy for client density
        # In production: use actual client current_address geocoding
        
        qr_analytics = await self.get_qr_analytics(
            start_date=date.today() - timedelta(days=90),
            end_date=date.today()
        )
        
        heatmap_points = []
        
        for location in qr_analytics:
            if location["latitude"] and location["longitude"]:
                # Weight by scan count for heat intensity
                weight = location["total_scans"]
                
                heatmap_points.append({
                    "lat": location["latitude"],
                    "lng": location["longitude"],
                    "weight": weight
                })
        
        return heatmap_points
    
    async def get_vendor_territories(self) -> List[Dict]:
        """
        Get vendor territory boundaries for map visualization.
        
        For demo: Returns simplified territory definitions.
        In production: Use actual boundary_geojson from vendor_territories table.
        """
        vendors_result = await self.db.execute(
            select(Vendor).where(Vendor.active == True)
        )
        vendors = vendors_result.scalars().all()
        
        territories = []
        
        # Demo territories for Long Beach
        # In production: query vendor_territories table with boundary_geojson
        demo_territories = {
            1: {  # PATH - East Long Beach
                "center": {"lat": 33.7866, "lng": -118.1589},
                "radius": 3000,
                "color": "#3B82F6"
            },
            2: {  # Vendor 2 - Central
                "center": {"lat": 33.7701, "lng": -118.1937},
                "radius": 2500,
                "color": "#8B5CF6"
            },
            3: {  # MHALA - North
                "center": {"lat": 33.7950, "lng": -118.1700},
                "radius": 3500,
                "color": "#EF4444"
            },
            4: {  # Vendor 4 - West
                "center": {"lat": 33.7688, "lng": -118.2100},
                "radius": 2800,
                "color": "#F59E0B"
            }
        }
        
        for vendor in vendors:
            territory_data = demo_territories.get(vendor.id)
            
            if territory_data:
                territories.append({
                    "vendor_id": vendor.id,
                    "vendor_name": vendor.name,
                    "vendor_slug": vendor.slug,
                    **territory_data
                })
        
        return territories
