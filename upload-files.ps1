# Upload files to server using WinSCP
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

# Check for WinSCP
$winscpPaths = @(
    "C:\Program Files (x86)\WinSCP\WinSCP.com",
    "C:\Program Files\WinSCP\WinSCP.com"
)

$winscpPath = $null
foreach ($path in $winscpPaths) {
    if (Test-Path $path) {
        $winscpPath = $path
        break
    }
}

if (-not $winscpPath) {
    Write-Host ""
    Write-Host "WinSCP not found. Please install WinSCP or use manual upload." -ForegroundColor Red
    Write-Host "Download: https://winscp.net/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use FileZilla:" -ForegroundColor Yellow
    Write-Host "  Server: sftp://$ServerIP" -ForegroundColor White
    Write-Host "  Username: $Username" -ForegroundColor White
    Write-Host "  Password: $Password" -ForegroundColor White
    Write-Host "  Remote path: $RemotePath" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Uploading files using WinSCP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create WinSCP script
$scriptContent = "option batch abort`n"
$scriptContent += "option confirm off`n"
$scriptContent += "open sftp://${Username}:${Password}@${ServerIP}`n"
$scriptContent += "mkdir $RemotePath`n"
$scriptContent += "cd $RemotePath`n"
$scriptContent += "put `"$LocalPath\*`" *`n"
$scriptContent += "exit`n"

$scriptFile = Join-Path $env:TEMP "winscp_upload_script.txt"
$logFile = Join-Path $env:TEMP "winscp_upload.log"

$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII -NoNewline

Write-Host "Uploading files..." -ForegroundColor Yellow
Write-Host ""

# Execute WinSCP
& $winscpPath /script=$scriptFile /log=$logFile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Upload completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  ssh root@$ServerIP" -ForegroundColor White
    Write-Host "  Password: $Password" -ForegroundColor White
    Write-Host ""
    Write-Host "Then on server:" -ForegroundColor Yellow
    Write-Host "  cd /var/www/maclock" -ForegroundColor White
    Write-Host "  chmod +x deploy-complete.sh" -ForegroundColor White
    Write-Host "  ./deploy-complete.sh" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Upload may have failed. Check log: $logFile" -ForegroundColor Red
    Write-Host "Or use manual upload method (see UPLOAD_GUIDE.md)" -ForegroundColor Yellow
}

# Clean up
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue



