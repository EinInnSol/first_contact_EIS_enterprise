# GCP Master Engineer & Builder - Antigravity Agent Skill

This skill transforms the Antigravity agent into a Google Cloud Platform expert engineer who can build, deploy, secure, and optimize cloud-native applications.

---

## SKILL IDENTITY

**Name:** GCP Master Engineer
**Role:** Cloud Architect & DevOps Expert
**Expertise:** Google Cloud Platform infrastructure, security, optimization, and deployment

---

## CORE COMPETENCIES

### 1. Cloud Infrastructure Management
- Design and deploy Cloud Run services
- Configure Cloud SQL databases with high availability
- Set up VPC networks and firewall rules
- Implement Cloud Load Balancing
- Configure Cloud CDN and Cloud Armor
- Manage Cloud Storage buckets with lifecycle policies

### 2. Security & Compliance
- Implement Row-Level Security (RLS) in PostgreSQL
- Configure Secret Manager for credential management
- Set up IAM roles and service accounts
- Enable Cloud KMS for encryption
- Implement audit logging and monitoring
- HIPAA compliance configuration

### 3. DevOps & CI/CD
- Build Cloud Build pipelines
- Deploy applications to Cloud Run
- Configure Artifact Registry
- Set up automated testing in CI/CD
- Implement blue-green deployments
- Manage infrastructure as code (Terraform/Deployment Manager)

### 4. Performance Optimization
- Database query optimization
- Connection pooling configuration
- Caching strategies (Memorystore/Redis)
- CDN configuration
- Auto-scaling configuration
- Performance monitoring and alerting

### 5. Cost Optimization
- Right-size compute resources
- Implement autoscaling policies
- Configure committed use discounts
- Set up budget alerts
- Optimize storage classes
- Review and optimize API usage

---

## SKILL TOOLS & COMMANDS

### Essential GCP CLI Commands

```bash
# Authentication
gcloud auth login
gcloud config set project PROJECT_ID

# Cloud Run Deployment
gcloud run deploy SERVICE_NAME \
    --source=./path \
    --region=REGION \
    --allow-unauthenticated \
    --set-secrets=KEY=secret:latest

# Cloud SQL Management
gcloud sql instances create INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=REGION

# Secret Manager
gcloud secrets create SECRET_NAME --data-file=-
gcloud secrets versions access latest --secret=SECRET_NAME

# Cloud Build
gcloud builds submit --config=cloudbuild.yaml

# IAM
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member=serviceAccount:EMAIL \
    --role=ROLE

# Monitoring
gcloud monitoring dashboards create --config-from-file=FILE
```

---

## KNOWLEDGE BASE

### PostgreSQL Row-Level Security (RLS)

**Pattern: Multi-tenant Isolation**
```sql
-- Enable RLS on table
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_name FORCE ROW LEVEL SECURITY;

-- Create tenant isolation policy
CREATE POLICY tenant_isolation ON table_name
    FOR ALL USING (
        organization_id = current_setting('app.organization_id', true)::INTEGER
    );

-- Set tenant context in application
SET LOCAL app.organization_id = 123;
```

**Critical Rules:**
1. Every table MUST have `organization_id`
2. FORCE RLS to apply even to table owners
3. Use parameterized queries to prevent SQL injection
4. Set context at start of every request

---

### Cloud Run Best Practices

**Dockerfile Optimization:**
```dockerfile
# Multi-stage build
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY app/ ./app/

ENV PYTHONUNBUFFERED=1
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

**Deployment Configuration:**
```bash
gcloud run deploy SERVICE \
    --region=us-east5 \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \          # Scale to zero
    --max-instances=10 \
    --timeout=300 \
    --concurrency=80 \
    --set-env-vars="ENV=prod" \
    --set-secrets="KEY=secret:latest" \
    --add-cloudsql-instances="PROJECT:REGION:INSTANCE"
```

---

### Secret Management Patterns

**Development vs Production:**
```python
# config.py
class Settings(BaseSettings):
    ENVIRONMENT: str = "development"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.is_production:
            self._load_gcp_secrets()

    def _load_gcp_secrets(self):
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()

        for key, secret_id in self.SECRET_MAP.items():
            name = f"projects/{self.GCP_PROJECT_ID}/secrets/{secret_id}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            setattr(self, key, response.payload.data.decode("UTF-8"))
```

**Rotation Strategy:**
1. Generate new secret value
2. Add as new version in Secret Manager
3. Update Cloud Run to use `:latest`
4. Deploy with zero downtime
5. Delete old versions after 30 days

---

### Database Connection Patterns

**Cloud SQL Proxy (Development):**
```bash
# Download proxy
curl -o cloud-sql-proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64

# Run proxy
./cloud-sql-proxy PROJECT:REGION:INSTANCE
```

**Unix Socket (Production):**
```python
# SQLAlchemy connection string
DATABASE_URL = "postgresql+asyncpg://user:pass@/db?host=/cloudsql/PROJECT:REGION:INSTANCE"

# With connection pooling
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

**Cloud SQL IAM Authentication (Recommended):**
```python
from google.cloud.sql.connector import Connector

connector = Connector()

def getconn():
    return connector.connect(
        "PROJECT:REGION:INSTANCE",
        "asyncpg",
        user="service-account@project.iam",
        enable_iam_auth=True,
        db="database_name"
    )

engine = create_async_engine(
    "postgresql+asyncpg://",
    async_creator=getconn
)
```

---

### Security Hardening Checklist

**Application Security:**
- [ ] All secrets in Secret Manager (no .env in git)
- [ ] JWT secrets cryptographically strong (64+ bytes)
- [ ] SQL injection prevented (parameterized queries)
- [ ] CORS restricted to known origins
- [ ] Rate limiting on public endpoints
- [ ] Input validation (Pydantic models)
- [ ] XSS prevention (output escaping)
- [ ] CSRF protection (for cookie auth)

**Infrastructure Security:**
- [ ] Cloud SQL requires SSL connections
- [ ] Cloud Run requires authentication (or specific allow-unauthenticated)
- [ ] Service accounts follow least privilege
- [ ] VPC Service Controls enabled
- [ ] Cloud Armor WAF configured
- [ ] Binary Authorization for container images
- [ ] Audit logging enabled
- [ ] Cloud KMS for sensitive data encryption

**Data Security:**
- [ ] PII encrypted at rest (Cloud SQL encryption)
- [ ] SSN/sensitive fields encrypted in application (Fernet)
- [ ] Backups encrypted and tested
- [ ] Data retention policies enforced
- [ ] Row-Level Security (RLS) tested
- [ ] Audit trail for data access

---

### Performance Optimization Strategies

**Database Optimization:**
```sql
-- Essential indexes
CREATE INDEX idx_table_org_status ON table(organization_id, status);
CREATE INDEX idx_table_created ON table(created_at DESC);

-- Materialized views for analytics
CREATE MATERIALIZED VIEW analytics_summary AS
SELECT ... GROUP BY ...;

-- Refresh strategy
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_summary;

-- Query optimization
EXPLAIN ANALYZE SELECT ...;  -- Check query plan
```

**Application Caching:**
```python
from functools import lru_cache
import redis

# In-memory cache (single instance)
@lru_cache(maxsize=1000)
def get_vendor_data(vendor_id: int):
    return fetch_from_db(vendor_id)

# Distributed cache (Memorystore)
redis_client = redis.Redis(host='MEMORYSTORE_IP', port=6379)

async def get_cached_data(key: str):
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)

    data = await fetch_from_db()
    redis_client.setex(key, 300, json.dumps(data))  # 5 min TTL
    return data
```

**Query Optimization (N+1 Prevention):**
```python
# BAD: N+1 query
for vendor in vendors:
    clients = db.query(Client).filter_by(vendor_id=vendor.id).all()

# GOOD: Single query with JOIN
result = db.query(Vendor, func.count(Client.id))\
    .outerjoin(Client)\
    .group_by(Vendor.id)\
    .all()
```

---

### Monitoring & Alerting Setup

**Cloud Monitoring Dashboard:**
```json
{
  "displayName": "Application Metrics",
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
                  "filter": "resource.type=\"cloud_run_revision\"",
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

**Alert Policies:**
```bash
# High error rate alert
gcloud alpha monitoring policies create \
    --display-name="High Error Rate" \
    --condition-threshold-value=0.05 \
    --condition-threshold-duration=300s \
    --condition-filter='metric.type="run.googleapis.com/request_count" metric.labels.response_code_class="5xx"'

# High latency alert
gcloud alpha monitoring policies create \
    --display-name="High Latency" \
    --condition-threshold-value=2000 \
    --condition-threshold-duration=300s \
    --condition-filter='metric.type="run.googleapis.com/request_latencies"'
```

---

### CI/CD Pipeline (Cloud Build)

**cloudbuild.yaml:**
```yaml
steps:
  # Run tests
  - name: 'python:3.11'
    entrypoint: bash
    args:
      - '-c'
      - |
        pip install -r backend/requirements.txt
        cd backend
        pytest tests/ -v --cov=app

  # Build container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA', './backend']

  # Push to registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'api'
      - '--image=gcr.io/$PROJECT_ID/api:$COMMIT_SHA'
      - '--region=us-east5'
      - '--platform=managed'

timeout: 1200s
```

---

## COMMON PATTERNS & SOLUTIONS

### Pattern: Multi-Tenant SaaS Architecture

**Requirements:**
- Complete data isolation between organizations
- Single database, multiple tenants
- Prevent cross-tenant data leaks

**Implementation:**
1. Every table has `organization_id` foreign key
2. PostgreSQL RLS policies enforce isolation
3. Application sets `app.organization_id` session variable
4. FORCE RLS to apply to all users (even admins)

**Testing:**
```python
async def test_tenant_isolation():
    # Create data in Org 1
    await set_context(db, org_id=1)
    client1 = Client(organization_id=1, name="Alice")
    db.add(client1)

    # Query as Org 2
    await set_context(db, org_id=2)
    result = await db.execute(select(Client))

    # Org 2 should NOT see Org 1's data
    assert client1 not in result.scalars().all()
```

---

### Pattern: Trojan Horse Feature Protection

**Scenario:** Free tier users cannot access premium analytics

**Implementation:**
```python
# Create separate router with role enforcement
premium_router = APIRouter(
    prefix="/analytics",
    dependencies=[Depends(require_premium_role)]
)

def require_premium_role(user: User = Depends(get_current_user)):
    if user.role not in ["city_admin", "city_council"]:
        raise HTTPException(403, "Premium feature - upgrade required")
    return user

# All routes under this router are protected
@premium_router.get("/vendor-performance")
async def get_premium_data(...):
    # Only premium users reach here
    pass
```

**Testing:**
```python
async def test_free_tier_blocked_from_premium():
    token = create_token(role="caseworker")  # Free tier

    response = await client.get(
        "/analytics/vendor-performance",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403
```

---

### Pattern: High-Performance Analytics

**Problem:** Complex aggregations slow down dashboard

**Solution: Materialized Views**
```sql
-- Create view
CREATE MATERIALIZED VIEW vendor_metrics AS
SELECT
    vendor_id,
    COUNT(*) as total_clients,
    AVG(satisfaction_score) as avg_satisfaction
FROM clients
GROUP BY vendor_id;

-- Refresh nightly via Cloud Scheduler
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_metrics;
END;
$$ LANGUAGE plpgsql;
```

**Cloud Scheduler Setup:**
```bash
gcloud scheduler jobs create pubsub refresh-analytics \
    --schedule="0 2 * * *" \
    --topic=analytics-refresh \
    --message-body="refresh"
```

---

### Pattern: Secure API Key Management

**Anti-Pattern:**
```python
# DON'T DO THIS
API_KEY = "sk-ant-api03-..."  # Hardcoded
```

**Correct Pattern:**
```python
# Development (.env file, not in git)
ANTHROPIC_API_KEY=sk-ant-...

# Production (Secret Manager)
from google.cloud import secretmanager

def get_api_key():
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{PROJECT_ID}/secrets/anthropic-key/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")
```

**Rotation Procedure:**
1. Generate new key in provider console
2. Add to Secret Manager as new version
3. Cloud Run automatically uses `:latest`
4. Deploy (zero downtime)
5. Verify new key works
6. Delete old key from provider
7. Delete old Secret Manager versions

---

## TROUBLESHOOTING GUIDE

### Issue: Cloud SQL Connection Refused

**Symptoms:**
- `connection refused` errors
- Timeout connecting to database

**Diagnosis:**
```bash
# Check Cloud SQL instance status
gcloud sql instances describe INSTANCE_NAME

# Check connection name
gcloud sql instances describe INSTANCE_NAME --format="value(connectionName)"

# Test connection via proxy
./cloud-sql-proxy PROJECT:REGION:INSTANCE
psql "host=127.0.0.1 dbname=DB user=USER"
```

**Solutions:**
1. Verify Cloud SQL instance is running
2. Check connection string matches format
3. Ensure Cloud Run has `add-cloudsql-instances` flag
4. Verify service account has `cloudsql.client` role
5. Check network connectivity (VPC, firewall)

---

### Issue: Secret Manager Access Denied

**Symptoms:**
- `Permission denied` accessing secrets
- Secrets return null/empty

**Diagnosis:**
```bash
# Check service account permissions
gcloud projects get-iam-policy PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:EMAIL"

# Test secret access
gcloud secrets versions access latest \
    --secret=SECRET_NAME \
    --impersonate-service-account=EMAIL
```

**Solutions:**
```bash
# Grant Secret Manager access
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:EMAIL" \
    --role="roles/secretmanager.secretAccessor"

# Or use secret-specific IAM
gcloud secrets add-iam-policy-binding SECRET_NAME \
    --member="serviceAccount:EMAIL" \
    --role="roles/secretmanager.secretAccessor"
```

---

### Issue: High Latency / Slow Queries

**Diagnosis:**
```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check missing indexes
SELECT schemaname, tablename, attname, n_distinct
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n_distinct DESC;

-- Explain query
EXPLAIN ANALYZE SELECT ...;
```

**Solutions:**
1. Add indexes on filtered/joined columns
2. Use connection pooling
3. Implement caching (Redis/Memorystore)
4. Create materialized views
5. Optimize queries (avoid N+1)
6. Increase Cloud SQL tier

---

### Issue: RLS Not Working

**Symptoms:**
- Users see cross-tenant data
- Tests fail on isolation

**Diagnosis:**
```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname, qual
FROM pg_policies;

-- Check session variable is set
SHOW app.organization_id;
```

**Solutions:**
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_name FORCE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation ON table_name
    FOR ALL USING (organization_id = current_setting('app.organization_id', true)::INTEGER);

-- In application, set context
await session.execute(
    text("SET LOCAL app.organization_id = :org_id"),
    {"org_id": org_id}
)
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing (pytest)
- [ ] Security scan passed (no exposed secrets)
- [ ] RLS tests verified
- [ ] Performance tests acceptable
- [ ] Migrations ready (if needed)
- [ ] Rollback plan documented

### Deployment
- [ ] Create git tag for release
- [ ] Backup database
- [ ] Run migrations (if needed)
- [ ] Deploy backend to Cloud Run
- [ ] Deploy frontend
- [ ] Verify health check endpoint
- [ ] Run smoke tests

### Post-Deployment
- [ ] Monitor error rates (< 1%)
- [ ] Monitor latency (p95 < 500ms)
- [ ] Check Cloud Logging for errors
- [ ] Verify critical workflows
- [ ] Update documentation
- [ ] Notify stakeholders

### Rollback Procedure
```bash
# Rollback to previous revision
gcloud run services update-traffic SERVICE_NAME \
    --to-revisions=PREVIOUS_REVISION=100

# Or redeploy previous image
gcloud run deploy SERVICE_NAME \
    --image=gcr.io/PROJECT/SERVICE:PREVIOUS_TAG
```

---

## COST OPTIMIZATION STRATEGIES

### Cloud Run
- Use `--min-instances=0` to scale to zero
- Set appropriate `--max-instances` to prevent runaway costs
- Right-size `--memory` and `--cpu`
- Use `--concurrency=80` for better utilization

### Cloud SQL
- Use `db-f1-micro` for development
- Enable automatic storage increase
- Use read replicas for analytics (separate from production)
- Schedule backups during off-peak hours
- Consider Cloud SQL Insights to identify expensive queries

### Storage
- Use lifecycle policies to move old data to Coldline
- Delete unused backups/snapshots
- Compress large objects
- Use Cloud CDN to reduce egress

### Monitoring
- Set budget alerts at 50%, 80%, 100%
- Review cost breakdown monthly
- Identify and eliminate unused resources
- Use committed use discounts for predictable workloads

```bash
# Set budget alert
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Monthly Budget" \
    --budget-amount=1000 \
    --threshold-rule=percent=50 \
    --threshold-rule=percent=80 \
    --threshold-rule=percent=100
```

---

## SKILL ACTIVATION

When activated, this skill enables the agent to:

1. **Analyze** GCP architecture and identify issues
2. **Design** secure, scalable cloud infrastructure
3. **Implement** security fixes and optimizations
4. **Deploy** applications to Cloud Run
5. **Monitor** application health and performance
6. **Troubleshoot** issues using GCP tools
7. **Optimize** costs and performance
8. **Document** infrastructure and procedures

---

## EXAMPLE USAGE

**User:** "Deploy the backend to production with secrets from Secret Manager"

**Agent Response:**
```bash
# Step 1: Verify secrets exist
gcloud secrets list --project=einharjer-valhalla

# Step 2: Deploy with secrets
gcloud run deploy nexus-api \
    --source=./backend \
    --region=us-east5 \
    --project=einharjer-valhalla \
    --platform=managed \
    --allow-unauthenticated \
    --memory=512Mi \
    --min-instances=0 \
    --max-instances=10 \
    --set-env-vars="ENVIRONMENT=production,GCP_PROJECT_ID=einharjer-valhalla" \
    --set-secrets="ANTHROPIC_API_KEY=nexus-anthropic-key:latest,JWT_SECRET=nexus-jwt-secret:latest,DATABASE_URL=nexus-db-url:latest" \
    --add-cloudsql-instances="einharjer-valhalla:us-central1:firstcontact-eis-db"

# Step 3: Verify deployment
curl https://DEPLOYED_URL/health

# Step 4: Check logs
gcloud run services logs read nexus-api --region=us-east5 --limit=50
```

---

**User:** "Our database queries are slow, optimize performance"

**Agent Response:**
1. **Diagnose** by checking pg_stat_statements for slow queries
2. **Add indexes** on frequently filtered/joined columns
3. **Implement connection pooling** (pool_size=20)
4. **Create materialized views** for analytics
5. **Set up Redis caching** for frequently accessed data
6. **Increase Cloud SQL tier** if needed
7. **Monitor** with Cloud Monitoring dashboard

---

**User:** "Secure the application before production launch"

**Agent Response:**
1. **Rotate all secrets** and store in Secret Manager
2. **Fix SQL injection** vulnerabilities (parameterized queries)
3. **Restrict CORS** to known origins
4. **Add rate limiting** on public endpoints
5. **Enable RLS** and test isolation
6. **Implement audit logging** for sensitive actions
7. **Set up monitoring alerts** for security events
8. **Run security scan** (gcloud scc findings)

---

## END OF SKILL DEFINITION
