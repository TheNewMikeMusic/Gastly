@echo off
echo Uploading files to server...
echo.
echo Please enter password when prompted: 0iHSn3CpCpDmlkub
echo.

REM Try using SCP with password
scp -r -o StrictHostKeyChecking=no "deploy-temp\*" root@38.175.195.104:/var/www/maclock/

if errorlevel 1 (
    echo.
    echo SCP failed. Trying alternative method...
    echo.
    echo Please install one of the following tools:
    echo 1. WinSCP - https://winscp.net/
    echo 2. PuTTY (pscp) - https://www.putty.org/
    echo.
    echo Or manually upload files using FileZilla:
    echo Server: sftp://38.175.195.104
    echo Username: root
    echo Password: 0iHSn3CpCpDmlkub
    echo Remote path: /var/www/maclock
    pause
)
