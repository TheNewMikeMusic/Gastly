# Upload files using .NET SSH libraries
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

Write-Host "Uploading files to server..." -ForegroundColor Cyan
Write-Host "Server: $ServerIP" -ForegroundColor Yellow
Write-Host ""

# Create a simple batch file that uses SCP with password prompt
$batchContent = @"
@echo off
chcp 65001 >nul
echo ========================================
echo Uploading files to server...
echo ========================================
echo.
echo Server: $ServerIP
echo Username: $Username
echo.
echo Please enter password when prompted: $Password
echo.
echo Starting upload...
echo.

scp -r -o StrictHostKeyChecking=no "$LocalPath\*" $Username@$ServerIP`:$RemotePath/

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
    echo    Server: sftp://$ServerIP
    echo    Username: $Username
    echo    Password: $Password
    echo    Remote path: $RemotePath
    echo.
    echo 2. Use FileZilla:
    echo    Download: https://filezilla-project.org/
    echo    Server: sftp://$ServerIP
    echo    Username: $Username
    echo    Password: $Password
    echo    Remote path: $RemotePath
    echo.
    pause
)
"@

$batchFile = "upload-now.bat"
$batchContent | Out-File -FilePath $batchFile -Encoding UTF8

Write-Host "Created upload script: $batchFile" -ForegroundColor Green
Write-Host ""
Write-Host "Executing upload script..." -ForegroundColor Yellow
Write-Host ""

# Execute the batch file
& cmd /c $batchFile



