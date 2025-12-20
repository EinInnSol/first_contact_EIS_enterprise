# First Contact E.I.S. - Development Startup Script
# Run this script to start all services needed for development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  First Contact E.I.S. - Dev Startup   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Cloud SQL Proxy is already running
$proxyRunning = Get-Process -Name "cloud-sql-proxy-win" -ErrorAction SilentlyContinue

if ($proxyRunning) {
    Write-Host "[OK] Cloud SQL Proxy already running (PID: $($proxyRunning.Id))" -ForegroundColor Green
} else {
    Write-Host "[STARTING] Cloud SQL Proxy..." -ForegroundColor Yellow
    Start-Process -FilePath ".\cloud-sql-proxy-win.exe" -ArgumentList "einharjer-valhalla:us-east5:first-contact-db" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    
    # Verify it started
    $proxyCheck = Get-Process -Name "cloud-sql-proxy-win" -ErrorAction SilentlyContinue
    if ($proxyCheck) {
        Write-Host "[OK] Cloud SQL Proxy started (PID: $($proxyCheck.Id))" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Cloud SQL Proxy failed to start!" -ForegroundColor Red
        Write-Host "Make sure you're authenticated with: gcloud auth application-default login" -ForegroundColor Red
        exit 1
    }
}

# Test database connection
Write-Host ""
Write-Host "[TESTING] Database connection..." -ForegroundColor Yellow
$testResult = Test-NetConnection -ComputerName 127.0.0.1 -Port 5432 -WarningAction SilentlyContinue

if ($testResult.TcpTestSucceeded) {
    Write-Host "[OK] Database connection ready on localhost:5432" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Cannot connect to database on port 5432" -ForegroundColor Red
    exit 1
}

# Activate virtual environment and show status
Write-Host ""
Write-Host "[INFO] To activate the Python environment, run:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate" -ForegroundColor White
Write-Host ""
Write-Host "[INFO] To run tests:" -ForegroundColor Cyan
Write-Host "  pytest tests/ -v" -ForegroundColor White
Write-Host ""
Write-Host "[INFO] To start the API server:" -ForegroundColor Cyan
Write-Host "  uvicorn app.main:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ready to build! Let's go!            " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
