@echo off
title First Contact E.I.S. - Cloud SQL Setup
color 0A

echo ==========================================
echo First Contact E.I.S. - Cloud SQL Setup
echo ==========================================
echo.

set PROJECT_ID=einharjer-valhalla
set REGION=us-east5
set INSTANCE_NAME=firstcontact-db
set DATABASE_NAME=firstcontact
set DB_USER=fcadmin

echo Setting GCP project to %PROJECT_ID%...
gcloud config set project %PROJECT_ID%
gcloud config set compute/region %REGION%

echo.
echo Enabling Cloud SQL Admin API...
gcloud services enable sqladmin.googleapis.com

REM Check if instance exists
gcloud sql instances describe %INSTANCE_NAME% >nul 2>&1
if %errorlevel% == 0 (
    echo.
    echo Cloud SQL instance '%INSTANCE_NAME%' already exists.
    echo Skipping instance creation.
    goto CreateUser
)

echo.
echo Creating Cloud SQL PostgreSQL instance...
echo Instance: %INSTANCE_NAME%
echo Tier: db-f1-micro (1 vCPU, 614 MB RAM) - ~$7/month
echo This will take 5-10 minutes...
echo.

gcloud sql instances create %INSTANCE_NAME% ^
    --database-version=POSTGRES_15 ^
    --tier=db-f1-micro ^
    --region=%REGION% ^
    --storage-type=HDD ^
    --storage-size=10GB ^
    --storage-auto-increase ^
    --availability-type=zonal ^
    --backup-start-time=03:00 ^
    --maintenance-window-day=SUN ^
    --maintenance-window-hour=4 ^
    --database-flags=max_connections=100,shared_buffers=256MB ^
    --quiet

echo.
echo Cloud SQL instance created successfully!

:CreateUser
echo.
echo Creating database user '%DB_USER%'...
echo Enter a secure password for the database user:
set /p DB_PASSWORD="Password: "

gcloud sql users create %DB_USER% ^
    --instance=%INSTANCE_NAME% ^
    --password=%DB_PASSWORD% ^
    --quiet 2>nul || (
    echo User already exists, updating password...
    gcloud sql users set-password %DB_USER% ^
        --instance=%INSTANCE_NAME% ^
        --password=%DB_PASSWORD% ^
        --quiet
)

echo.
echo Creating database '%DATABASE_NAME%'...
gcloud sql databases create %DATABASE_NAME% ^
    --instance=%INSTANCE_NAME% ^
    --quiet 2>nul || echo Database already exists.

REM Get connection name
for /f "tokens=*" %%i in ('gcloud sql instances describe %INSTANCE_NAME% --format="value(connectionName)"') do set CONNECTION_NAME=%%i

REM Build database URL
set DATABASE_URL=postgresql+asyncpg://%DB_USER%:%DB_PASSWORD%@/%DATABASE_NAME%?host=/cloudsql/%CONNECTION_NAME%

echo.
echo ==========================================
echo Cloud SQL Setup Complete!
echo ==========================================
echo.
echo Connection Name: %CONNECTION_NAME%
echo Database: %DATABASE_NAME%
echo User: %DB_USER%
echo.
echo Storing DATABASE_URL in Secret Manager...
gcloud services enable secretmanager.googleapis.com --quiet

REM Check if secret exists
gcloud secrets describe firstcontact-db-url --quiet >nul 2>&1
if %errorlevel% == 0 (
    echo Updating existing secret 'firstcontact-db-url'...
    echo %DATABASE_URL% | gcloud secrets versions add firstcontact-db-url --data-file=-
) else (
    echo Creating new secret 'firstcontact-db-url'...
    echo %DATABASE_URL% | gcloud secrets create firstcontact-db-url --data-file=-
)

echo.
echo DATABASE_URL stored in Secret Manager as 'firstcontact-db-url'
echo.
echo Next steps:
echo 1. Deploy backend: cd backend ^&^& gcloud run deploy firstcontact-api --source .
echo 2. Run migrations: See backend/migrations/README.md
echo 3. Seed demo data: Create Cloud Run job with seed_demo_data.py
echo.

pause
