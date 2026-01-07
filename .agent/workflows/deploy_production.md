---
description: Deploy the First Contact E.I.S. application to Google Cloud Run (Live Production)
---

# Deployment Workflow: "Operation Bifrost"

This workflow handles the safe, sequential deployment of the full stack to Google Cloud Run.

## Prerequisites
- [ ] GCP Project `einharjer-valhalla` selected
- [ ] Region `us-east5` selected
- [ ] User authenticated via `gcloud auth login`

## Steps

### 1. Pre-Flight Check
Check that the database is accessible and secrets are mounted.
```bash
gcloud secrets list --project einharjer-valhalla
```

### 2. Backend Deployment (API)
Deploy the core Python API.
// turbo
```bash
gcloud run deploy firstcontact-api --source backend --platform managed --region us-east5 --allow-unauthenticated --memory 1Gi --cpu 1 --min-instances 0 --max-instances 10 --set-env-vars "ENVIRONMENT=production"
```

### 3. Verify Backend
Check if the API is returning health stats.
```bash
curl -I https://firstcontact-api-4fmsifz77q-ul.a.run.app/health
```

### 4. Frontend Deployment (Web)
Deploy the Next.js frontend with the new Agreement Flow.
NOTE: We pass the API URL as a build-time argument or env var.
// turbo
```bash
gcloud run deploy firstcontact-web --source frontend --platform managed --region us-east5 --allow-unauthenticated --memory 1Gi --cpu 1 --set-env-vars "NEXT_PUBLIC_API_URL=https://firstcontact-api-4fmsifz77q-ul.a.run.app"
```

### 5. Final Smoke Test
Open the live URL and verify the "Restricted Access" overlay appears.
```bash
start https://firstcontact-web-403538493221.us-east5.run.app/
```
