# GCP SETUP GUIDE

**Project:** einharjer-valhalla  
**Region:** us-east5 (API), us-central1 (Database)

---

## STEP 1: Install gcloud CLI

### Windows
```powershell
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

### Mac/Linux
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

---

## STEP 2: Authenticate

```bash
gcloud auth login
gcloud config set project einharjer-valhalla
gcloud config set compute/region us-east5
```

---

## STEP 3: Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  storage.googleapis.com
```

---

## STEP 4: Create Cloud SQL Database

```bash
# Create instance (IMPORTANT: Database is in us-central1)
gcloud sql instances create firstcontact-eis-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create firstcontact \
  --instance=firstcontact-eis-db

# Set password
gcloud sql users set-password postgres \
  --instance=firstcontact-eis-db \
  --password=FCeis2025!Secure
```

---

## STEP 5: Deploy Schema

```bash
# Connect via Cloud SQL Proxy
cloud-sql-proxy einharjer-valhalla:us-central1:firstcontact-eis-db &

# Run schema
psql "host=127.0.0.1 dbname=firstcontact user=postgres" < docs/DATABASE_SCHEMA.sql
```

---

### Secret Manager (Production Mode)
The app loads secrets automatically from GCP Secret Manager:
- `nexus-anthropic-key` (Claude)
- `nexus-maps-key` (Google Maps)
- `nexus-jwt-secret` (JWT)
- `nexus-db-url` (PostgreSQL)

### Backend (.env - LOCAL ONLY)
```
ENVIRONMENT=development
PILOT_MODE=True
GCP_PROJECT_ID=einharjer-valhalla
DATABASE_URL=postgresql+asyncpg://postgres:FCeis2025!Secure@localhost:5432/firstcontact
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.firstcontact.run
```

---

## VERIFICATION

```bash
# Check database
gcloud sql instances describe first-contact-db

# Check APIs
gcloud services list --enabled

# Test connection
psql "host=127.0.0.1 dbname=firstcontact user=postgres" -c "\dt"
```

---

**Next:** Follow SPRINT_PLAN.md Week 1
