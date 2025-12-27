# 🚀 GCP Deployment Verification Checklist

## PRE-DEPLOYMENT CHECKS

### Local Environment
- [ ] Google Cloud SDK installed (`gcloud --version`)
- [ ] Logged in to GCP (`gcloud auth list`)
- [ ] Project set to `einharjer-valhalla` (`gcloud config get project`)
- [ ] Region set to `us-east5` (`gcloud config get run/region`)
- [ ] Git repository up to date (all changes committed)

### Code Verification
- [ ] Backend runs locally (`cd backend && uvicorn app.main:app`)
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] All tests passing (`cd backend && pytest`)
- [ ] No hardcoded secrets in code (check `.env` files are in `.gitignore`)

### GCP Project Setup
- [ ] Billing enabled on project `einharjer-valhalla`
- [ ] Owner or Editor role assigned to your account
- [ ] APIs enabled (will be done by script):
  - Cloud Run API
  - Cloud SQL Admin API
  - Secret Manager API
  - Vertex AI API
  - Cloud Build API

---

## DEPLOYMENT STEPS

### Windows Users
```batch
# Run the deployment script
DEPLOY_TO_GCP.bat
```

### Linux/Mac Users
```bash
# Make script executable
chmod +x DEPLOY_TO_GCP.sh

# Run deployment
./DEPLOY_TO_GCP.sh
```

### What the Script Does
1. ✅ Sets GCP project and region
2. ✅ Enables required APIs
3. ✅ Creates Cloud SQL PostgreSQL instance (5-10 min wait)
4. ✅ Creates database and user
5. ✅ Generates and stores secrets (JWT, DATABASE_URL)
6. ✅ Deploys backend to Cloud Run
7. ✅ Deploys frontend to Cloud Run
8. ✅ Opens app in browser

---

## POST-DEPLOYMENT VERIFICATION

### 1. Cloud SQL Database
```bash
# Check instance status
gcloud sql instances list

# Should show: firstcontact-db | RUNNABLE | us-east5
```

- [ ] Cloud SQL instance `firstcontact-db` is RUNNABLE
- [ ] Database `firstcontact` exists
- [ ] User `fcadmin` created

### 2. Secret Manager
```bash
# List secrets
gcloud secrets list
```

- [ ] Secret `firstcontact-jwt-secret` exists
- [ ] Secret `firstcontact-db-url` exists
- [ ] (Optional) Secret `firstcontact-anthropic-key` exists

### 3. Backend API Deployment
```bash
# Get backend URL
gcloud run services describe firstcontact-api --region=us-east5 --format="value(status.url)"

# Test health endpoint
curl https://firstcontact-api-XXXXXXXXX.run.app/health
```

Expected response:
```json
{"status": "healthy", "database": "connected"}
```

- [ ] Backend service `firstcontact-api` deployed
- [ ] Service is publicly accessible
- [ ] Health check returns 200 OK
- [ ] Database connection successful
- [ ] Secrets mounted correctly (check logs)

### 4. Frontend Deployment
```bash
# Get frontend URL
gcloud run services describe firstcontact-web --region=us-east5 --format="value(status.url)"

# Open in browser
start https://firstcontact-web-XXXXXXXXX.run.app  # Windows
open https://firstcontact-web-XXXXXXXXX.run.app   # Mac
```

- [ ] Frontend service `firstcontact-web` deployed
- [ ] Service is publicly accessible
- [ ] Page loads without errors
- [ ] Can reach login page
- [ ] Backend API URL configured correctly

### 5. Full Application Flow
- [ ] Navigate to frontend URL
- [ ] Login page displays correctly
- [ ] Login with demo credentials fails (no data seeded yet)
- [ ] No console errors (check browser DevTools)

---

## DATA SEEDING (REQUIRED FOR DEMO)

### Option 1: Local Seeding via Cloud SQL Proxy

```bash
# Install Cloud SQL Proxy
# Windows: Download from https://cloud.google.com/sql/docs/postgres/sql-proxy
# Mac: brew install cloud-sql-proxy

# Get connection name
CONNECTION_NAME=$(gcloud sql instances describe firstcontact-db --format="value(connectionName)")

# Start proxy in separate terminal
cloud-sql-proxy $CONNECTION_NAME

# In another terminal, set DATABASE_URL
export DATABASE_URL="postgresql+asyncpg://fcadmin:ChangeMe123!@127.0.0.1:5432/firstcontact"

# Run seeder
cd backend
python seed_demo_data.py
```

### Option 2: Cloud Run Job (Recommended)

```bash
# Create seeding job
cd backend
gcloud run jobs create seed-demo \
    --source . \
    --region us-east5 \
    --set-secrets=DATABASE_URL=firstcontact-db-url:latest \
    --add-cloudsql-instances=$(gcloud sql instances describe firstcontact-db --format="value(connectionName)") \
    --tasks=1 \
    --max-retries=0 \
    --task-timeout=10m \
    --execute-now \
    --wait

# Check job logs
gcloud run jobs logs read seed-demo --region=us-east5
```

- [ ] Seeding job completed successfully
- [ ] 52 clients created
- [ ] 4 vendors created (PATH, MHALA, LAMP, HOPICS)
- [ ] 5 users created (admin, caseworkers)
- [ ] 4 QR locations created

---

## FINAL VERIFICATION

### Test Demo Flow

#### 1. Login as Caseworker
```
URL: https://firstcontact-web-XXXXXXXXX.run.app
Email: maria@path.org
Password: demo123
Organization: longbeach
```

- [ ] Login successful
- [ ] Dashboard loads
- [ ] Client list displays (52 clients)
- [ ] Can click on client "Robert Thompson"

#### 2. Test AI Case Plan
- [ ] Navigate to Robert Thompson's detail page
- [ ] Click "Case Plan" tab
- [ ] Click "Generate AI Case Plan" button
- [ ] AI generates plan (or shows fallback if API key not set)
- [ ] Plan displays with milestones, actions, barriers

#### 3. Test Benefit Enrollment
- [ ] Click "Benefits" tab
- [ ] See benefit projection ($2,347/month)
- [ ] Benefit enrollment wizard displays
- [ ] Can view SSI, CalFresh, GR details

#### 4. Login as City Admin (Layer 8)
```
URL: https://firstcontact-web-XXXXXXXXX.run.app
Email: admin@longbeach.gov
Password: demo123
Organization: longbeach
```

- [ ] Login successful
- [ ] City dashboard loads (different from caseworker view)
- [ ] Vendor performance table displays
- [ ] PATH shows 73% housing rate
- [ ] MHALA shows 24% housing rate
- [ ] AI Strategic Advisor tab visible

#### 5. Test AI Chatbot (Layer 8)
- [ ] Click "AI Strategic Advisor" tab
- [ ] Type question: "Why is MHALA underperforming?"
- [ ] AI responds with analysis (or fallback if API key not set)
- [ ] Suggested questions display

---

## OPTIONAL: VERTEX AI SETUP

If you want full AI features (not fallback mode):

### 1. Enable Vertex AI
```bash
gcloud services enable aiplatform.googleapis.com
```

### 2. Get Service Account
```bash
SERVICE_ACCOUNT=$(gcloud run services describe firstcontact-api \
    --region=us-east5 \
    --format="value(spec.template.spec.serviceAccountName)")

echo "Service Account: $SERVICE_ACCOUNT"
```

### 3. Grant Permissions
```bash
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"
```

### 4. Update Code (see VERTEX_AI_MIGRATION.md)
- [ ] Update `backend/app/services/ai_case_plan.py`
- [ ] Update `backend/app/services/ai_strategic_advisor.py`
- [ ] Change from `Anthropic` to `AnthropicVertex`
- [ ] Redeploy backend

### 5. Test AI Features
- [ ] Generate AI case plan (should use real Claude)
- [ ] Ask AI chatbot question (should use real Claude)
- [ ] Check logs for "Vertex AI" confirmations

---

## MONITORING & LOGS

### View Backend Logs
```bash
# Tail logs
gcloud run services logs tail firstcontact-api --region=us-east5

# Read recent logs
gcloud run services logs read firstcontact-api --region=us-east5 --limit=50
```

### View Frontend Logs
```bash
gcloud run services logs tail firstcontact-web --region=us-east5
```

### Check Metrics
```bash
# Open Cloud Console
gcloud console run
```

- [ ] No error spikes in logs
- [ ] Response times < 1s average
- [ ] CPU usage < 50%
- [ ] Memory usage < 70%

---

## SECURITY HARDENING (BEFORE PRODUCTION)

See `.claude/SECURITY_AUDIT_REPORT.md` for full details.

### Critical Fixes Needed:
- [ ] Add Layer 8 access control tests
- [ ] Fix UUID validation vulnerability
- [ ] Add rate limiting to AI endpoints
- [ ] Lock down CORS to specific domains
- [ ] Change default database password
- [ ] Generate strong JWT secret (done by script)
- [ ] Add authentication to Cloud Run services (remove `--allow-unauthenticated` for backend)

### Production Checklist:
- [ ] Custom domain configured
- [ ] SSL certificate (handled by Cloud Run)
- [ ] Monitoring alerts set up
- [ ] Backup strategy configured
- [ ] Disaster recovery plan
- [ ] Load testing completed

---

## TROUBLESHOOTING

### "Permission Denied" Error
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login
```

### "Service Unavailable" Error
```bash
# Check service status
gcloud run services describe firstcontact-api --region=us-east5

# Check recent deployments
gcloud run revisions list --service=firstcontact-api --region=us-east5
```

### "Database Connection Failed"
```bash
# Verify Cloud SQL instance
gcloud sql instances list

# Check connection settings
gcloud run services describe firstcontact-api --region=us-east5 --format="value(spec.template.spec.containers[0].env)"
```

### "Build Failed" Error
```bash
# List recent builds
gcloud builds list --limit=5

# View build logs
gcloud builds log BUILD_ID
```

### Frontend Can't Reach Backend
```bash
# Verify backend URL in frontend env vars
gcloud run services describe firstcontact-web --region=us-east5 --format="value(spec.template.spec.containers[0].env)"

# Should show NEXT_PUBLIC_API_URL pointing to backend
```

---

## ROLLBACK PROCEDURE

If deployment breaks something:

### 1. List Revisions
```bash
gcloud run revisions list --service=firstcontact-api --region=us-east5
```

### 2. Rollback Backend
```bash
gcloud run services update-traffic firstcontact-api \
    --to-revisions=PREVIOUS_REVISION=100 \
    --region=us-east5
```

### 3. Rollback Frontend
```bash
gcloud run services update-traffic firstcontact-web \
    --to-revisions=PREVIOUS_REVISION=100 \
    --region=us-east5
```

---

## COST MONITORING

### View Current Costs
```bash
# Open billing dashboard
gcloud console billing
```

### Expected Monthly Costs (Demo Usage)
- Cloud Run (backend): ~$0-5 (free tier)
- Cloud Run (frontend): ~$0-5 (free tier)
- Cloud SQL (db-f1-micro): ~$7
- Secret Manager: ~$0
- Cloud Build: ~$0 (free tier)

**Total: ~$8-13/month**

### Set Budget Alerts
```bash
# Create $50 budget alert
gcloud billing budgets create \
    --billing-account=YOUR_BILLING_ACCOUNT \
    --display-name="First Contact Demo Budget" \
    --budget-amount=50
```

---

## SUCCESS CRITERIA

✅ **Deployment successful if:**
- Backend API responds to health checks
- Frontend loads in browser
- Can login with demo credentials
- Client list displays after seeding
- Can generate case plans (with or without AI)
- Layer 8 dashboard shows vendor comparison
- No critical errors in logs

✅ **Ready for demo if:**
- All success criteria met
- Demo data seeded successfully
- AI features working (or graceful fallback)
- All 3 user profiles accessible
- Load time < 3 seconds

✅ **Production-ready if:**
- Security audit items addressed
- Tests passing (multi-tenant + Layer 8)
- Monitoring configured
- Backup strategy in place
- Performance tested under load

---

## NEXT STEPS AFTER DEPLOYMENT

1. ✅ Test all features with demo data
2. ✅ Share URLs with stakeholders
3. ✅ Gather feedback on UI/UX
4. ✅ Migrate to Vertex AI Claude (see VERTEX_AI_MIGRATION.md)
5. ✅ Fix critical security issues
6. ✅ Add comprehensive tests
7. ✅ Set up custom domain (optional)
8. ✅ Configure monitoring and alerts
9. ✅ Plan pilot program with first CoC

---

**🎉 Deployment complete! You now have First Contact E.I.S. running on Google Cloud Platform.**

For support, see:
- GCP_DEPLOYMENT_GUIDE.md - Full deployment documentation
- VERTEX_AI_MIGRATION.md - Migrate to Vertex AI Claude
- .claude/SECURITY_AUDIT_REPORT.md - Security fixes needed
- READY_TO_DEMO.md - Demo guide
