@echo off
REM First Contact E.I.S. - GCP Deployment Script for Windows
REM Run this to deploy everything to Google Cloud Platform

title First Contact E.I.S. - GCP Deployment
color 0A

echo.
echo ==========================================
echo FIRST CONTACT E.I.S. - GCP DEPLOYMENT
echo ==========================================
echo.

REM Configuration
set PROJECT_ID=einharjer-valhalla
set REGION=us-east5
set SERVICE_NAME=firstcontact-api
set FRONTEND_SERVICE=firstcontact-web
set DB_INSTANCE=firstcontact-db
set DB_NAME=firstcontact

echo Project: %PROJECT_ID%
echo Region: %REGION%
echo.

REM Check if gcloud is installed
where gcloud >nul 2>nul
if errorlevel 1 (
    echo ERROR: Google Cloud SDK not found!
    echo.
    echo Please install it from:
    echo https://cloud.google.com/sdk/docs/install
    echo.
    pause
    exit /b 1
)

REM Step 1: Set GCP Project
echo [1/8] Setting GCP project...
gcloud config set project %PROJECT_ID%
gcloud config set run/region %REGION%
if errorlevel 1 (
    echo ERROR: Failed to set project. Make sure you're logged in:
    echo   gcloud auth login
    pause
    exit /b 1
)

REM Step 2: Enable Required APIs
echo.
echo [2/8] Enabling required GCP APIs...
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com aiplatform.googleapis.com cloudbuild.googleapis.com
if errorlevel 1 (
    echo WARNING: Some APIs may already be enabled
)

REM Step 3: Create Cloud SQL Instance
echo.
echo [3/8] Setting up Cloud SQL PostgreSQL...
gcloud sql instances describe %DB_INSTANCE% >nul 2>nul
if errorlevel 1 (
    echo Creating new Cloud SQL instance (this takes 5-10 minutes)...
    echo Please wait...
    gcloud sql instances create %DB_INSTANCE% ^
        --database-version=POSTGRES_15 ^
        --tier=db-f1-micro ^
        --region=%REGION% ^
        --storage-type=HDD ^
        --storage-size=10GB ^
        --storage-auto-increase ^
        --backup-start-time=03:00 ^
        --quiet

    gcloud sql databases create %DB_NAME% --instance=%DB_INSTANCE% --quiet
    gcloud sql users create fcadmin --instance=%DB_INSTANCE% --password=ChangeMe123! --quiet
    echo ✅ Cloud SQL instance created
) else (
    echo ✅ Cloud SQL instance already exists
)

REM Get Cloud SQL connection name
for /f "tokens=*" %%i in ('gcloud sql instances describe %DB_INSTANCE% --format="value(connectionName)"') do set CONNECTION_NAME=%%i

REM Step 3.5: Setup Secrets
echo.
echo [3.5/8] Setting up Secret Manager...

REM Generate JWT secret
powershell -Command "$bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)" > jwt_temp.txt
set /p JWT_SECRET=<jwt_temp.txt
del jwt_temp.txt

REM Create or update JWT secret
gcloud secrets describe firstcontact-jwt-secret --quiet >nul 2>nul
if errorlevel 1 (
    echo %JWT_SECRET% | gcloud secrets create firstcontact-jwt-secret --data-file=- --quiet
) else (
    echo %JWT_SECRET% | gcloud secrets versions add firstcontact-jwt-secret --data-file=- --quiet
)

REM Create DATABASE_URL secret
set DATABASE_URL=postgresql+asyncpg://fcadmin:ChangeMe123!@/%DB_NAME%?host=/cloudsql/%CONNECTION_NAME%
gcloud secrets describe firstcontact-db-url --quiet >nul 2>nul
if errorlevel 1 (
    echo %DATABASE_URL% | gcloud secrets create firstcontact-db-url --data-file=- --quiet
) else (
    echo %DATABASE_URL% | gcloud secrets versions add firstcontact-db-url --data-file=- --quiet
)

echo ✅ Secrets configured

REM Step 4: Deploy Backend
echo.
echo [4/8] Deploying backend API to Cloud Run...
cd backend

gcloud run deploy %SERVICE_NAME% ^
    --source . ^
    --platform managed ^
    --region %REGION% ^
    --allow-unauthenticated ^
    --memory=1Gi ^
    --cpu=1 ^
    --timeout=300 ^
    --max-instances=10 ^
    --min-instances=0 ^
    --port=8080 ^
    --set-env-vars=ENVIRONMENT=production,DEBUG=false ^
    --set-secrets=DATABASE_URL=firstcontact-db-url:latest,JWT_SECRET=firstcontact-jwt-secret:latest ^
    --add-cloudsql-instances=%CONNECTION_NAME% ^
    --quiet

if errorlevel 1 (
    echo ERROR: Backend deployment failed
    cd ..
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('gcloud run services describe %SERVICE_NAME% --region=%REGION% --format="value(status.url)"') do set BACKEND_URL=%%i
echo ✅ Backend deployed: %BACKEND_URL%

cd ..

REM Step 5: Deploy Frontend
echo.
echo [5/8] Deploying frontend to Cloud Run...
cd frontend

REM Create production env file with backend URL
echo NEXT_PUBLIC_API_URL=%BACKEND_URL% > .env.production
echo NEXT_PUBLIC_APP_NAME=First Contact E.I.S. >> .env.production

gcloud run deploy %FRONTEND_SERVICE% ^
    --source . ^
    --platform managed ^
    --region %REGION% ^
    --allow-unauthenticated ^
    --memory=1Gi ^
    --cpu=1 ^
    --timeout=60 ^
    --max-instances=10 ^
    --min-instances=0 ^
    --port=8080 ^
    --set-env-vars=NEXT_PUBLIC_API_URL=%BACKEND_URL% ^
    --quiet

if errorlevel 1 (
    echo ERROR: Frontend deployment failed
    cd ..
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('gcloud run services describe %FRONTEND_SERVICE% --region=%REGION% --format="value(status.url)"') do set FRONTEND_URL=%%i
echo ✅ Frontend deployed: %FRONTEND_URL%

cd ..

REM Final Summary
echo.
echo ==========================================
echo ✅ DEPLOYMENT COMPLETE!
echo ==========================================
echo.
echo 🌐 Frontend URL:  %FRONTEND_URL%
echo 🔌 Backend API:   %BACKEND_URL%
echo 🗄️  Database:     %DB_INSTANCE% (Cloud SQL)
echo.
echo 📋 Demo Credentials:
echo    Email: admin@longbeach.gov
echo    Password: demo123
echo    Org: longbeach
echo.
echo 🔧 Next Steps:
echo    1. Visit %FRONTEND_URL%
echo    2. Login with demo credentials
echo    3. Seed demo data (see instructions below)
echo.
echo 📊 To seed demo data:
echo    gcloud run jobs create seed-demo --source backend --region %REGION% --execute-now
echo.
echo 📊 Monitor logs:
echo    gcloud run services logs tail %SERVICE_NAME% --region %REGION%
echo.
echo ==========================================
echo.
echo Opening frontend in browser...
start %FRONTEND_URL%
echo.

pause
