#!/bin/bash

# First Contact E.I.S. - Secret Initialization Utility
# Use this to safely upload production keys to GCP Secret Manager.

PROJECT_ID=$(gcloud config get-value project)

function create_secret() {
    local SECRET_ID=$1
    local SECRET_VAL=$2
    
    echo "🔐 Setting up secret: $SECRET_ID"
    
    # Create the secret if it doesn't exist
    gcloud secrets create $SECRET_ID --replication-policy="automatic" 2>/dev/null
    
    # Add a new version
    echo -n "$SECRET_VAL" | gcloud secrets versions add $SECRET_ID --data-file=-
}

echo "🛡️  Nexus Premium - Secret Initializer"
echo "-------------------------------------"
echo "This will securely upload your keys to project: $PROJECT_ID"
echo ""

read -p "Enter Anthropic API Key (Claude): " ANTHROPIC_KEY
create_secret "nexus-anthropic-key" "$ANTHROPIC_KEY"

read -p "Enter Google Maps API Key: " MAPS_KEY
create_secret "nexus-maps-key" "$MAPS_KEY"

read -p "Enter JWT Production Secret (or press enter for random): " JWT_SEC
if [ -z "$JWT_SEC" ]; then
    JWT_SEC=$(openssl rand -base64 32)
fi
create_secret "nexus-jwt-secret" "$JWT_SEC"

echo ""
echo "✅ All secrets secured in GCP Secret Manager."
echo "Running 'deploy.sh' will now automatically use these values."
