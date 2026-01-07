@echo off
echo ========================================
echo   DEPLOY DEMO TO VERCEL
echo ========================================
echo.

cd frontend

echo Installing Vercel CLI...
call npm install -g vercel

echo.
echo Deploying to Vercel...
echo.
echo Follow the prompts:
echo 1. Press Y to set up and deploy
echo 2. Choose your Vercel account
echo 3. Press N for "Link to existing project"
echo 4. Enter project name: firstcontact-demo
echo 5. Press Enter for directory
echo 6. Press N for "Override settings"
echo.

call vercel --prod

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your demo is now live at the URL shown above.
echo Share this URL: https://your-project.vercel.app/demo
echo.
pause
