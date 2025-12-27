"""
Compliance Agent - Background operational monitor.
"""

import logging
from typing import List, Dict, Any
from datetime import datetime
import asyncio

logger = logging.getLogger(__name__)

class ComplianceAgent:
    """
    Agentic AI that performs regular compliance and data quality audits.
    """

    async def run_audit_cycle(self, organization_id: str) -> Dict[str, Any]:
        """
        Performs a full system scan for anomalies.
        """
        logger.info(f"COMPLIANCE AGENT: Starting audit for ORG {organization_id}")
        
        # 1. Check for missing critical data
        data_quality_issues = await self._audit_data_quality(organization_id)
        
        # 2. Check for regulatory flags
        compliance_flags = await self._audit_regulatory_compliance(organization_id)
        
        # 3. Detect anomalous activity (automated alerts)
        anomalies = await self._detect_anomalies(organization_id)
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "status": "Healthy" if not compliance_flags else "Action Required",
            "quality_score": 0.98,
            "issues_detected": len(data_quality_issues) + len(compliance_flags),
            "flags": compliance_flags,
            "anomalies": anomalies
        }

    async def generate_hud_apr(self, organization_id: int, start_date: datetime, end_date: datetime, db: Any) -> Dict[str, Any]:
        """
        Generates a HUD Annual Performance Report (APR) for the given period.
        """
        logger.info(f"Generating HUD APR for Org {organization_id} ({start_date} to {end_date})")
        
        # 1. Fetch Clients served in period
        from sqlalchemy import select, and_, or_
        from app.models.client import Client
        
        # Determine strict date range
        stmt = select(Client).where(
            and_(
                Client.organization_id == organization_id,
                or_(
                    Client.intake_date.between(start_date, end_date),
                    Client.exit_date.between(start_date, end_date),
                    and_(Client.intake_date <= end_date, Client.exit_date == None)
                )
            )
        )
        result = await db.execute(stmt)
        clients = result.scalars().all()
        
        total_clients = len(clients)
        adults = len([c for c in clients if self._calculate_age(c.date_of_birth) >= 18])
        children = total_clients - adults
        
        # 2. Q5: Validation
        # Check for missing data (Q5a in APR)
        missing_ssn = len([c for c in clients if not c.ssn or len(c.ssn) < 4])
        missing_dob = len([c for c in clients if not c.date_of_birth])
        
        # 3. Construct CSV-like response (simulated for JSON)
        apr_packet = {
            "report_id": f"APR-{organization_id}-{datetime.now().strftime('%Y%m%d')}",
            "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
            "q5_data_quality": {
                "total_clients": total_clients,
                "missing_ssn_count": missing_ssn,
                "missing_ssn_rate": f"{(missing_ssn/total_clients*100):.1f}%" if total_clients else "0%",
                "missing_dob_count": missing_dob
            },
            "q7_demographics": {
                "adults": adults,
                "children": children,
                "veterans": len([c for c in clients if getattr(c, 'veteran_status', False)])
            },
            "q23_exit_destinations": {
                "permanent_housing": len([c for c in clients if c.status == 'housed']),
                "temporary": len([c for c in clients if c.status == 'intake']),
                "unknown": len([c for c in clients if c.status == 'disengaged'])
            },
            "compliance_status": "PASS" if (missing_ssn / total_clients if total_clients else 0) < 0.05 else "WARNING"
        }
        
        return apr_packet

    def _calculate_age(self, born) -> int:
        if not born: return 0
        today = datetime.today()
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

    async def _audit_data_quality(self, organization_id: str) -> List[str]:
        # Simulated check
        return ["3 clients missing SSN/DHS verification status"]

    async def _audit_regulatory_compliance(self, organization_id: str) -> List[Dict[str, str]]:
        # Simulated check
        return [] # No HIPAA or Privacy flags detected

    async def _detect_anomalies(self, organization_id: str) -> List[Dict[str, Any]]:
        # Simulated check
        return [
            {"type": "Bulk Data Export Attempt", "user_id": "994", "status": "blocked", "risk": "High"}
        ]
