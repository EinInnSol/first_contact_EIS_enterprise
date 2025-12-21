#!/bin/bash

# First Contact E.I.S. - Pilot Deployment Automator
# Fulfills Phase 8: Deployment & Pilot Readiness

PROJECT_ID=$(gcloud config get-value project)
REGION="us-east5"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

echo "🚀 Starting Deployment for Project: $PROJECT_ID"

# 0. Grant Permissions to Cloud Run (Service Account needs to read secrets)
# Default Cloud Run service account
SA_EMAIL="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"
echo "🔐 Granting Secret Access to $SA_EMAIL..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor"

# 1. Build & Push Backend Container
echo "📦 Building Backend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/nexus-api ./backend

# 2. Build & Push Frontend Container
echo "📦 Building Frontend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/nexus-frontend ./frontend

# 3. Deploy Backend to Cloud Run
echo "📡 Deploying API to Cloud Run..."
gcloud run deploy nexus-api \
  --image gcr.io/$PROJECT_ID/nexus-api \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "ENVIRONMENT=production,PILOT_MODE=True,GCP_PROJECT_ID=$PROJECT_ID"

# 4. Deploy Frontend to Cloud Run
echo "📡 Deploying Frontend to Cloud Run..."
gcloud run deploy nexus-frontend \
  --image gcr.io/$PROJECT_ID/nexus-frontend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated


echo "✅ Deployment Complete! Pilot environment ready."
