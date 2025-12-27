#!/bin/bash
# First Contact E.I.S. - Complete GCP Deployment Script
# Run this to deploy everything to Google Cloud Platform

set -e  # Exit on error

echo "=========================================="
echo "FIRST CONTACT E.I.S. - GCP DEPLOYMENT"
echo "=========================================="
echo ""

# Configuration
PROJECT_ID="einharjer-valhalla"
REGION="us-east5"
SERVICE_NAME="firstcontact-api"
FRONTEND_SERVICE="firstcontact-web"
DB_INSTANCE="firstcontact-db"
DB_NAME="firstcontact"

echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Step 1: Set GCP Project
echo "[1/8] Setting GCP project..."
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION

# Step 2: Enable Required APIs
echo "[2/8] Enabling required GCP APIs..."
gcloud services enable \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    aiplatform.googleapis.com \
    cloudbuild.googleapis.com

# Step 3: Create Cloud SQL Instance (if doesn't exist)
echo "[3/8] Setting up Cloud SQL PostgreSQL..."
if ! gcloud sql instances describe $DB_INSTANCE 2>/dev/null; then
    echo "Creating new Cloud SQL instance (this takes 5-10 minutes)..."
    gcloud sql instances create $DB_INSTANCE \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --root-password=$(openssl rand -base64 32) \
        --backup \
        --backup-start-time=03:00 \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=04

    # Create database
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE

    echo "✅ Cloud SQL instance created"
else
    echo "✅ Cloud SQL instance already exists"
fi

# Step 4: Store Secrets in Secret Manager
echo "[4/8] Setting up secrets..."

# JWT Secret
if ! gcloud secrets describe nexus-jwt-secret 2>/dev/null; then
    echo "Creating JWT secret..."
    openssl rand -base64 64 | gcloud secrets create nexus-jwt-secret --data-file=-
fi

# Database URL
DB_CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE --format='value(connectionName)')
DB_PASSWORD=$(gcloud sql users list --instance=$DB_INSTANCE --format='value(password)' --filter='name=postgres' | head -1)

if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 32)
    gcloud sql users set-password postgres --instance=$DB_INSTANCE --password="$DB_PASSWORD"
fi

DB_URL="postgresql+asyncpg://postgres:${DB_PASSWORD}@/firstcontact?host=/cloudsql/${DB_CONNECTION_NAME}"

echo -n "$DB_URL" | gcloud secrets create nexus-db-url --data-file=- --replication-policy=automatic 2>/dev/null || \
    echo -n "$DB_URL" | gcloud secrets versions add nexus-db-url --data-file=-

echo "✅ Secrets configured"

# Step 5: Build and Deploy Backend
echo "[5/8] Building and deploying backend API..."
cd backend

gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="ENVIRONMENT=production,GCP_PROJECT_ID=$PROJECT_ID,GCP_REGION=$REGION" \
    --set-secrets="JWT_SECRET=nexus-jwt-secret:latest,DATABASE_URL=nexus-db-url:latest" \
    --add-cloudsql-instances=$DB_CONNECTION_NAME \
    --memory=1Gi \
    --cpu=1 \
    --timeout=300 \
    --min-instances=0 \
    --max-instances=10

BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
echo "✅ Backend deployed: $BACKEND_URL"

cd ..

# Step 6: Run Database Migrations
echo "[6/8] Running database migrations..."
# TODO: Add Alembic migrations here when ready

# Step 7: Seed Demo Data (Optional)
read -p "Seed demo data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding demo data..."
    # Run seed script via Cloud Run Jobs or locally with connection
    gcloud run jobs create seed-demo \
        --image=gcr.io/$PROJECT_ID/$SERVICE_NAME \
        --region=$REGION \
        --set-env-vars="DATABASE_URL=$DB_URL" \
        --execute-now \
        --wait
fi

# Step 8: Build and Deploy Frontend
echo "[7/8] Building and deploying frontend..."
cd frontend

# Update environment with backend URL
cat > .env.production <<EOF
NEXT_PUBLIC_API_URL=$BACKEND_URL
NEXT_PUBLIC_APP_NAME=First Contact E.I.S.
EOF

gcloud run deploy $FRONTEND_SERVICE \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --timeout=60 \
    --min-instances=0 \
    --max-instances=5

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format='value(status.url)')
echo "✅ Frontend deployed: $FRONTEND_URL"

cd ..

# Final Summary
echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "🌐 Frontend URL:  $FRONTEND_URL"
echo "🔌 Backend API:   $BACKEND_URL"
echo "🗄️  Database:     $DB_INSTANCE (Cloud SQL)"
echo ""
echo "📋 Demo Credentials:"
echo "   Email: admin@longbeach.gov"
echo "   Password: demo123"
echo "   Org: longbeach"
echo ""
echo "🔧 Next Steps:"
echo "   1. Visit $FRONTEND_URL"
echo "   2. Login with demo credentials"
echo "   3. Run seed script if you didn't yet"
echo ""
echo "📊 Monitor:"
echo "   - Logs: gcloud run services logs tail $SERVICE_NAME"
echo "   - Metrics: https://console.cloud.google.com/run"
echo ""
echo "=========================================="
