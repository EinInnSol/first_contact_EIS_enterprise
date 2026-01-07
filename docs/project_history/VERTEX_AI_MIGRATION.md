# Vertex AI Claude Migration Guide

## Why Migrate to Vertex AI?

**Current Setup:**
- Direct Anthropic API (requires API key)
- Costs billed through Anthropic

**After Migration:**
- Vertex AI Claude on GCP
- Consolidated billing with other GCP services
- Better integration with Cloud Run
- No API keys needed (uses service account)

---

## Prerequisites

### 1. Enable Vertex AI API

```bash
gcloud services enable aiplatform.googleapis.com
```

### 2. Grant Permissions

```bash
# Get your Cloud Run service account email
SERVICE_ACCOUNT=$(gcloud run services describe firstcontact-api \
    --region=us-east5 \
    --format="value(spec.template.spec.serviceAccountName)")

# Grant Vertex AI User role
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"
```

---

## Code Changes

### Backend: Update AI Services

#### File: `backend/app/services/ai_case_plan.py`

**BEFORE (Anthropic API):**
```python
from anthropic import Anthropic
import os

def generate_case_plan(client_data: dict, vendor_name: str, org_name: str):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return generate_fallback_plan(client_data)

    client = Anthropic(api_key=api_key)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )

    return parse_response(response.content[0].text)
```

**AFTER (Vertex AI):**
```python
from anthropic import AnthropicVertex
import os

# Initialize once at module level
PROJECT_ID = "einharjer-valhalla"
REGION = "us-east5"

def generate_case_plan(client_data: dict, vendor_name: str, org_name: str):
    try:
        # No API key needed - uses service account
        client = AnthropicVertex(
            region=REGION,
            project_id=PROJECT_ID
        )

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )

        return parse_response(response.content[0].text)

    except Exception as e:
        print(f"Vertex AI error: {e}")
        return generate_fallback_plan(client_data)
```

#### File: `backend/app/services/ai_strategic_advisor.py`

**Same changes:**
1. Import `AnthropicVertex` instead of `Anthropic`
2. Initialize with `region` and `project_id`
3. Remove `api_key` parameter
4. Same model name and API interface

---

## Updated Requirements

#### File: `backend/requirements.txt`

**Ensure these versions:**
```txt
# AI & APIs
google-cloud-aiplatform>=1.38.0
anthropic[vertex]>=0.40.0
```

The `anthropic[vertex]` extra includes Vertex AI integration.

---

## Deployment Changes

### Update Cloud Run Configuration

**Remove ANTHROPIC_API_KEY secret:**
```bash
gcloud run services update firstcontact-api \
    --region=us-east5 \
    --remove-secrets=ANTHROPIC_API_KEY
```

**Add environment variables:**
```bash
gcloud run services update firstcontact-api \
    --region=us-east5 \
    --set-env-vars=VERTEX_AI_PROJECT=einharjer-valhalla,VERTEX_AI_REGION=us-east5
```

---

## Testing the Migration

### 1. Test Locally with Service Account

```bash
# Download service account key (dev only!)
gcloud iam service-accounts keys create vertex-ai-key.json \
    --iam-account=YOUR_SERVICE_ACCOUNT@einharjer-valhalla.iam.gserviceaccount.com

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="vertex-ai-key.json"

# Run backend
cd backend
uvicorn app.main:app --reload

# Test AI case plan endpoint
curl -X POST http://localhost:8000/api/v1/clients/CLIENT_ID/case-plan/generate \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Test on Cloud Run

After deployment, test the AI endpoints:

```bash
# Get your Cloud Run URL
API_URL=$(gcloud run services describe firstcontact-api \
    --region=us-east5 \
    --format="value(status.url)")

# Test case plan generation
curl -X POST "$API_URL/api/v1/clients/CLIENT_ID/case-plan/generate" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test strategic advisor
curl -X POST "$API_URL/api/v1/ai-advisor/ask" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"question": "Why is MHALA underperforming?"}'
```

---

## Rollback Plan

If Vertex AI doesn't work, revert to Anthropic API:

### 1. Revert Code Changes

```python
# Back to:
from anthropic import Anthropic
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
```

### 2. Re-add API Key Secret

```bash
echo "your-anthropic-api-key" | gcloud secrets create firstcontact-anthropic-key --data-file=-

gcloud run services update firstcontact-api \
    --region=us-east5 \
    --set-secrets=ANTHROPIC_API_KEY=firstcontact-anthropic-key:latest
```

### 3. Redeploy

```bash
cd backend
gcloud run deploy firstcontact-api --source .
```

---

## Cost Comparison

### Anthropic API Direct:
- Claude Sonnet 4: $3 / 1M input tokens, $15 / 1M output tokens
- Billed through Anthropic

### Vertex AI Claude:
- Claude Sonnet 4: Same pricing
- Billed through GCP (consolidated with other services)
- No API key management

**Recommendation:** Migrate to Vertex AI for better GCP integration and consolidated billing.

---

## Common Issues

### "Permission Denied" Error

**Problem:** Cloud Run service account doesn't have Vertex AI permissions

**Solution:**
```bash
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:YOUR_SERVICE_ACCOUNT@einharjer-valhalla.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
```

### "Region Not Supported" Error

**Problem:** Vertex AI Claude not available in your region

**Solution:** Use `us-east5` (already configured) or check availability:
```bash
gcloud ai models list --region=us-east5 | grep claude
```

### Import Error

**Problem:** `ModuleNotFoundError: No module named 'anthropic.vertex'`

**Solution:** Update requirements.txt to include `anthropic[vertex]>=0.40.0`

---

## Migration Checklist

- [ ] Enable Vertex AI API (`gcloud services enable aiplatform.googleapis.com`)
- [ ] Grant service account permissions
- [ ] Update `backend/app/services/ai_case_plan.py`
- [ ] Update `backend/app/services/ai_strategic_advisor.py`
- [ ] Update `backend/requirements.txt` (ensure `anthropic[vertex]>=0.40.0`)
- [ ] Remove ANTHROPIC_API_KEY from Cloud Run
- [ ] Add VERTEX_AI_PROJECT and VERTEX_AI_REGION env vars
- [ ] Redeploy backend to Cloud Run
- [ ] Test case plan generation
- [ ] Test strategic advisor chatbot
- [ ] Monitor logs for errors
- [ ] Verify billing in GCP console

---

## Complete Migration Script

**File: `migrate_to_vertex_ai.sh`**

```bash
#!/bin/bash
set -e

PROJECT_ID="einharjer-valhalla"
REGION="us-east5"
SERVICE_NAME="firstcontact-api"

echo "Migrating to Vertex AI Claude..."

# Enable API
gcloud services enable aiplatform.googleapis.com

# Get service account
SERVICE_ACCOUNT=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --format="value(spec.template.spec.serviceAccountName)")

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"

echo "Permissions granted. Now update code and redeploy:"
echo "  cd backend"
echo "  gcloud run deploy $SERVICE_NAME --source ."
```

---

**Ready to migrate? Update the code, run the script, and redeploy!**
