@echo off
chcp 65001 >nul
echo ========================================
echo Uploading files to server...
echo ========================================
echo.
echo Server: 38.175.195.104
echo Username: root
echo.
echo Please enter password when prompted: 0iHSn3CpCpDmlkub
echo.
echo Starting upload...
echo.

scp -r -o StrictHostKeyChecking=no "deploy-temp\*" root@38.175.195.104:/var/www/maclock/

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Upload completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Upload failed!
    echo ========================================
    echo.
    echo Please try one of these alternatives:
    echo.
    echo 1. Use WinSCP (recommended):
    echo    Download: https://winscp.net/
    echo    Server: sftp://38.175.195.104
    echo    Username: root
    echo    Password: 0iHSn3CpCpDmlkub
    echo    Remote path: /var/www/maclock
    echo.
    echo 2. Use FileZilla:
    echo    Download: https://filezilla-project.org/
    echo    Server: sftp://38.175.195.104
    echo    Username: root
    echo    Password: 0iHSn3CpCpDmlkub
    echo    Remote path: /var/www/maclock
    echo.
    pause
)
