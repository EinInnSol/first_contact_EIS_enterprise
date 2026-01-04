@echo off
echo ========================================
echo First Contact E.I.S. - Interactive Demo
echo ========================================
echo.
echo Starting demo server...
echo.

cd frontend

echo Installing dependencies (if needed)...
call npm install

echo.
echo Building demo...
call npm run build

echo.
echo Starting server...
echo.
echo ========================================
echo Demo will open at: http://localhost:3000/demo
echo ========================================
echo.

start http://localhost:3000/demo
call npm run start

pause
