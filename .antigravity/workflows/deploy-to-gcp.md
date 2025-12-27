# WORKFLOW: Deploy to GCP (Cloud Run + Cloud SQL)

**When to use:** Deploying backend API to Google Cloud Platform
**Services used:** Cloud Run, Cloud SQL, Secret Manager, Cloud Build
**Estimated time:** 5-10 minutes

---

## PHASE 1: PRE-DEPLOYMENT CHECKS

### Task 1.1: Verify GCP Configuration
```bash
# Check active project
gcloud config get project
# Should output: einharjer-valhalla

# Check active account
gcloud auth list --filter=status:ACTIVE

# Set project if needed
gcloud config set project einharjer-valhalla
```

### Task 1.2: Run Tests
```bash
cd backend
pytest tests/ -v --cov=app
# All tests must pass before deployment
```

### Task 1.3: Verify Secrets Exist
```bash
# Check required secrets
gcloud secrets list --project=einharjer-valhalla --filter="name:nexus-"

# Required secrets:
# - nexus-jwt-secret
# - nexus-db-url
# - (nexus-anthropic-key if using direct API, otherwise skip)
```

### Task 1.4: Check Cloud SQL Instance Status
```bash
gcloud sql instances describe firstcontact-eis-db \
    --format="value(state)" \
    --project=einharjer-valhalla
# Should output: RUNNABLE
```

---

## PHASE 2: BUILD & DEPLOY

### Task 2.1: Build Docker Image (Option A: Cloud Build)
```bash
cd backend

# Submit build to Cloud Build
gcloud builds submit \
    --tag gcr.io/einharjer-valhalla/first-contact-api:latest \
    --project=einharjer-valhalla
```

### Task 2.2: Deploy to Cloud Run
```bash
gcloud run deploy first-contact-api \
    --image=gcr.io/einharjer-valhalla/first-contact-api:latest \
    --region=us-east5 \
    --platform=managed \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=300 \
    --concurrency=80 \
    --port=8080 \
    --set-env-vars="ENVIRONMENT=production,GCP_PROJECT_ID=einharjer-valhalla,GCP_REGION=us-east5" \
    --set-secrets="JWT_SECRET=nexus-jwt-secret:latest,DATABASE_URL=nexus-db-url:latest" \
    --add-cloudsql-instances="einharjer-valhalla:us-central1:firstcontact-eis-db" \
    --project=einharjer-valhalla
```

### Task 2.3: Get Service URL
```bash
export BACKEND_URL=$(gcloud run services describe first-contact-api \
    --region=us-east5 \
    --format='value(status.url)' \
    --project=einharjer-valhalla)

echo "Backend URL: $BACKEND_URL"
```

---

## PHASE 3: VERIFICATION

### Task 3.1: Health Check
```bash
# Test health endpoint
curl -f "$BACKEND_URL/health"

# Expected response:
# {"status":"healthy","database":"connected","version":"1.0.0"}
```

### Task 3.2: API Documentation
```bash
# Open API docs in browser
echo "API Docs: $BACKEND_URL/docs"
```

### Task 3.3: Check Logs
```bash
# View recent logs
gcloud run services logs read first-contact-api \
    --region=us-east5 \
    --limit=50 \
    --project=einharjer-valhalla
```

### Task 3.4: Test Critical Endpoint
```bash
# Test authentication endpoint (should return 401 without token)
curl -i "$BACKEND_URL/api/v1/clients"
# Expected: 401 Unauthorized
```

---

## PHASE 4: MONITORING SETUP

### Task 4.1: Create Uptime Check
```bash
gcloud monitoring uptime create first-contact-api-health \
    --resource-type=uptime-url \
    --host="$(echo $BACKEND_URL | sed 's|https://||')" \
    --path=/health \
    --period=60 \
    --timeout=10s \
    --project=einharjer-valhalla
```

### Task 4.2: Create Alert Policy (High Error Rate)
```bash
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Error Rate - First Contact API" \
    --condition-display-name="Error rate > 5%" \
    --condition-threshold-value=0.05 \
    --condition-threshold-duration=300s \
    --condition-filter='resource.type="cloud_run_revision" resource.labels.service_name="first-contact-api" metric.type="run.googleapis.com/request_count" metric.labels.response_code_class="5xx"' \
    --project=einharjer-valhalla
```

### Task 4.3: View Metrics Dashboard
```bash
# Open Cloud Run console
echo "https://console.cloud.google.com/run/detail/us-east5/first-contact-api?project=einharjer-valhalla"
```

---

## PHASE 5: GRANT IAM PERMISSIONS

### Task 5.1: Grant Vertex AI Access
```bash
# Get service account
SERVICE_ACCOUNT=$(gcloud run services describe first-contact-api \
    --region=us-east5 \
    --format='value(spec.template.spec.serviceAccountName)' \
    --project=einharjer-valhalla)

# Grant Vertex AI User role
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"

echo "✅ Vertex AI permissions granted"
```

### Task 5.2: Grant Cloud SQL Client
```bash
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/cloudsql.client"

echo "✅ Cloud SQL permissions granted"
```

### Task 5.3: Grant Secret Manager Access
```bash
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"

echo "✅ Secret Manager permissions granted"
```

---

## ROLLBACK PROCEDURE

### If deployment fails or issues found:

```bash
# List revisions
gcloud run revisions list \
    --service=first-contact-api \
    --region=us-east5 \
    --project=einharjer-valhalla

# Rollback to previous revision
gcloud run services update-traffic first-contact-api \
    --to-revisions=PREVIOUS_REVISION=100 \
    --region=us-east5 \
    --project=einharjer-valhalla

# Verify rollback
curl -f "$BACKEND_URL/health"
```

---

## SUCCESS CRITERIA

- [ ] Health check returns 200 OK
- [ ] API docs accessible at /docs
- [ ] Cloud Logging shows successful requests
- [ ] No 5xx errors in logs
- [ ] Response time < 500ms (p95)
- [ ] Vertex AI calls working (if applicable)
- [ ] Database connection successful
- [ ] Uptime check created
- [ ] Alert policies configured
- [ ] IAM permissions granted

---

## COST ESTIMATE

**Cloud Run:**
- First 2 million requests/month: Free
- After: $0.40 per million requests
- Estimated: $5-10/month (with min-instances=0)

**Cloud SQL (db-f1-micro):**
- Instance: ~$7/month
- Storage: $0.17/GB/month
- Estimated: $10-15/month

**Vertex AI Claude:**
- Pay-per-use (token-based)
- Haiku: ~$0.25 per million input tokens
- Estimated: $2-5/month (depends on usage)

**Total: ~$20-30/month**

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Update frontend** to use new backend URL
2. **Test end-to-end** workflows (registration, login, API calls)
3. **Monitor** logs and metrics for 24 hours
4. **Document** new backend URL in README
5. **Notify stakeholders** of deployment

---

**Workflow Complete!**
