#!/bin/bash
# Cloud SQL PostgreSQL Setup Script
# Creates database instance with optimized settings for First Contact E.I.S.

set -e  # Exit on error

PROJECT_ID="einharjer-valhalla"
REGION="us-east5"
INSTANCE_NAME="firstcontact-db"
DATABASE_NAME="firstcontact"
DB_USER="fcadmin"

echo "=========================================="
echo "First Contact E.I.S. - Cloud SQL Setup"
echo "=========================================="
echo ""

# Set project and region
echo "Setting GCP project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION

# Enable required APIs
echo ""
echo "Enabling Cloud SQL Admin API..."
gcloud services enable sqladmin.googleapis.com

# Check if instance already exists
if gcloud sql instances describe $INSTANCE_NAME --quiet 2>/dev/null; then
    echo ""
    echo "Cloud SQL instance '$INSTANCE_NAME' already exists."
    echo "Skipping instance creation."
else
    echo ""
    echo "Creating Cloud SQL PostgreSQL instance..."
    echo "Instance: $INSTANCE_NAME"
    echo "Tier: db-f1-micro (1 vCPU, 614 MB RAM) - ~$7/month"
    echo "This will take 5-10 minutes..."

    gcloud sql instances create $INSTANCE_NAME \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=HDD \
        --storage-size=10GB \
        --storage-auto-increase \
        --availability-type=zonal \
        --backup-start-time=03:00 \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=4 \
        --database-flags=max_connections=100,shared_buffers=256MB \
        --quiet

    echo ""
    echo "Cloud SQL instance created successfully!"
fi

# Generate secure password
echo ""
echo "Generating secure password for database user..."
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Create database user
echo "Creating database user '$DB_USER'..."
gcloud sql users create $DB_USER \
    --instance=$INSTANCE_NAME \
    --password=$DB_PASSWORD \
    --quiet 2>/dev/null || echo "User already exists, updating password..."

gcloud sql users set-password $DB_USER \
    --instance=$INSTANCE_NAME \
    --password=$DB_PASSWORD \
    --quiet

# Create database
echo "Creating database '$DATABASE_NAME'..."
gcloud sql databases create $DATABASE_NAME \
    --instance=$INSTANCE_NAME \
    --quiet 2>/dev/null || echo "Database already exists."

# Get connection name
CONNECTION_NAME=$(gcloud sql instances describe $INSTANCE_NAME --format="value(connectionName)")

# Build database URL
DATABASE_URL="postgresql+asyncpg://$DB_USER:$DB_PASSWORD@/$DATABASE_NAME?host=/cloudsql/$CONNECTION_NAME"

echo ""
echo "=========================================="
echo "Cloud SQL Setup Complete!"
echo "=========================================="
echo ""
echo "Connection Name: $CONNECTION_NAME"
echo "Database: $DATABASE_NAME"
echo "User: $DB_USER"
echo ""
echo "To store the DATABASE_URL in Secret Manager:"
echo ""
echo "echo '$DATABASE_URL' | gcloud secrets create firstcontact-db-url --data-file=-"
echo ""
echo "Or update existing secret:"
echo ""
echo "echo '$DATABASE_URL' | gcloud secrets versions add firstcontact-db-url --data-file=-"
echo ""

# Store in Secret Manager
echo "Storing DATABASE_URL in Secret Manager..."
gcloud services enable secretmanager.googleapis.com --quiet

# Check if secret exists
if gcloud secrets describe firstcontact-db-url --quiet 2>/dev/null; then
    echo "Updating existing secret 'firstcontact-db-url'..."
    echo "$DATABASE_URL" | gcloud secrets versions add firstcontact-db-url --data-file=-
else
    echo "Creating new secret 'firstcontact-db-url'..."
    echo "$DATABASE_URL" | gcloud secrets create firstcontact-db-url --data-file=-
fi

echo ""
echo "DATABASE_URL stored in Secret Manager as 'firstcontact-db-url'"
echo ""
echo "Next steps:"
echo "1. Deploy backend: cd backend && gcloud run deploy firstcontact-api --source ."
echo "2. Run migrations: See backend/migrations/README.md"
echo "3. Seed demo data: Create Cloud Run job with seed_demo_data.py"
echo ""
