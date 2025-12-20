# GCP SETUP GUIDE

**Project:** einharjer-valhalla  
**Region:** us-east5

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
# Create instance
gcloud sql instances create first-contact-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-east5

# Create database
gcloud sql databases create firstcontact \
  --instance=first-contact-db

# Set password
gcloud sql users set-password postgres \
  --instance=first-contact-db \
  --password=YOUR_SECURE_PASSWORD
```

---

## STEP 5: Deploy Schema

```bash
# Connect via Cloud SQL Proxy
cloud-sql-proxy einharjer-valhalla:us-east5:first-contact-db &

# Run schema
psql "host=127.0.0.1 dbname=firstcontact user=postgres" < docs/DATABASE_SCHEMA.sql
```

---

## STEP 6: Environment Variables

### Backend (.env)
```
DB_HOST=/cloudsql/einharjer-valhalla:us-east5:first-contact-db
DB_NAME=firstcontact
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
GCP_PROJECT_ID=einharjer-valhalla
VERTEX_AI_LOCATION=us-east5
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
