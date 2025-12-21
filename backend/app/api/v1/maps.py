"""
Map Data API - Endpoints for Google Maps Integration

Provides vendor territories, QR locations, client density,
and performance overlays for the city dashboard.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
from typing import List, Optional

from app.api.deps import get_db, get_current_user, require_city_admin
from app.models.user import User
from app.services.analytics_engine import AnalyticsEngine

router = APIRouter(prefix="/maps", tags=["Map Data"])


@router.get("/vendor-territories")
async def get_vendor_territories(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db),
    include_performance: bool = Query(False, description="Include performance overlay data")
):
    """
    Get vendor territory boundaries for map visualization.
    
    LAYER 8 ENDPOINT - City only.
    
    If include_performance=true, adds performance metrics to each territory.
    """
    analytics = AnalyticsEngine(db)
    territories = await analytics.get_vendor_territories()
    
    if include_performance:
        # Get performance data for date range
        end_date = date.today()
        start_date = end_date - timedelta(days=30)
        
        performance_data = await analytics.calculate_vendor_performance(
            start_date=start_date,
            end_date=end_date
        )
        
        # Merge performance into territories
        performance_map = {p["vendor_id"]: p for p in performance_data}
        
        for territory in territories:
            vendor_perf = performance_map.get(territory["vendor_id"], {})
            territory["performance"] = {
                "cost_per_outcome": vendor_perf.get("cost_per_outcome", 0),
                "housing_rate": vendor_perf.get("housing_rate", 0),
                "retention_6mo": vendor_perf.get("retention_6mo", 0),
                "efficiency_score": vendor_perf.get("efficiency_score", 0),
                "rank": vendor_perf.get("rank", 0)
            }
    
    return {
        "territories": territories,
        "total_count": len(territories)
    }


@router.get("/qr-locations")
async def get_qr_locations(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """
    Get QR code locations with scan analytics.
    
    LAYER 8 ENDPOINT - City only.
    """
    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()
    
    analytics = AnalyticsEngine(db)
    locations = await analytics.get_qr_analytics(start_date, end_date)
    
    return {
        "locations": locations,
        "total_count": len(locations),
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        }
    }


@router.get("/client-density")
async def get_client_density(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get client density data for heat map visualization.
    
    LAYER 8 ENDPOINT - City only.
    
    Returns weighted lat/lng points for Google Maps heat layer.
    """
    analytics = AnalyticsEngine(db)
    heatmap_points = await analytics.get_client_density_heatmap()
    
    return {
        "points": heatmap_points,
        "total_points": len(heatmap_points)
    }


@router.get("/performance-overlay")
async def get_performance_overlay(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db),
    metric: str = Query("cost_per_outcome", description="Metric to overlay: cost_per_outcome, housing_rate, retention_6mo, efficiency_score"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """
    Get performance data formatted for map overlay coloring.
    
    LAYER 8 ENDPOINT - City only.
    
    Returns vendor IDs with color values based on performance metric.
    Green = good, Yellow = moderate, Red = poor.
    """
    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()
    
    analytics = AnalyticsEngine(db)
    performance_data = await analytics.calculate_vendor_performance(
        start_date=start_date,
        end_date=end_date
    )
    
    overlay_data = []
    
    for vendor in performance_data:
        value = vendor.get(metric, 0)
        color = _get_performance_color(metric, value)
        
        overlay_data.append({
            "vendor_id": vendor["vendor_id"],
            "vendor_name": vendor["vendor_name"],
            "metric_value": value,
            "color": color,
            "rank": vendor["rank"]
        })
    
    return {
        "overlay": overlay_data,
        "metric": metric,
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        }
    }


def _get_performance_color(metric: str, value: float) -> str:
    """
    Determine color for performance metric value.
    
    Returns hex color: green (good), yellow (moderate), red (poor).
    """
    if metric == "cost_per_outcome":
        # Lower is better
        if value <= 25000:
            return "#10B981"  # Green
        elif value <= 50000:
            return "#F59E0B"  # Yellow
        else:
            return "#EF4444"  # Red
    
    elif metric in ["housing_rate", "retention_6mo"]:
        # Higher is better (0-1 scale)
        if value >= 0.75:
            return "#10B981"  # Green
        elif value >= 0.50:
            return "#F59E0B"  # Yellow
        else:
            return "#EF4444"  # Red
    
    elif metric == "efficiency_score":
        # Higher is better (0-100 scale)
        if value >= 75:
            return "#10B981"  # Green
        elif value >= 50:
            return "#F59E0B"  # Yellow
        else:
            return "#EF4444"  # Red
    
    return "#6B7280"  # Gray default
