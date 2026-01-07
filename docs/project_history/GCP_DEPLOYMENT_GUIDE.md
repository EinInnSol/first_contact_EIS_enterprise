# 🚀 GCP DEPLOYMENT GUIDE - First Contact E.I.S.

## ONE-CLICK DEPLOYMENT TO GOOGLE CLOUD

This will deploy your app to GCP Cloud Run with Cloud SQL PostgreSQL. After deployment, you'll have a professional URL like:
- **Frontend:** `https://firstcontact-web-xxx.run.app`
- **Backend:** `https://firstcontact-api-xxx.run.app`

---

## PREREQUISITES (One-Time Setup)

### 1. Install Google Cloud SDK

**Download:** https://cloud.google.com/sdk/docs/install

**Windows:** Download and run the installer

**Verify installation:**
```bash
gcloud --version
```

### 2. Login to Google Cloud

```bash
gcloud auth login
```

This opens your browser to login with your Google account.

### 3. Confirm Your Project

```bash
gcloud config get-value project
```

Should show: `einharjer-valhalla`

If not:
```bash
gcloud config set project einharjer-valhalla
```

---

## DEPLOYMENT (Run Once)

### Option 1: Windows (Easiest)

**Just double-click:**
```
DEPLOY_TO_GCP.bat
```

Wait 10-15 minutes. It will:
1. ✅ Enable required APIs
2. ✅ Create Cloud SQL database
3. ✅ Deploy backend API
4. ✅ Deploy frontend dashboard
5. ✅ Open your app in browser

### Option 2: Manual Commands

If the batch file doesn't work, run these:

```bash
# Set project
gcloud config set project einharjer-valhalla
gcloud config set run/region us-east5

# Enable APIs
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com

# Deploy backend
cd backend
gcloud run deploy firstcontact-api --source . --region us-east5 --allow-unauthenticated

# Deploy frontend
cd ../frontend
gcloud run deploy firstcontact-web --source . --region us-east5 --allow-unauthenticated
```

---

## AFTER DEPLOYMENT

### 1. Get Your URLs

```bash
# Frontend URL
gcloud run services describe firstcontact-web --region us-east5 --format="value(status.url)"

# Backend URL
gcloud run services describe firstcontact-api --region us-east5 --format="value(status.url)"
```

### 2. Seed Demo Data

```bash
cd backend
gcloud run jobs create seed-demo \
    --source . \
    --region us-east5 \
    --execute-now \
    --wait
```

### 3. Login

**Visit your frontend URL, then login:**
```
Email: admin@longbeach.gov
Password: demo123
Organization: longbeach
```

---

## MANAGING YOUR DEPLOYMENT

### View Logs

```bash
# Backend logs
gcloud run services logs tail firstcontact-api --region us-east5

# Frontend logs
gcloud run services logs tail firstcontact-web --region us-east5
```

### Update Backend

```bash
cd backend
gcloud run deploy firstcontact-api --source . --region us-east5
```

### Update Frontend

```bash
cd frontend
gcloud run deploy firstcontact-web --source . --region us-east5
```

### Stop Services (to save costs)

```bash
# Delete services
gcloud run services delete firstcontact-api --region us-east5
gcloud run services delete firstcontact-web --region us-east5

# Delete database (WARNING: This deletes all data!)
gcloud sql instances delete firstcontact-db
```

---

## COSTS

**Estimated monthly cost for demo usage:**

- **Cloud Run:** ~$0-5/month (free tier covers most demo usage)
- **Cloud SQL (db-f1-micro):** ~$7/month
- **Storage & Networking:** ~$1/month

**Total:** ~$8-13/month for a working demo

**For production** (100-1000 users):
- Cloud Run: ~$20-50/month
- Cloud SQL (db-g1-small): ~$25/month
- Total: ~$45-75/month

---

## CUSTOM DOMAIN (Optional)

Want `demo.firstcontact.app` instead of `.run.app`?

### 1. Add Domain Mapping

```bash
gcloud run domain-mappings create --service firstcontact-web --domain demo.firstcontact.app --region us-east5
```

### 2. Update DNS

Add the DNS records shown by the command above to your domain registrar.

---

## VERTEX AI SETUP (For Full AI Features)

### Enable Vertex AI

```bash
gcloud services enable aiplatform.googleapis.com
```

### Update Backend Code

In `backend/app/services/ai_case_plan.py` and `ai_strategic_advisor.py`:

**Replace:**
```python
from anthropic import Anthropic
client = Anthropic(api_key=api_key)
```

**With:**
```python
from google.cloud import aiplatform
aiplatform.init(project=PROJECT_ID, location=REGION)

# Use Vertex AI Claude
from anthropic import AnthropicVertex
client = AnthropicVertex(region=REGION, project_id=PROJECT_ID)
```

### Redeploy

```bash
cd backend
gcloud run deploy firstcontact-api --source . --region us-east5
```

---

## SECURITY (Production)

Before launching to real customers:

### 1. Fix Critical Security Issues

See `.claude/SECURITY_AUDIT_REPORT.md` for details:
- [ ] Add Layer 8 access control tests
- [ ] Fix UUID validation
- [ ] Add rate limiting
- [ ] Lock down CORS

### 2. Update Secrets

```bash
# Generate strong JWT secret
openssl rand -base64 64 | gcloud secrets create nexus-jwt-secret --data-file=-

# Store Anthropic/Vertex AI credentials
echo "your-api-key" | gcloud secrets create nexus-anthropic-key --data-file=-
```

### 3. Configure Backend to Use Secrets

```bash
gcloud run services update firstcontact-api \
    --set-secrets="JWT_SECRET=nexus-jwt-secret:latest,ANTHROPIC_API_KEY=nexus-anthropic-key:latest" \
    --region us-east5
```

### 4. Enable HTTPS Only

```bash
gcloud run services update firstcontact-web --ingress all --region us-east5
```

---

## MONITORING

### Set Up Alerts

```bash
# CPU usage alert
gcloud alpha monitoring policies create \
    --notification-channels=YOUR_EMAIL \
    --display-name="High CPU Usage" \
    --condition-display-name="CPU > 80%" \
    --condition-threshold-value=0.8
```

### View Metrics

Visit: https://console.cloud.google.com/run?project=einharjer-valhalla

---

## TROUBLESHOOTING

### "Permission Denied"

```bash
gcloud auth login
gcloud auth application-default login
```

### "Service account does not have permission"

```bash
# Grant Cloud Run admin role
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="user:YOUR_EMAIL" \
    --role="roles/run.admin"
```

### "Database connection failed"

1. Check Cloud SQL instance is running:
```bash
gcloud sql instances list
```

2. Verify connection in Cloud Run:
```bash
gcloud run services describe firstcontact-api --region us-east5 --format="value(spec.template.spec.containers[0].env)"
```

### "Build failed"

Check logs:
```bash
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

---

## ROLLBACK

If deployment breaks something:

```bash
# List revisions
gcloud run revisions list --service firstcontact-api --region us-east5

# Rollback to previous
gcloud run services update-traffic firstcontact-api \
    --to-revisions=REVISION_NAME=100 \
    --region us-east5
```

---

## NEXT STEPS AFTER DEPLOYMENT

1. ✅ Test all features on live URL
2. ✅ Share URL with stakeholders
3. ✅ Get feedback
4. ✅ Configure custom domain
5. ✅ Set up monitoring
6. ✅ Migrate to Vertex AI Claude
7. ✅ Fix security issues
8. ✅ Add comprehensive tests
9. ✅ Launch pilot program

---

## SUPPORT

**Documentation:**
- GCP Cloud Run: https://cloud.google.com/run/docs
- Cloud SQL: https://cloud.google.com/sql/docs
- Vertex AI: https://cloud.google.com/vertex-ai/docs

**Your Files:**
- `SECURITY_AUDIT_REPORT.md` - Security fixes needed
- `CODE_IMPROVEMENT_ASSESSMENT.md` - Code quality notes
- `READY_TO_DEMO.md` - Demo guide

---

**Ready to deploy? Just run `DEPLOY_TO_GCP.bat` and wait!** 🚀
