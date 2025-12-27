# SECURITY FIXES - INSTRUCTIONS FOR ANTIGRAVITY AGENT

This document contains all security fixes and improvements that need to be applied to First Contact EIS.

---

## CRITICAL SECURITY FIXES (DO IMMEDIATELY)

### 1. ROTATE ALL EXPOSED SECRETS

**Problem:** API keys and passwords are exposed in `backend/.env` file which is in git history.

**Actions Required:**

1. **Rotate Anthropic API Key:**
   - Go to https://console.anthropic.com/settings/keys
   - Delete key: `sk-ant-api03-AQ.Ab8RN6K_I7BgqCP55kdqJxvnVeB_QzadQJ4OCI0BLLRUphxNcQ`
   - Create new key
   - Store in GCP Secret Manager:
     ```bash
     echo -n "NEW_KEY_HERE" | gcloud secrets versions add nexus-anthropic-key \
         --project=einharjer-valhalla --data-file=-
     ```

2. **Generate New JWT Secret:**
   ```bash
   NEW_JWT_SECRET=$(openssl rand -base64 64)
   echo -n "$NEW_JWT_SECRET" | gcloud secrets versions add nexus-jwt-secret \
       --project=einharjer-valhalla --data-file=-
   ```

3. **Rotate Database Password:**
   ```bash
   # Generate new password
   NEW_DB_PASS=$(openssl rand -base64 24)

   # Update Cloud SQL user
   gcloud sql users set-password firstcontact_app \
       --instance=firstcontact-eis-db \
       --password="$NEW_DB_PASS" \
       --project=einharjer-valhalla

   # Store new DATABASE_URL in Secret Manager
   NEW_DB_URL="postgresql+asyncpg://firstcontact_app:${NEW_DB_PASS}@/firstcontact?host=/cloudsql/einharjer-valhalla:us-central1:firstcontact-eis-db"
   echo -n "$NEW_DB_URL" | gcloud secrets versions add nexus-db-url \
       --project=einharjer-valhalla --data-file=-
   ```

4. **Remove secrets from git history:**
   ```bash
   # Install git-filter-repo if needed
   pip install git-filter-repo

   # Remove .env from history
   git filter-repo --path backend/.env --invert-paths
   git push --force
   ```

---

### 2. FIX SQL INJECTION VULNERABILITY

**File:** `backend/app/database.py`

**Problem:** Line 63 uses f-string interpolation in SQL which allows SQL injection.

**Current Code:**
```python
await session.execute(text(f"SET app.organization_id = '{org_id}'"))
```

**Fixed Code:**
```python
await session.execute(
    text("SET LOCAL app.organization_id = :org_id"),
    {"org_id": organization_id}
)
```

**Full replacement for `set_tenant_context()` function:**
```python
async def set_tenant_context(session: AsyncSession, organization_id: int):
    """
    Set PostgreSQL session variable for Row-Level Security.

    SECURITY: Uses parameterized query to prevent SQL injection.
    """
    await session.execute(
        text("SET LOCAL app.organization_id = :org_id"),
        {"org_id": organization_id}
    )
    logger.debug(f"Set tenant context to organization_id={organization_id}")
```

---

### 3. FIX CORS CONFIGURATION

**File:** `backend/app/config.py`

**Problem:** Line 83 allows ALL origins with `["*"]`

**Current Code:**
```python
CORS_ORIGINS: List[str] = ["*"]
```

**Fixed Code - Replace with property:**
```python
@property
def cors_origins(self) -> List[str]:
    """Return appropriate CORS origins based on environment."""
    if self.is_production:
        return [
            "https://nexus-frontend-403538493221.us-east5.run.app",
            # Add custom domain when configured
        ]
    else:
        return [
            "http://localhost:3000",
            "http://localhost:8000",
            "http://127.0.0.1:3000",
        ]
```

**Also update `backend/app/main.py` CORS middleware:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,  # Use property instead of constant
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 4. ADD .env TO .gitignore

**File:** `.gitignore`

**Add these lines:**
```
# Environment files with secrets
.env
backend/.env
frontend/.env.local
*.env
!.env.example
```

---

### 5. ADD CONNECTION POOLING

**File:** `backend/app/database.py`

**Current engine creation (around line 15):**
```python
engine = create_async_engine(
    settings.get_database_url,
    echo=settings.DEBUG,
)
```

**Fixed with pooling:**
```python
engine = create_async_engine(
    settings.get_database_url,
    echo=settings.DEBUG,
    pool_pre_ping=True,        # Verify connections before use
    pool_size=20,              # Connection pool size
    max_overflow=10,           # Max overflow connections
    pool_recycle=3600,         # Recycle connections after 1 hour
)
```

---

### 6. IMPLEMENT SSN ENCRYPTION

**File:** `backend/app/models/client.py`

**Add encryption methods:**
```python
from cryptography.fernet import Fernet
from app.config import settings
import base64

class Client(Base, TenantMixin):
    # ... existing fields ...

    def set_ssn(self, ssn: str) -> None:
        """Encrypt and store SSN."""
        if not ssn:
            self.ssn_encrypted = None
            return

        key = base64.urlsafe_b64encode(settings.ENCRYPTION_KEY.encode()[:32].ljust(32, b'0'))
        f = Fernet(key)
        self.ssn_encrypted = f.encrypt(ssn.encode()).decode()

    def get_ssn(self) -> Optional[str]:
        """Decrypt and return SSN."""
        if not self.ssn_encrypted:
            return None

        key = base64.urlsafe_b64encode(settings.ENCRYPTION_KEY.encode()[:32].ljust(32, b'0'))
        f = Fernet(key)
        return f.decrypt(self.ssn_encrypted.encode()).decode()
```

**Generate encryption key and add to Secret Manager:**
```bash
ENCRYPTION_KEY=$(openssl rand -base64 32)
echo -n "$ENCRYPTION_KEY" | gcloud secrets create nexus-encryption-key \
    --project=einharjer-valhalla \
    --replication-policy=automatic \
    --data-file=-
```

---

### 7. ADD RATE LIMITING TO QR INTAKE

**File:** `backend/app/api/v1/intake.py`

**Install slowapi:**
```bash
pip install slowapi
```

**Add to top of file:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
```

**Add to main.py:**
```python
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

**Update QR intake endpoint:**
```python
@router.post("/qr/{qr_location_id}", response_model=IntakeResponse)
@limiter.limit("5/hour")  # 5 intakes per IP per hour
async def qr_intake(
    request: Request,  # Required for rate limiting
    qr_location_id: str,
    intake: IntakeRequest,
    db: AsyncSession = Depends(get_db)
):
    # ... existing code ...
```

---

## HIGH PRIORITY FIXES

### 8. ADD AUDIT LOGGING

**Create new file:** `backend/app/models/audit_log.py`

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, INET, JSONB
from app.models.base import Base, TenantMixin
import uuid

class AuditLog(Base, TenantMixin):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    action = Column(String(50), nullable=False)
    resource_type = Column(String(50))
    resource_id = Column(String(100))
    ip_address = Column(INET)
    user_agent = Column(Text)
    changes = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

**Create audit logging service:** `backend/app/services/audit_service.py`

```python
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog
from app.models.user import User
from typing import Optional, Dict, Any
from fastapi import Request

async def log_action(
    db: AsyncSession,
    action: str,
    user: Optional[User] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    changes: Optional[Dict[str, Any]] = None,
    request: Optional[Request] = None
):
    """Create an audit log entry."""
    audit_log = AuditLog(
        organization_id=user.organization_id if user else None,
        user_id=user.id if user else None,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id else None,
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None,
        changes=changes
    )
    db.add(audit_log)
    await db.commit()
```

**Add to Layer 8 endpoints:** `backend/app/api/v1/analytics.py`

```python
from app.services.audit_service import log_action

@router.get("/vendor-performance")
async def get_vendor_performance(
    request: Request,  # Add this
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db),
    ...
):
    # Log Layer 8 access
    await log_action(
        db=db,
        action="layer8_access",
        user=user,
        resource_type="vendor_performance",
        request=request
    )

    # ... existing code ...
```

---

### 9. FIX N+1 QUERY IN ANALYTICS

**File:** `backend/app/api/v1/analytics.py`

**Current code (lines 56-76) - N+1 problem:**
```python
for vendor in vendors:
    clients_result = await db.execute(
        select(Client).where(Client.assigned_vendor_id == vendor.id)
    )
    clients = clients_result.scalars().all()
```

**Fixed with single query:**
```python
from sqlalchemy import func, case

# Single query with aggregation
result = await db.execute(
    select(
        Vendor.id,
        Vendor.name,
        func.count(Client.id).label('total_clients'),
        func.sum(case((Client.status == 'housed', 1), else_=0)).label('housed_count'),
        func.avg(
            case(
                (
                    (Client.housed_date.isnot(None)) & (Client.intake_date.isnot(None)),
                    func.extract('day', Client.housed_date - Client.intake_date)
                ),
                else_=None
            )
        ).label('avg_days_to_housing')
    )
    .select_from(Vendor)
    .outerjoin(Client, Client.assigned_vendor_id == Vendor.id)
    .where(Vendor.active == True)
    .group_by(Vendor.id, Vendor.name)
)

vendor_data = []
for row in result:
    vendor_data.append({
        "id": row.id,
        "name": row.name,
        "metrics": {
            "total_clients": row.total_clients or 0,
            "housed_count": row.housed_count or 0,
            "housing_rate": (row.housed_count / row.total_clients) if row.total_clients > 0 else 0,
            "avg_days_to_housing": float(row.avg_days_to_housing) if row.avg_days_to_housing else 0,
        }
    })
```

---

### 10. ADD HEALTH CHECK ENDPOINT

**File:** `backend/app/main.py`

**Add health check route:**
```python
@app.get("/health", tags=["System"])
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint for Cloud Run.
    Verifies database connectivity.
    """
    try:
        # Test database connection
        await db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="Service unhealthy - database unreachable"
        )
```

---

### 11. LAYER 8 ROUTER-LEVEL PROTECTION

**File:** `backend/app/api/v1/analytics.py`

**Current approach:** Each endpoint has `user: User = Depends(require_city_admin)`

**Better approach - Router-level protection:**

```python
from fastapi import APIRouter, Depends
from app.api.deps import require_city_admin

# Create router with dependency applied to ALL routes
router = APIRouter(
    prefix="/analytics",
    tags=["Layer 8 Analytics"],
    dependencies=[Depends(require_city_admin)]  # Protects ALL endpoints
)

# Now individual endpoints don't need the dependency
@router.get("/vendor-performance")
async def get_vendor_performance(
    user: User = Depends(get_current_user),  # Still need user object
    db: AsyncSession = Depends(get_db),
    ...
):
    # require_city_admin already checked by router
    # ... existing code ...
```

---

### 12. PASSWORD STRENGTH VALIDATION

**File:** `backend/app/api/v1/auth.py`

**Install library:**
```bash
pip install password-strength
```

**Add validation:**
```python
from password_strength import PasswordPolicy

# Define policy
password_policy = PasswordPolicy.from_names(
    length=12,       # Minimum length
    uppercase=1,     # At least 1 uppercase
    numbers=1,       # At least 1 number
    special=1,       # At least 1 special character
)

@router.post("/register")
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Validate password strength
    password_issues = password_policy.test(user_data.password)
    if password_issues:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 12 characters with uppercase, number, and special character"
        )

    # ... existing registration code ...
```

---

## DATABASE FIXES

### 13. ADD MISSING INDEXES

**Create file:** `database/add_indexes.sql`

```sql
-- Performance indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_clients_status_housed_date
    ON clients(status, housed_date);

CREATE INDEX IF NOT EXISTS idx_clients_org_vendor_status
    ON clients(organization_id, assigned_vendor_id, status);

CREATE INDEX IF NOT EXISTS idx_qr_scan_events_timestamp
    ON qr_scan_events(scanned_at DESC);

CREATE INDEX IF NOT EXISTS idx_qr_scan_events_location_intake
    ON qr_scan_events(qr_location_id, resulted_in_intake);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_timestamp
    ON audit_logs(organization_id, created_at DESC) WHERE organization_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_logs_user
    ON audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs(action, created_at DESC);
```

**Apply:**
```bash
psql $DATABASE_URL -f database/add_indexes.sql
```

---

### 14. CREATE MATERIALIZED VIEW

**Create file:** `database/create_materialized_view.sql`

```sql
-- Materialized view for vendor performance (speeds up Layer 8 queries)
CREATE MATERIALIZED VIEW IF NOT EXISTS vendor_performance_summary AS
SELECT
    v.id as vendor_id,
    v.organization_id,
    v.name as vendor_name,
    COUNT(c.id) as total_clients,
    COUNT(CASE WHEN c.status = 'housed' THEN 1 END) as housed_count,
    COUNT(CASE WHEN c.status IN ('exited_positive', 'housed') THEN 1 END) as positive_outcomes,
    COUNT(CASE WHEN c.status = 'exited_negative' THEN 1 END) as negative_outcomes,
    AVG(CASE
        WHEN c.housed_date IS NOT NULL AND c.intake_date IS NOT NULL
        THEN EXTRACT(day FROM c.housed_date - c.intake_date)
    END) as avg_days_to_housing,
    AVG(c.exit_income_monthly) as avg_exit_income,
    MAX(c.updated_at) as last_client_update
FROM vendors v
LEFT JOIN clients c ON c.assigned_vendor_id = v.id
WHERE v.active = true
GROUP BY v.id, v.organization_id, v.name;

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_perf_summary_vendor
    ON vendor_performance_summary(vendor_id);

CREATE INDEX IF NOT EXISTS idx_vendor_perf_summary_org
    ON vendor_performance_summary(organization_id);

-- Refresh view (run this nightly via cron or Cloud Scheduler)
REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_performance_summary;
```

---

### 15. CREATE AUDIT LOGS TABLE

**Create file:** `database/create_audit_logs.sql`

```sql
-- Audit logging table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id INTEGER REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    changes JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_timestamp
    ON audit_logs(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user
    ON audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs(action, created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON audit_logs
    FOR ALL USING (
        organization_id = current_setting('app.organization_id', true)::INTEGER
        OR current_setting('app.organization_id', true) IS NULL
    );
```

---

## DEPLOYMENT UPDATES

### 16. UPDATE BACKEND DEPLOYMENT

**Update:** `backend/Dockerfile`

**Add health check:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir asyncpg psycopg2-binary slowapi password-strength cryptography

# Copy application
COPY app/ ./app/

# Environment
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

# Run
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
```

---

### 17. UPDATE requirements.txt

**File:** `backend/requirements.txt`

**Add these dependencies:**
```
slowapi==0.1.9          # Rate limiting
password-strength==0.0.3.post2  # Password validation
cryptography==41.0.7    # SSN encryption
redis==5.0.1            # For caching (optional)
```

---

## GCP CONFIGURATION

### 18. SET UP SECRET MANAGER ACCESS

**Grant Cloud Run service account access to secrets:**

```bash
# Get service account
SERVICE_ACCOUNT=$(gcloud run services describe nexus-api \
    --region=us-east5 \
    --format='value(spec.template.spec.serviceAccountName)')

# Grant Secret Manager access
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

---

### 19. UPDATE CLOUD RUN DEPLOYMENT

**File:** `deploy.sh`

**Update backend deployment to use secrets:**

```bash
#!/bin/bash
set -e

PROJECT_ID="einharjer-valhalla"
REGION="us-east5"

echo "Deploying First Contact EIS Backend..."

# Build and deploy backend
gcloud run deploy nexus-api \
    --source=./backend \
    --region=$REGION \
    --project=$PROJECT_ID \
    --platform=managed \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=300 \
    --set-env-vars="ENVIRONMENT=production,GCP_PROJECT_ID=${PROJECT_ID},GCP_REGION=${REGION}" \
    --set-secrets="ANTHROPIC_API_KEY=nexus-anthropic-key:latest,JWT_SECRET=nexus-jwt-secret:latest,DATABASE_URL=nexus-db-url:latest,ENCRYPTION_KEY=nexus-encryption-key:latest" \
    --add-cloudsql-instances="${PROJECT_ID}:us-central1:firstcontact-eis-db"

echo "✅ Backend deployed successfully!"
```

---

## MONITORING SETUP

### 20. CREATE CLOUD MONITORING DASHBOARD

**Create file:** `monitoring/dashboard.json`

```json
{
  "displayName": "First Contact EIS - Production",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Request Rate",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"nexus-api\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }]
          }
        }
      },
      {
        "xPos": 6,
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Error Rate",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"nexus-api\" metric.type=\"run.googleapis.com/request_count\" metric.labels.response_code_class=\"5xx\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }]
          }
        }
      }
    ]
  }
}
```

**Create dashboard:**
```bash
gcloud monitoring dashboards create --config-from-file=monitoring/dashboard.json
```

---

### 21. CREATE ALERTS

**Create file:** `monitoring/alerts.sh`

```bash
#!/bin/bash

PROJECT_ID="einharjer-valhalla"

# Alert 1: High error rate
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Error Rate - First Contact EIS" \
    --condition-display-name="Error rate > 5%" \
    --condition-threshold-value=0.05 \
    --condition-threshold-duration=300s \
    --condition-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="nexus-api" AND metric.type="run.googleapis.com/request_count" AND metric.labels.response_code_class="5xx"'

# Alert 2: High latency
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Latency - First Contact EIS" \
    --condition-display-name="P99 latency > 2s" \
    --condition-threshold-value=2000 \
    --condition-threshold-duration=300s \
    --condition-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="nexus-api" AND metric.type="run.googleapis.com/request_latencies"'
```

---

## TESTING UPDATES

### 22. ADD SECURITY TESTS

**Create file:** `backend/tests/test_security.py`

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_sql_injection_prevented():
    """Test that SQL injection in org_id is prevented."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Try to inject SQL via malicious JWT
        malicious_token = create_jwt_with_payload({
            "sub": "user_id",
            "org_id": "1; DROP TABLE clients;--"
        })

        response = await client.get(
            "/api/v1/clients",
            headers={"Authorization": f"Bearer {malicious_token}"}
        )

        # Should fail gracefully, not execute SQL
        assert response.status_code in [401, 400]

@pytest.mark.asyncio
async def test_rate_limiting():
    """Test that QR intake is rate limited."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Make 6 requests (limit is 5/hour)
        for i in range(6):
            response = await client.post(
                "/api/v1/intake/qr/lb-mlk-park",
                json={"first_name": "Test", "last_name": f"User{i}"}
            )

            if i < 5:
                assert response.status_code == 201
            else:
                assert response.status_code == 429  # Too Many Requests

@pytest.mark.asyncio
async def test_cors_restricted():
    """Test that CORS is restricted in production."""
    # Set production environment
    import os
    os.environ["ENVIRONMENT"] = "production"

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.options(
            "/api/v1/clients",
            headers={"Origin": "https://evil.com"}
        )

        # Should not allow evil.com
        assert "https://evil.com" not in response.headers.get("Access-Control-Allow-Origin", "")
```

---

## EXECUTION CHECKLIST

### Phase 1: Immediate (Do Today)
- [ ] Rotate Anthropic API key
- [ ] Generate new JWT secret
- [ ] Rotate database password
- [ ] Store all secrets in GCP Secret Manager
- [ ] Add .env to .gitignore
- [ ] Remove .env from git history
- [ ] Fix SQL injection in database.py
- [ ] Fix CORS in config.py
- [ ] Deploy backend with new secrets

### Phase 2: High Priority (This Week)
- [ ] Add connection pooling
- [ ] Implement SSN encryption
- [ ] Add rate limiting to QR intake
- [ ] Add audit logging
- [ ] Fix N+1 query in analytics
- [ ] Add health check endpoint
- [ ] Add Layer 8 router-level protection
- [ ] Add password strength validation
- [ ] Create database indexes
- [ ] Create materialized view
- [ ] Set up monitoring dashboard
- [ ] Create alerts

### Phase 3: Medium Priority (Next Week)
- [ ] Add security tests
- [ ] Implement caching for Layer 8
- [ ] Add client deduplication
- [ ] Implement email verification
- [ ] Add phone number validation
- [ ] Create HIPAA compliance documentation
- [ ] Add integration tests
- [ ] Load testing

---

## VALIDATION COMMANDS

After applying fixes, run these to verify:

```bash
# 1. Verify secrets are in Secret Manager
gcloud secrets list --project=einharjer-valhalla

# 2. Verify .env not in git
git ls-files | grep ".env"  # Should return nothing

# 3. Run security tests
cd backend
pytest tests/test_security.py -v

# 4. Run all tests
pytest tests/ -v --cov=app

# 5. Check backend health
curl https://YOUR-BACKEND-URL/health

# 6. Verify CORS
curl -H "Origin: https://evil.com" -I https://YOUR-BACKEND-URL/api/v1/clients
# Should NOT include Access-Control-Allow-Origin for evil.com

# 7. Test rate limiting
for i in {1..6}; do curl -X POST https://YOUR-BACKEND-URL/api/v1/intake/qr/lb-mlk-park -d '{"first_name":"Test","last_name":"User"}' -H "Content-Type: application/json"; done
# 6th request should return 429
```

---

## NOTES FOR ANTIGRAVITY AGENT

1. **All code changes are self-contained** - copy exact code blocks
2. **Run commands in order** - especially secret rotation before deployment
3. **Verify each phase** - use validation commands
4. **Database changes require connection** - use Cloud SQL Proxy
5. **Backend redeployment required** - after code changes
6. **No frontend changes needed** - all fixes are backend/infrastructure

---

**End of Security Fixes Document**
