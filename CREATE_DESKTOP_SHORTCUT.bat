@echo off
title Create Desktop Shortcut for First Contact E.I.S.

echo Creating desktop shortcut...

set SCRIPT_DIR=%~dp0
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT=%DESKTOP%\First Contact Demo.lnk

REM Create VBS script to make shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = "%SHORTCUT%" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%SCRIPT_DIR%START_DEMO.bat" >> CreateShortcut.vbs
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> CreateShortcut.vbs
echo oLink.Description = "First Contact E.I.S. - AI Homeless Services Platform" >> CreateShortcut.vbs
echo oLink.IconLocation = "%SystemRoot%\System32\SHELL32.dll,44" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

REM Run VBS script
cscript CreateShortcut.vbs

REM Clean up
del CreateShortcut.vbs

echo.
echo ✅ Desktop shortcut created successfully!
echo.
echo You can now double-click "First Contact Demo" on your desktop to launch the demo.
echo.

pause
