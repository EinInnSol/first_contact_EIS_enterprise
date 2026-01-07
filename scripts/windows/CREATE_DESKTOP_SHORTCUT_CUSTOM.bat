@echo off
title Create Desktop Shortcut - First Contact E.I.S.
color 0A

echo.
echo ===============================================================
echo    FIRST CONTACT E.I.S. - Desktop Shortcut Creator
echo ===============================================================
echo.

set SCRIPT_DIR=%~dp0
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT=%DESKTOP%\First Contact E.I.S.lnk
set ICON_PATH=%SCRIPT_DIR%firstcontact.ico

REM Check if custom icon exists
if not exist "%ICON_PATH%" (
    echo WARNING: Custom icon not found at %ICON_PATH%
    echo Using default Windows icon instead...
    echo.
    echo To use custom icon:
    echo 1. Save your icon image as: %SCRIPT_DIR%firstcontact.ico
    echo 2. Run this script again
    echo.
    set ICON_PATH=%SystemRoot%\System32\SHELL32.dll,44
)

echo Creating desktop shortcut...
echo.

REM Create VBS script to make shortcut with custom icon
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = "%SHORTCUT%" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%SCRIPT_DIR%START_DEMO.bat" >> CreateShortcut.vbs
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> CreateShortcut.vbs
echo oLink.Description = "First Contact E.I.S. - AI Homeless Services Platform - Einharjer Project" >> CreateShortcut.vbs
echo oLink.IconLocation = "%ICON_PATH%" >> CreateShortcut.vbs
echo oLink.WindowStyle = 1 >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

REM Run VBS script
cscript //nologo CreateShortcut.vbs

REM Clean up
del CreateShortcut.vbs

echo.
echo ===============================================================
echo    ✅ DESKTOP SHORTCUT CREATED!
echo ===============================================================
echo.
echo    Look for "First Contact E.I.S." on your desktop
echo.
if exist "%ICON_PATH%" (
    echo    ✅ Custom Einharjer icon applied
) else (
    echo    ⚠️ Using default icon (add firstcontact.ico for custom icon)
)
echo.
echo    Double-click to launch the demo!
echo ===============================================================
echo.

pause
