# SECURITY FIXES - VERTEX AI EDITION
# For First Contact EIS using Vertex AI Claude (GCP-Native)

This document contains all security fixes for a GCP-native application using Vertex AI Claude.

---

## CRITICAL SECURITY FIXES (DO IMMEDIATELY)

### 1. VERTEX AI IS ALREADY SECURE ✅

**Good News:** Since you're using Vertex AI Claude instead of direct Anthropic API:
- ✅ **No API key in .env** - Vertex AI uses Application Default Credentials
- ✅ **Authentication via IAM** - No secret rotation needed
- ✅ **Already GCP-native** - Better integration

**Current Implementation:**
Your code currently uses `anthropic` Python client directly, but we need to switch to Vertex AI SDK.

---

### 2. SWITCH FROM ANTHROPIC SDK TO VERTEX AI SDK

**File:** `backend/app/services/ai_recommendations.py`

**Current Code (WRONG - uses Anthropic directly):**
```python
import anthropic

self.client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)
```

**Fixed Code (RIGHT - uses Vertex AI):**
```python
from anthropic import AnthropicVertex

self.client = AnthropicVertex(
    region="us-east5",  # Same as your Cloud Run region
    project_id="einharjer-valhalla"
)
# No API key needed! Uses Application Default Credentials
```

**Full File Replacement:**
```python
"""
AI Recommendations Service - Strategic Insights Using Vertex AI Claude

Uses Vertex AI Claude (GCP-native) instead of direct Anthropic API.
Authentication via Application Default Credentials (IAM).
"""

from typing import Dict, List, Optional
from anthropic import AnthropicVertex
import logging

logger = logging.getLogger(__name__)


class AIRecommendationsService:
    """
    Generates strategic recommendations using Vertex AI Claude Haiku.

    GCP-Native: Uses Vertex AI SDK with IAM authentication.
    No API keys required - uses Application Default Credentials.
    """

    def __init__(self):
        # GCP-native Vertex AI client
        self.client = AnthropicVertex(
            region="us-east5",
            project_id="einharjer-valhalla"
        )
        self.model = "claude-3-5-haiku-20241022"  # Vertex AI model name

    async def generate_vendor_insights(
        self,
        vendor_name: str,
        performance_data: Dict
    ) -> List[str]:
        """Generate AI insights for a specific vendor."""
        prompt = f"""Analyze this vendor's performance data and provide 2-3 brief strategic insights.

Vendor: {vendor_name}

Performance Metrics:
- Housing Rate: {performance_data.get('housing_rate', 0):.0%}
- 6-Month Retention: {performance_data.get('retention_6mo', 0):.0%}
- Cost Per Outcome: ${performance_data.get('cost_per_outcome', 0):,}
- Average Days to Housing: {performance_data.get('avg_days_to_housing', 0):.0f}
- Rank: #{performance_data.get('rank', 0)} out of total vendors

Provide actionable insights in bullet points. Each insight should be 1-2 sentences.
Focus on what the city should do with this data."""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=300,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            response_text = message.content[0].text

            # Parse bullet points
            insights = [
                line.strip().lstrip('•-*').strip()
                for line in response_text.split('\n')
                if line.strip() and len(line.strip()) > 10
            ]

            return insights[:3]

        except Exception as e:
            logger.error(f"Vertex AI error: {e}")
            return self._generate_rule_based_insights(vendor_name, performance_data)

    # ... rest of methods stay the same ...
```

**Update requirements.txt:**
```
# Remove old anthropic
# anthropic==0.XX.X

# Add Vertex AI anthropic
anthropic[vertex]==0.39.0
```

---

### 3. GRANT VERTEX AI PERMISSIONS

**Your Cloud Run service account needs Vertex AI access:**

```bash
# Get service account email
SERVICE_ACCOUNT=$(gcloud run services describe nexus-api \
    --region=us-east5 \
    --format='value(spec.template.spec.serviceAccountName)' \
    --project=einharjer-valhalla)

# Grant Vertex AI User role
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"

echo "✅ Vertex AI permissions granted to: $SERVICE_ACCOUNT"
```

---

### 4. REMOVE ANTHROPIC_API_KEY FROM .ENV

**File:** `backend/.env`

**Remove this line:**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...  # DELETE THIS - not needed for Vertex AI
```

**Keep only:**
```bash
# Environment
ENVIRONMENT=development

# Database (Cloud SQL Proxy for development)
DATABASE_URL=postgresql+asyncpg://firstcontact_app:NEW_PASSWORD@127.0.0.1:5432/firstcontact

# JWT - MUST CHANGE IN PRODUCTION
JWT_SECRET=GENERATE_NEW_SECRET_HERE

# GCP
GCP_PROJECT_ID=einharjer-valhalla
GCP_REGION=us-east5

# Development
DEBUG=true
```

---

### 5. FIX SQL INJECTION VULNERABILITY ⚠️

**File:** `backend/app/database.py`

**Current Code (VULNERABLE):**
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

**I WILL APPLY THIS FIX FOR YOU** ✅

---

### 6. FIX CORS CONFIGURATION ⚠️

**File:** `backend/app/config.py`

**Current Code (ALLOWS ALL ORIGINS):**
```python
CORS_ORIGINS: List[str] = ["*"]
```

**Fixed Code:**
```python
@property
def cors_origins(self) -> List[str]:
    """Return appropriate CORS origins based on environment."""
    if self.is_production:
        return [
            "https://nexus-frontend-403538493221.us-east5.run.app",
            # Add your custom domain when you configure it
        ]
    else:
        return [
            "http://localhost:3000",
            "http://localhost:8000",
            "http://127.0.0.1:3000",
        ]
```

**I WILL APPLY THIS FIX FOR YOU** ✅

---

### 7. ROTATE DATABASE PASSWORD

**Since DB password is exposed in .env:**

```bash
# Generate secure password
NEW_DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)
echo "New password: $NEW_DB_PASSWORD"

# Update Cloud SQL user
gcloud sql users set-password firstcontact_app \
    --instance=firstcontact-eis-db \
    --password="$NEW_DB_PASSWORD" \
    --project=einharjer-valhalla

# Store in Secret Manager
echo -n "postgresql+asyncpg://firstcontact_app:${NEW_DB_PASSWORD}@/firstcontact?host=/cloudsql/einharjer-valhalla:us-central1:firstcontact-eis-db" | \
gcloud secrets versions add nexus-db-url \
    --project=einharjer-valhalla \
    --data-file=-

echo "✅ Database password rotated and stored in Secret Manager"
```

---

### 8. GENERATE NEW JWT SECRET

```bash
# Generate cryptographically strong JWT secret
NEW_JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')

# Store in Secret Manager
echo -n "$NEW_JWT_SECRET" | gcloud secrets versions add nexus-jwt-secret \
    --project=einharjer-valhalla \
    --data-file=- \
    || gcloud secrets create nexus-jwt-secret \
        --project=einharjer-valhalla \
        --replication-policy=automatic \
        --data-file=- <<< "$NEW_JWT_SECRET"

echo "✅ JWT secret generated and stored"
```

---

### 9. ADD .env TO .gitignore

**File:** `.gitignore`

**Add these lines:**
```
# Environment files (NEVER commit these!)
.env
backend/.env
frontend/.env.local
*.env
!.env.example

# GCP credentials
*-key.json
service-account*.json
```

**I WILL APPLY THIS FIX FOR YOU** ✅

---

### 10. REMOVE SECRETS FROM GIT HISTORY

```bash
# CRITICAL: Remove .env from all git history
git filter-repo --path backend/.env --invert-paths --force

# Force push to remove from remote
git push origin main --force

# Alternative if you don't have git-filter-repo:
# Use BFG Repo Cleaner
# java -jar bfg.jar --delete-files .env
# git reflog expire --expire=now --all
# git gc --prune=now --aggressive
# git push --force
```

---

## HIGH PRIORITY FIXES

### 11. ADD CONNECTION POOLING

**File:** `backend/app/database.py`

**Replace engine creation:**
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# GCP-optimized connection pooling
engine = create_async_engine(
    settings.get_database_url,
    echo=settings.DEBUG,

    # Connection pooling (critical for Cloud SQL)
    pool_pre_ping=True,        # Verify connections before use
    pool_size=10,              # Core pool size
    max_overflow=20,           # Additional connections when needed
    pool_recycle=3600,         # Recycle connections after 1 hour
    pool_timeout=30,           # Wait 30s for connection from pool

    # Cloud SQL specific optimizations
    connect_args={
        "server_settings": {
            "application_name": "first-contact-eis",
            "jit": "off"  # Disable JIT for faster simple queries
        }
    }
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()


async def get_db() -> AsyncSession:
    """Dependency for FastAPI routes."""
    async with async_session_maker() as session:
        yield session


async def set_tenant_context(session: AsyncSession, organization_id: int):
    """
    Set PostgreSQL session variable for Row-Level Security.

    SECURITY: Uses parameterized query to prevent SQL injection.
    GCP: Session variable scoped to single connection from pool.
    """
    await session.execute(
        text("SET LOCAL app.organization_id = :org_id"),
        {"org_id": organization_id}
    )
    logger.debug(f"RLS context set: org_id={organization_id}")
```

**I WILL APPLY THIS FIX FOR YOU** ✅

---

### 12. ADD RATE LIMITING (Cloud Armor Integration)

**Two approaches:**

**Option A: Application-Level (Simple)**

```bash
# Install slowapi
pip install slowapi redis
```

**File:** `backend/app/main.py`

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="First Contact EIS API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

**File:** `backend/app/api/v1/intake.py`

```python
from slowapi import Limiter
from fastapi import Request

limiter = Limiter(key_func=lambda request: request.client.host)

@router.post("/qr/{qr_location_id}")
@limiter.limit("5/hour")  # 5 intakes per IP per hour
async def qr_intake(
    request: Request,
    qr_location_id: str,
    intake: IntakeRequest,
    db: AsyncSession = Depends(get_db)
):
    # ... existing code ...
```

**Option B: Cloud Armor (GCP-Native, Recommended)**

```bash
# Create Cloud Armor security policy
gcloud compute security-policies create rate-limit-policy \
    --project=einharjer-valhalla

# Add rate limit rule
gcloud compute security-policies rules create 1000 \
    --security-policy=rate-limit-policy \
    --expression="request.path.matches('/api/v1/intake/qr/')" \
    --action=rate-based-ban \
    --rate-limit-threshold-count=5 \
    --rate-limit-threshold-interval-sec=3600 \
    --ban-duration-sec=3600 \
    --project=einharjer-valhalla

# Default allow rule
gcloud compute security-policies rules create 2147483647 \
    --security-policy=rate-limit-policy \
    --action=allow \
    --project=einharjer-valhalla

echo "✅ Cloud Armor rate limiting configured"
```

---

### 13. ADD HEALTH CHECK ENDPOINT

**File:** `backend/app/main.py`

```python
from sqlalchemy import text

@app.get("/health", tags=["System"])
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    GCP-native health check endpoint.

    Cloud Run uses this to determine service health.
    Checks database connectivity and basic functionality.
    """
    try:
        # Test database connection
        await db.execute(text("SELECT 1"))

        # Test RLS is enabled (sample check)
        result = await db.execute(
            text("SELECT COUNT(*) FROM pg_policies WHERE policyname = 'tenant_isolation'")
        )
        rls_count = result.scalar()

        return {
            "status": "healthy",
            "service": "first-contact-eis-api",
            "database": "connected",
            "rls_policies": rls_count,
            "region": "us-east5",
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"Service unhealthy: {str(e)}"
        )

@app.get("/", tags=["System"])
async def root():
    """Root endpoint - redirects to API docs."""
    return {
        "service": "First Contact EIS API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }
```

**I WILL APPLY THIS FIX FOR YOU** ✅

---

### 14. FIX N+1 QUERY IN ANALYTICS

**File:** `backend/app/api/v1/analytics.py`

**Replace vendor performance endpoint:**
```python
from sqlalchemy import func, case, and_

@router.get("/vendor-performance")
async def get_vendor_performance(
    request: Request,
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """
    Get vendor performance comparison (LAYER 8).

    GCP-optimized: Single query with aggregation instead of N+1.
    """
    # Audit log (Cloud Logging integration)
    logger.info(
        f"Layer 8 access: user={user.email} endpoint=vendor-performance",
        extra={
            "labels": {
                "org_id": user.organization_id,
                "user_role": user.role,
                "layer": "8"
            }
        }
    )

    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()

    # Single optimized query (GCP Cloud SQL optimized)
    result = await db.execute(
        select(
            Vendor.id,
            Vendor.name,
            func.count(Client.id).label('total_clients'),
            func.sum(case((Client.status == 'housed', 1), else_=0)).label('housed_count'),
            func.sum(case((Client.status.in_(['exited_positive', 'housed']), 1), else_=0)).label('positive_exits'),
            func.avg(
                case(
                    (
                        and_(Client.housed_date.isnot(None), Client.intake_date.isnot(None)),
                        func.extract('day', Client.housed_date - Client.intake_date)
                    ),
                    else_=None
                )
            ).label('avg_days_to_housing'),
            func.avg(Client.exit_income_monthly).label('avg_exit_income')
        )
        .select_from(Vendor)
        .outerjoin(Client, and_(
            Client.assigned_vendor_id == Vendor.id,
            Client.intake_date >= start_date,
            Client.intake_date <= end_date
        ))
        .where(Vendor.active == True)
        .group_by(Vendor.id, Vendor.name)
    )

    vendor_data = []
    for row in result:
        total = row.total_clients or 0
        housed = row.housed_count or 0

        vendor_data.append({
            "id": row.id,
            "name": row.name,
            "metrics": {
                "total_clients": total,
                "housed_count": housed,
                "housing_rate": housed / total if total > 0 else 0,
                "positive_exits": row.positive_exits or 0,
                "avg_days_to_housing": float(row.avg_days_to_housing or 0),
                "avg_exit_income": float(row.avg_exit_income or 0),
            }
        })

    return {
        "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
        "vendors": vendor_data
    }
```

**I WILL APPLY THIS FIX FOR YOU** ✅

---

## DATABASE OPTIMIZATIONS (GCP Cloud SQL)

### 15. ADD PERFORMANCE INDEXES

**Create file:** `database/gcp_performance_indexes.sql`

```sql
-- GCP Cloud SQL Performance Indexes
-- Optimized for Cloud SQL PostgreSQL 15

-- Analytics query optimization (Layer 8)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_vendor_status_dates
    ON clients(assigned_vendor_id, status, intake_date, housed_date)
    WHERE status IN ('housed', 'exited_positive');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_org_intake_date
    ON clients(organization_id, intake_date DESC)
    INCLUDE (status, assigned_vendor_id);

-- QR analytics optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_qr_scans_location_conversion
    ON qr_scan_events(qr_location_id, resulted_in_intake, scanned_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_qr_locations_vendor_active
    ON qr_locations(vendor_id, active)
    WHERE active = true;

-- Audit log queries (Cloud Logging integration)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_timestamp_action
    ON audit_logs(created_at DESC, action)
    INCLUDE (user_id, organization_id);

-- User authentication lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active
    ON users(email, active)
    WHERE active = true;

-- Vendor performance aggregation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_exit_metrics
    ON clients(assigned_vendor_id, exit_date, exit_income_monthly)
    WHERE exit_date IS NOT NULL;

ANALYZE;  -- Update statistics for query planner

SELECT 'GCP Cloud SQL indexes created successfully!' as status;
```

**Apply indexes:**
```bash
# Connect via Cloud SQL Proxy
psql "postgresql://firstcontact_app:PASSWORD@127.0.0.1:5432/firstcontact" \
    -f database/gcp_performance_indexes.sql
```

**I WILL CREATE THIS FILE FOR YOU** ✅

---

### 16. CREATE MATERIALIZED VIEW (Cloud SQL Optimized)

**Create file:** `database/gcp_materialized_views.sql`

```sql
-- Materialized View for Vendor Performance (Layer 8)
-- GCP Cloud SQL optimized with CONCURRENTLY option

CREATE MATERIALIZED VIEW IF NOT EXISTS vendor_performance_mv AS
SELECT
    v.id as vendor_id,
    v.organization_id,
    v.name as vendor_name,
    v.slug as vendor_slug,

    -- Client counts
    COUNT(c.id) as total_clients,
    COUNT(CASE WHEN c.status = 'housed' THEN 1 END) as housed_count,
    COUNT(CASE WHEN c.status IN ('exited_positive', 'housed') THEN 1 END) as positive_outcomes,
    COUNT(CASE WHEN c.status = 'exited_negative' THEN 1 END) as negative_outcomes,
    COUNT(CASE WHEN c.status = 'disengaged' THEN 1 END) as disengaged_count,

    -- Performance metrics
    AVG(CASE
        WHEN c.housed_date IS NOT NULL AND c.intake_date IS NOT NULL
        THEN EXTRACT(day FROM c.housed_date - c.intake_date)
    END) as avg_days_to_housing,

    AVG(c.exit_income_monthly) as avg_exit_income,

    -- Rates (calculated as floats for faster queries)
    CASE
        WHEN COUNT(c.id) > 0
        THEN COUNT(CASE WHEN c.status = 'housed' THEN 1 END)::float / COUNT(c.id)::float
        ELSE 0
    END as housing_rate,

    -- Timestamp for cache invalidation
    NOW() as calculated_at,
    MAX(c.updated_at) as last_client_update

FROM vendors v
LEFT JOIN clients c ON c.assigned_vendor_id = v.id
WHERE v.active = true
GROUP BY v.id, v.organization_id, v.name, v.slug;

-- Unique index required for CONCURRENTLY refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_perf_mv_vendor_id
    ON vendor_performance_mv(vendor_id);

CREATE INDEX IF NOT EXISTS idx_vendor_perf_mv_org
    ON vendor_performance_mv(organization_id);

-- Initial population
REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_performance_mv;

SELECT 'Materialized view created and populated!' as status;
```

**Set up Cloud Scheduler to refresh nightly:**
```bash
# Create Cloud Function to refresh view
gcloud functions deploy refresh-vendor-performance \
    --runtime=python311 \
    --trigger-topic=refresh-analytics \
    --entry-point=refresh_view \
    --region=us-east5 \
    --project=einharjer-valhalla

# Create Cloud Scheduler job (runs at 2 AM daily)
gcloud scheduler jobs create pubsub refresh-analytics-daily \
    --schedule="0 2 * * *" \
    --topic=refresh-analytics \
    --message-body='{"view":"vendor_performance_mv"}' \
    --location=us-east5 \
    --project=einharjer-valhalla

echo "✅ Nightly materialized view refresh scheduled"
```

**I WILL CREATE THIS FILE FOR YOU** ✅

---

## DEPLOYMENT UPDATES (GCP-NATIVE)

### 17. UPDATE Dockerfile (Cloud Run Optimized)

**File:** `backend/Dockerfile`

```dockerfile
# Multi-stage build for smaller images (saves Cloud Run costs)
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage (smaller image)
FROM python:3.11-slim

WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY app/ ./app/

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PATH=/root/.local/bin:$PATH
ENV PORT=8080

# GCP-specific: Enable Cloud Profiler (optional)
ENV GOOGLE_CLOUD_PROFILER_ENABLED=false

EXPOSE 8080

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health', timeout=3)"

# Run with uvicorn (optimized for Cloud Run)
CMD exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port $PORT \
    --workers 1 \
    --loop uvloop \
    --log-level info
```

**I WILL APPLY THIS FIX FOR YOU** ✅

---

### 18. UPDATE requirements.txt (GCP-Native Dependencies)

**File:** `backend/requirements.txt`

```
# Web framework
fastapi==0.115.0
uvicorn[standard]==0.32.0
uvloop==0.21.0
httptools==0.6.4

# Database (Cloud SQL optimized)
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0
psycopg2-binary==2.9.10
alembic==1.14.0

# Authentication & Security
pydantic==2.10.3
pydantic-settings==2.6.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
cryptography==44.0.0

# GCP Native (Vertex AI Claude)
anthropic[vertex]==0.39.0
google-cloud-aiplatform==1.71.0
google-cloud-secret-manager==2.21.1
google-cloud-logging==3.11.3
google-cloud-sql-connector==1.14.0

# Rate limiting & Caching
slowapi==0.1.9
redis==5.2.0

# Password validation
password-strength==0.0.3.post2

# Testing
pytest==8.3.4
pytest-asyncio==0.24.0
pytest-cov==6.0.0
httpx==0.28.1

# Development
python-dotenv==1.0.1
```

**I WILL APPLY THIS FIX FOR YOU** ✅

---

### 19. UPDATED DEPLOYMENT SCRIPT (GCP-Native)

**File:** `deploy_gcp_native.sh`

```bash
#!/bin/bash
# GCP-Native Deployment Script for First Contact EIS
# Uses Vertex AI, Cloud SQL, Secret Manager, Cloud Run

set -e

PROJECT_ID="einharjer-valhalla"
REGION="us-east5"
SERVICE_NAME="first-contact-api"

echo "🚀 Deploying First Contact EIS (GCP-Native)"
echo "=============================================="

# Step 1: Verify gcloud authentication
echo "📋 Checking GCP authentication..."
gcloud auth list --filter=status:ACTIVE --format="value(account)"

# Step 2: Set project
gcloud config set project $PROJECT_ID

# Step 3: Enable required APIs
echo "🔧 Enabling required GCP APIs..."
gcloud services enable \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    aiplatform.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    --project=$PROJECT_ID

# Step 4: Build and deploy backend
echo "🐳 Building and deploying backend to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --source=./backend \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=300 \
    --concurrency=80 \
    --port=8080 \
    --set-env-vars="ENVIRONMENT=production,GCP_PROJECT_ID=${PROJECT_ID},GCP_REGION=${REGION}" \
    --set-secrets="JWT_SECRET=nexus-jwt-secret:latest,DATABASE_URL=nexus-db-url:latest" \
    --add-cloudsql-instances="${PROJECT_ID}:us-central1:firstcontact-eis-db" \
    --service-account="${SERVICE_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --project=$PROJECT_ID

# Step 5: Get backend URL
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --format='value(status.url)' \
    --project=$PROJECT_ID)

echo "✅ Backend deployed: $BACKEND_URL"

# Step 6: Test health check
echo "🏥 Testing health check..."
curl -f "$BACKEND_URL/health" || echo "⚠️  Health check failed"

# Step 7: Grant Vertex AI permissions
echo "🤖 Configuring Vertex AI permissions..."
SERVICE_ACCOUNT="${SERVICE_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user" \
    --condition=None

# Step 8: Deploy frontend (if exists)
if [ -d "./frontend" ]; then
    echo "🌐 Deploying frontend..."

    gcloud run deploy nexus-frontend \
        --source=./frontend \
        --region=$REGION \
        --platform=managed \
        --allow-unauthenticated \
        --memory=512Mi \
        --min-instances=0 \
        --max-instances=5 \
        --set-env-vars="NEXT_PUBLIC_API_URL=${BACKEND_URL}/api/v1" \
        --project=$PROJECT_ID

    FRONTEND_URL=$(gcloud run services describe nexus-frontend \
        --region=$REGION \
        --format='value(status.url)' \
        --project=$PROJECT_ID)

    echo "✅ Frontend deployed: $FRONTEND_URL"
fi

# Step 9: Summary
echo ""
echo "✅ Deployment Complete!"
echo "=============================================="
echo "Backend API: $BACKEND_URL"
echo "API Docs: $BACKEND_URL/docs"
echo "Health Check: $BACKEND_URL/health"
[ ! -z "$FRONTEND_URL" ] && echo "Frontend: $FRONTEND_URL"
echo ""
echo "Next steps:"
echo "1. Test endpoints: curl $BACKEND_URL/health"
echo "2. Monitor logs: gcloud run services logs read $SERVICE_NAME --region=$REGION"
echo "3. View metrics: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"
```

**Make executable:**
```bash
chmod +x deploy_gcp_native.sh
```

**I WILL CREATE THIS FILE FOR YOU** ✅

---

## MONITORING & OBSERVABILITY (GCP-NATIVE)

### 20. CLOUD LOGGING INTEGRATION

**File:** `backend/app/main.py`

**Add Cloud Logging:**
```python
import google.cloud.logging
from google.cloud.logging.handlers import CloudLoggingHandler
import logging

# Initialize Cloud Logging (GCP-native)
if settings.is_production:
    client = google.cloud.logging.Client(project=settings.GCP_PROJECT_ID)
    handler = CloudLoggingHandler(client, name="first-contact-eis")

    # Set up root logger
    cloud_logger = logging.getLogger()
    cloud_logger.setLevel(logging.INFO)
    cloud_logger.addHandler(handler)
else:
    logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)
```

**Log structured data for better querying:**
```python
# Layer 8 access logging
logger.info(
    "Layer 8 access",
    extra={
        "labels": {
            "layer": "8",
            "user_role": user.role,
            "org_id": user.organization_id,
            "endpoint": "vendor-performance"
        },
        "httpRequest": {
            "requestUrl": str(request.url),
            "userAgent": request.headers.get("user-agent")
        }
    }
)
```

---

### 21. CLOUD MONITORING DASHBOARD

**Create file:** `monitoring/gcp_dashboard.json`

```json
{
  "displayName": "First Contact EIS - Production Dashboard",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 4,
        "height": 4,
        "widget": {
          "title": "Cloud Run Request Rate",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"first-contact-api\" metric.type=\"run.googleapis.com/request_count\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_RATE",
                    "crossSeriesReducer": "REDUCE_SUM"
                  }
                }
              }
            }],
            "yAxis": {"label": "Requests/sec"}
          }
        }
      },
      {
        "xPos": 4,
        "width": 4,
        "height": 4,
        "widget": {
          "title": "Error Rate (5xx)",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"first-contact-api\" metric.type=\"run.googleapis.com/request_count\" metric.labels.response_code_class=\"5xx\"",
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
        "xPos": 8,
        "width": 4,
        "height": 4,
        "widget": {
          "title": "Response Latency (P95)",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"first-contact-api\" metric.type=\"run.googleapis.com/request_latencies\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_DELTA",
                    "crossSeriesReducer": "REDUCE_PERCENTILE_95"
                  }
                }
              }
            }],
            "yAxis": {"label": "Latency (ms)"}
          }
        }
      },
      {
        "yPos": 4,
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Cloud SQL Connections",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloudsql_database\" resource.labels.database_id=\"einharjer-valhalla:firstcontact-eis-db\" metric.type=\"cloudsql.googleapis.com/database/postgresql/num_backends\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              }
            }]
          }
        }
      },
      {
        "xPos": 6,
        "yPos": 4,
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Vertex AI Requests",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"aiplatform.googleapis.com/Endpoint\" metric.type=\"aiplatform.googleapis.com/prediction/online/response_count\"",
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

**Deploy dashboard:**
```bash
gcloud monitoring dashboards create --config-from-file=monitoring/gcp_dashboard.json \
    --project=einharjer-valhalla

echo "✅ Cloud Monitoring dashboard created"
```

**I WILL CREATE THIS FILE FOR YOU** ✅

---

## EXECUTION SUMMARY

**I WILL APPLY THESE FIXES FOR YOU:**

### Phase 1: Immediate Code Fixes ✅
1. ✅ Switch from Anthropic SDK to Vertex AI SDK (`ai_recommendations.py`)
2. ✅ Fix SQL injection in `database.py`
3. ✅ Fix CORS in `config.py`
4. ✅ Add `.env` to `.gitignore`
5. ✅ Add connection pooling to `database.py`
6. ✅ Add health check endpoint to `main.py`
7. ✅ Fix N+1 query in `analytics.py`
8. ✅ Update `Dockerfile` for Cloud Run
9. ✅ Update `requirements.txt` with GCP dependencies

### Phase 2: New Files Created ✅
1. ✅ `database/gcp_performance_indexes.sql`
2. ✅ `database/gcp_materialized_views.sql`
3. ✅ `deploy_gcp_native.sh`
4. ✅ `monitoring/gcp_dashboard.json`

### Phase 3: Manual Steps (YOU NEED TO DO)
1. ⚠️ Grant Vertex AI permissions (run command above)
2. ⚠️ Rotate database password (run command above)
3. ⚠️ Generate new JWT secret (run command above)
4. ⚠️ Remove .env from git history (run command above)
5. ⚠️ Apply database indexes (run SQL file)
6. ⚠️ Deploy using new script (`./deploy_gcp_native.sh`)

---

**Ready to proceed with applying all fixes?**
