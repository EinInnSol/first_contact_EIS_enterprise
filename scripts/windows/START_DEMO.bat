@echo off
title First Contact E.I.S. - Demo Launcher
color 0A

REM Navigate to Project Root (assuming script is in scripts/windows)
cd /d "%~dp0..\.."

echo.
echo ===============================================================
echo    FIRST CONTACT E.I.S. - AI-Powered Homeless Services
echo    The Trojan Horse for 400+ Cities
echo ===============================================================
echo.

REM Check if this is first run
if not exist ".demo_initialized" (
    echo [1/4] First-time setup detected...
    echo.

    REM Install backend dependencies
    echo Installing Python dependencies...
    cd backend
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install Python dependencies
        pause
        exit /b 1
    )
    cd ..

    REM Install frontend dependencies
    echo Installing Node.js dependencies...
    cd frontend
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install Node.js dependencies
        pause
        exit /b 1
    )
    cd ..

    REM Seed demo data
    echo.
    echo [2/4] Seeding demo database with realistic data...
    cd backend
    python seed_complete_demo.py
    if errorlevel 1 (
        echo WARNING: Demo data seeding had issues, but continuing...
    )
    cd ..

    REM Mark as initialized
    echo. > .demo_initialized
    echo.
    echo [3/4] Setup complete!
    echo.
)

echo [4/4] Starting First Contact E.I.S...
echo.

REM Start backend in new window
echo Starting Backend API Server...
start "First Contact API" cmd /k "cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Start frontend in new window
echo Starting Frontend Dashboard...
start "First Contact Dashboard" cmd /k "cd frontend && npm run dev"

REM Wait for frontend to start
timeout /t 8 /nobreak > nul

REM Open browser
echo.
echo Opening dashboard in your browser...
start http://localhost:3000

echo.
echo ===============================================================
echo    DEMO IS RUNNING!
echo ===============================================================
echo.
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo    Demo Login (City Admin - Layer 8):
echo    Email: admin@longbeach.gov
echo    Password: demo123
echo    Org: longbeach
echo.
echo    Demo Login (Caseworker):
echo    Email: maria@path.org
echo    Password: demo123
echo    Org: longbeach
echo.
echo    Press Ctrl+C in the server windows to stop
echo ===============================================================
echo.

pause
