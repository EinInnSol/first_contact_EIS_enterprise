# GCP MASTERY - AGENT KNOWLEDGE BASE

This knowledge base contains patterns, snippets, and decision-making frameworks that make you a GCP wizard.

---

## PATTERN LIBRARY

### Pattern 1: Multi-Tenant SaaS with Row-Level Security

**When to use:** Building multi-tenant applications where data isolation is critical

**GCP Services:**
- Cloud SQL PostgreSQL (RLS enforcement)
- Cloud Run (application hosting)
- Secret Manager (tenant-specific credentials)

**Implementation:**
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_name FORCE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation ON table_name
    FOR ALL USING (tenant_id = current_setting('app.tenant_id')::INTEGER);
```

```python
# Set context per request
async def set_tenant_context(session, tenant_id):
    await session.execute(
        text("SET LOCAL app.tenant_id = :tid"),
        {"tid": tenant_id}
    )
```

**Why GCP:** Cloud SQL PostgreSQL has native RLS support with better performance than application-level filtering

---

### Pattern 2: Serverless AI Application

**When to use:** Building applications with AI features

**GCP Services:**
- Vertex AI (Claude, Gemini models - no API key management)
- Cloud Run (auto-scaling API)
- Cloud Firestore (real-time data sync)
- Cloud Functions (event triggers)

**Implementation:**
```python
from anthropic import AnthropicVertex

# GCP-native - uses Application Default Credentials
client = AnthropicVertex(
    region="us-east5",
    project_id="your-project-id"
)

response = client.messages.create(
    model="claude-3-5-haiku-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
)
```

**Why GCP:**
- No API key management (IAM-based auth)
- Integrated billing (one bill for all services)
- Lower latency (models run in Google's network)
- Automatic quota management

---

### Pattern 3: Event-Driven Microservices

**When to use:** Building distributed systems with async communication

**GCP Services:**
- Cloud Pub/Sub (message bus)
- Cloud Functions (event handlers)
- Cloud Run (services)
- Eventarc (event routing)

**Implementation:**
```python
# Publisher (Cloud Run service)
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

publisher.publish(
    topic_path,
    data=json.dumps(event_data).encode(),
    event_type="user.created"
)

# Subscriber (Cloud Function)
def handle_user_created(event, context):
    data = json.loads(base64.b64decode(event['data']))
    # Process event
```

**Why GCP:**
- At-least-once delivery guarantee
- Global message ordering
- Automatic retry with exponential backoff
- Dead letter queues built-in

---

### Pattern 4: High-Performance Analytics Dashboard

**When to use:** Layer 8 analytics, business intelligence dashboards

**GCP Services:**
- Cloud SQL (materialized views)
- Memorystore Redis (caching)
- BigQuery (data warehouse - for larger datasets)
- Cloud CDN (edge caching)

**Implementation:**
```sql
-- Materialized view for fast queries
CREATE MATERIALIZED VIEW vendor_performance AS
SELECT vendor_id, COUNT(*) as total, AVG(score) as avg_score
FROM clients
GROUP BY vendor_id;

-- Refresh nightly via Cloud Scheduler
REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_performance;
```

```python
# Redis caching layer
import redis

redis_client = redis.Redis(host='MEMORYSTORE_IP', port=6379)

async def get_vendor_performance(vendor_id):
    # Check cache first
    cached = redis_client.get(f"vendor:{vendor_id}")
    if cached:
        return json.loads(cached)

    # Query database
    data = await db.query(vendor_id)

    # Cache for 5 minutes
    redis_client.setex(
        f"vendor:{vendor_id}",
        300,
        json.dumps(data)
    )
    return data
```

**Why GCP:**
- Memorystore is fully managed Redis (no ops overhead)
- Sub-millisecond latency
- Automatic failover
- VPC peering with Cloud SQL (private network)

---

### Pattern 5: Secure API with Firebase Auth

**When to use:** User-facing applications needing authentication

**GCP Services:**
- Firebase Authentication (social login, email/password)
- Cloud Run (backend API)
- Identity Platform (advanced features)

**Implementation:**
```python
# Verify Firebase ID token
from firebase_admin import auth, credentials, initialize_app

# Initialize (in production, uses Application Default Credentials)
initialize_app()

async def verify_token(token: str):
    try:
        decoded = auth.verify_id_token(token)
        return decoded['uid']
    except:
        raise HTTPException(401, "Invalid token")

# Use as FastAPI dependency
async def get_current_user(
    authorization: str = Header(None)
) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing token")

    token = authorization.split("Bearer ")[1]
    return await verify_token(token)
```

**Why GCP:**
- No JWT secret management (Firebase handles it)
- Built-in email verification
- Social login out of the box
- Password strength enforcement
- Multi-factor authentication ready

---

## DECISION TREE: WHICH GCP SERVICE TO USE?

### Database Selection

```
Need relational database?
├─ YES → Cloud SQL
│   ├─ Transactional workload → PostgreSQL
│   ├─ MySQL compatibility needed → Cloud SQL MySQL
│   └─ Microsoft stack → Cloud SQL SQL Server
│
└─ NO → What kind of data?
    ├─ Document/JSON → Firestore (real-time) or MongoDB Atlas (if must)
    ├─ Key-value cache → Memorystore Redis
    ├─ Wide-column → Cloud Bigtable
    ├─ Analytics/warehouse → BigQuery
    └─ Search → Vertex AI Search (or Elasticsearch if must)
```

### Compute Selection

```
What are you running?
├─ HTTP API → Cloud Run
│   ├─ Stateless → Cloud Run (min-instances=0)
│   ├─ WebSocket → Cloud Run (supports WebSocket)
│   └─ Background jobs → Cloud Run Jobs
│
├─ Event handler → Cloud Functions
│   ├─ Pub/Sub trigger → Cloud Functions (2nd gen)
│   ├─ HTTP trigger → Cloud Functions or Cloud Run
│   └─ Storage trigger → Cloud Functions
│
├─ Scheduled task → Cloud Scheduler + Cloud Functions/Run
│
├─ Long-running server → GKE (Kubernetes) or GCE
│
└─ Batch processing → Dataflow or Cloud Run Jobs
```

### Storage Selection

```
What kind of storage?
├─ Object storage (files, images) → Cloud Storage
│   ├─ Frequently accessed → Standard storage class
│   ├─ Accessed < 1/month → Nearline storage class
│   ├─ Accessed < 1/year → Coldline storage class
│   └─ Archive → Archive storage class
│
├─ Block storage (VM disk) → Persistent Disk
│   ├─ SSD performance → SSD Persistent Disk
│   └─ Cost-optimized → Standard Persistent Disk
│
└─ File system (NFS) → Filestore
```

### AI/ML Selection

```
What AI capability?
├─ LLM (Claude, Gemini) → Vertex AI
│   ├─ Fast, cheap → Claude Haiku
│   ├─ Balanced → Claude Sonnet or Gemini Pro
│   └─ Max intelligence → Claude Opus or Gemini Ultra
│
├─ Vision (image analysis) → Vertex AI Vision or Cloud Vision API
│
├─ NLP (text analysis) → Cloud Natural Language API
│
├─ Speech (transcription) → Cloud Speech-to-Text
│
└─ Custom model → Vertex AI (training + deployment)
```

---

## CODE SNIPPETS LIBRARY

### Snippet: Cloud Logging with Structured Data

```python
import google.cloud.logging
from google.cloud.logging.handlers import CloudLoggingHandler
import logging

# Initialize Cloud Logging
client = google.cloud.logging.Client()
handler = CloudLoggingHandler(client, name="app-logs")

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(handler)

# Log with structured data (queryable in Cloud Logging)
logger.info(
    "User action completed",
    extra={
        "labels": {
            "user_id": "123",
            "action": "purchase",
            "amount": 99.99,
            "success": True
        },
        "httpRequest": {
            "requestUrl": str(request.url),
            "requestMethod": request.method,
            "userAgent": request.headers.get("user-agent"),
            "remoteIp": request.client.host
        }
    }
)

# Query in Cloud Logging Console:
# labels.action="purchase" AND labels.success=true
```

### Snippet: Cloud SQL Connection with IAM Auth

```python
from google.cloud.sql.connector import Connector
from sqlalchemy.ext.asyncio import create_async_engine

# No password needed - uses IAM authentication
connector = Connector()

def getconn():
    return connector.connect(
        "project:region:instance",
        "asyncpg",
        user="service-account@project.iam",
        enable_iam_auth=True,  # Use IAM instead of password
        db="database_name"
    )

engine = create_async_engine(
    "postgresql+asyncpg://",
    async_creator=getconn,
    pool_size=20,
    max_overflow=10
)

# Grant IAM permission:
# gcloud sql users create service-account@project.iam \
#   --instance=instance-name \
#   --type=CLOUD_IAM_SERVICE_ACCOUNT
```

### Snippet: Secret Manager with Caching

```python
from google.cloud import secretmanager
from functools import lru_cache

@lru_cache(maxsize=100)
def get_secret(project_id: str, secret_id: str, version: str = "latest") -> str:
    """Get secret from Secret Manager with in-memory cache."""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

# Usage
api_key = get_secret("my-project", "api-key")
# Second call uses cache (no API call)
```

### Snippet: Vertex AI with Retry Logic

```python
from anthropic import AnthropicVertex
from tenacity import retry, wait_exponential, stop_after_attempt

@retry(
    wait=wait_exponential(multiplier=1, min=2, max=60),
    stop=stop_after_attempt(3)
)
async def call_vertex_ai(prompt: str, model: str = "claude-3-5-haiku-20241022") -> str:
    """Call Vertex AI with automatic retry on transient failures."""
    client = AnthropicVertex(
        region="us-east5",
        project_id="your-project-id"
    )

    try:
        response = client.messages.create(
            model=model,
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text

    except Exception as e:
        logger.error(f"Vertex AI error: {e}")
        raise  # Retry will handle it
```

### Snippet: Cloud Storage Signed URLs

```python
from google.cloud import storage
from datetime import timedelta

def generate_upload_url(bucket_name: str, blob_name: str) -> str:
    """Generate signed URL for direct upload to Cloud Storage."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=15),
        method="PUT",
        content_type="application/octet-stream"
    )
    return url

# Client uploads directly to GCS (no backend bandwidth)
# curl -X PUT -H "Content-Type: application/octet-stream" --upload-file file.jpg "SIGNED_URL"
```

### Snippet: Cloud Pub/Sub with Dead Letter Queue

```python
from google.cloud import pubsub_v1

# Create topic with dead letter queue
publisher = pubsub_v1.PublisherClient()
subscriber = pubsub_v1.SubscriberClient()

topic_path = publisher.topic_path(project_id, "main-topic")
dlq_topic_path = publisher.topic_path(project_id, "dlq-topic")
subscription_path = subscriber.subscription_path(project_id, "main-sub")

subscription = subscriber.create_subscription(
    request={
        "name": subscription_path,
        "topic": topic_path,
        "dead_letter_policy": {
            "dead_letter_topic": dlq_topic_path,
            "max_delivery_attempts": 5  # After 5 retries → DLQ
        }
    }
)

# Messages that fail 5 times automatically go to DLQ
```

### Snippet: Cloud Run with Custom Service Account

```python
# Create service account with minimal permissions
# gcloud iam service-accounts create app-runner \
#   --display-name="Cloud Run Service Account"

# Grant specific permissions
# gcloud projects add-iam-policy-binding PROJECT_ID \
#   --member="serviceAccount:app-runner@PROJECT_ID.iam.gserviceaccount.com" \
#   --role="roles/cloudsql.client"

# gcloud secrets add-iam-policy-binding SECRET_NAME \
#   --member="serviceAccount:app-runner@PROJECT_ID.iam.gserviceaccount.com" \
#   --role="roles/secretmanager.secretAccessor"

# Deploy with custom service account
# gcloud run deploy SERVICE_NAME \
#   --service-account=app-runner@PROJECT_ID.iam.gserviceaccount.com \
#   --region=us-east5
```

---

## GCP COST OPTIMIZATION STRATEGIES

### Strategy 1: Scale to Zero

**Service:** Cloud Run
**Savings:** 80-95% compared to always-on instances

```bash
gcloud run deploy SERVICE \
    --min-instances=0 \      # Scale to zero when no traffic
    --max-instances=10 \
    --concurrency=80         # Handle 80 requests per instance
```

**When to use:** APIs with intermittent traffic

### Strategy 2: Storage Lifecycle Policies

**Service:** Cloud Storage
**Savings:** 70-90% on old data

```json
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
```

### Strategy 3: Committed Use Discounts

**Service:** All Compute (Cloud Run, GCE, GKE)
**Savings:** 30-70%

```bash
# Buy 1-year or 3-year commitment
gcloud compute commitments create COMMITMENT_NAME \
    --resources=vcpu=4,memory=16GB \
    --plan=twelve-month \
    --region=us-east5
```

**When to use:** Predictable baseline load

### Strategy 4: Right-Size Instances

**Before:** Cloud Run with 2GB memory (overkill)
**After:** Cloud Run with 512MB memory
**Savings:** 75%

```bash
# Monitor actual usage first
gcloud monitoring timeseries list \
    --filter='metric.type="run.googleapis.com/container/memory/utilizations"'

# Right-size based on p95 usage
gcloud run services update SERVICE \
    --memory=512Mi \  # Down from 2Gi
    --cpu=1           # Down from 2
```

### Strategy 5: Cloud CDN for Static Assets

**Before:** Serving images from Cloud Run (expensive egress)
**After:** Serving from Cloud Storage + Cloud CDN
**Savings:** 90% on bandwidth costs

```bash
# Create bucket
gsutil mb -l us-east5 gs://static-assets-bucket

# Upload assets
gsutil -m cp -r public/* gs://static-assets-bucket/

# Enable CDN
gcloud compute backend-buckets create static-backend \
    --gcs-bucket-name=static-assets-bucket \
    --enable-cdn
```

---

## TROUBLESHOOTING QUICK REFERENCE

### Cloud Run won't start → Check logs
```bash
gcloud run services logs read SERVICE --region=REGION --limit=50
```

### Database connection fails → Verify Cloud SQL connection name
```bash
gcloud sql instances describe INSTANCE --format="value(connectionName)"
# Should match: --add-cloudsql-instances=PROJECT:REGION:INSTANCE
```

### Secrets not accessible → Check IAM permissions
```bash
gcloud secrets get-iam-policy SECRET_NAME
# Service account needs roles/secretmanager.secretAccessor
```

### High latency → Check database location
```bash
# API in us-east5, database in us-central1 = 30-50ms cross-region latency
# Solution: Migrate database to same region or use read replica
```

### Vertex AI 403 error → Grant aiplatform.user role
```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:SA_EMAIL" \
    --role="roles/aiplatform.user"
```

---

## LEARNING LOOPS

**After every task, ask yourself:**

1. **Was there a more GCP-native way to do this?**
   - Example: Used Anthropic API directly → Should have used Vertex AI

2. **Could I have eliminated a third-party service?**
   - Example: Used Auth0 → Could have used Firebase Authentication

3. **Did I optimize for GCP pricing?**
   - Example: Always-on instance → Should scale to zero

4. **Did I follow security best practices?**
   - Example: API key in env var → Should use IAM or Secret Manager

5. **Is this observable enough?**
   - Example: No logging → Should use Cloud Logging with structured data

**Save insights to knowledge base:**
```markdown
## Insight: [Date]
**Situation:** Needed to implement user authentication
**Initially tried:** Custom JWT with bcrypt
**Better approach:** Firebase Authentication
**Why better:** No password management, built-in email verification, MFA ready
**Cost impact:** $0 (free tier covers most use cases)
**Time saved:** 3-4 hours of auth code
```

---

## END OF KNOWLEDGE BASE

**Use this knowledge to:**
- Make GCP-first decisions
- Write GCP-optimized code
- Troubleshoot faster
- Optimize costs
- Build secure, scalable systems

**Remember:** Every GCP service you use correctly is one less thing you have to maintain.
