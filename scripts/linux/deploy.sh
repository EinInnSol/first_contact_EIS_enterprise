#!/bin/bash

# First Contact E.I.S. - Pilot Deployment Automator
# Fulfills Phase 8: Deployment & Pilot Readiness

PROJECT_ID="einharjer-valhalla"
PROJECT_NUMBER="403538493221"
REGION="us-east5"
DB_CONNECTION="einharjer-valhalla:us-central1:firstcontact-eis-db"

echo "🚀 Starting Live Deployment for: $PROJECT_ID ($PROJECT_NUMBER)"

# Default Cloud Run service account
SERVICE_ACCOUNT="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

# 1. Grant permissions to service account
echo "🔑 Configuring IAM permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor" || true

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.viewer" || true

# 2. Build & Push Backend Container
echo "📦 Building Backend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/nexus-api ./backend

# 3. Build & Push Frontend Container
echo "📦 Building Frontend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/nexus-frontend ./frontend

# 3. Deploy Backend to Cloud Run
echo "📡 Deploying API to Cloud Run..."
gcloud run deploy nexus-api \
  --image gcr.io/$PROJECT_ID/nexus-api \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances $DB_CONNECTION \
  --set-env-vars "ENVIRONMENT=production,PILOT_MODE=True,GCP_PROJECT_ID=$PROJECT_ID,GCP_REGION=$REGION"

# 4. Deploy Frontend to Cloud Run
echo "📡 Deploying Frontend to Cloud Run..."
gcloud run deploy nexus-frontend \
  --image gcr.io/$PROJECT_ID/nexus-frontend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated


echo "✅ Deployment Complete! Pilot environment ready."
