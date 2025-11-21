# Upload using WinSCP with saved session
param(
    [string]$SessionName = "hello1084",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Uploading files using WinSCP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find WinSCP
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
    Write-Host "Error: WinSCP not found" -ForegroundColor Red
    Write-Host "Please ensure WinSCP is installed" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found WinSCP: $winscpPath" -ForegroundColor Green
Write-Host "Using session: $SessionName" -ForegroundColor Yellow
Write-Host "Local path: $LocalPath" -ForegroundColor Yellow
Write-Host "Remote path: $RemotePath" -ForegroundColor Yellow
Write-Host ""

# Create WinSCP script
$scriptContent = "option batch abort`n"
$scriptContent += "option confirm off`n"
$scriptContent += "open $SessionName`n"
$scriptContent += "mkdir $RemotePath`n"
$scriptContent += "cd $RemotePath`n"
$scriptContent += "put `"$LocalPath\*`" *`n"
$scriptContent += "exit`n"

$scriptFile = Join-Path $env:TEMP "winscp_upload_script.txt"
$logFile = Join-Path $env:TEMP "winscp_upload.log"

$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII

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
    Write-Host "  1. SSH to server:" -ForegroundColor White
    Write-Host "     ssh root@38.175.195.104" -ForegroundColor Gray
    Write-Host "     Password: 0iHSn3CpCpDmlkub" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Run deployment on server:" -ForegroundColor White
    Write-Host "     cd /var/www/maclock" -ForegroundColor Gray
    Write-Host "     chmod +x deploy-complete.sh" -ForegroundColor Gray
    Write-Host "     ./deploy-complete.sh" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Upload may have failed. Check log file:" -ForegroundColor Red
    Write-Host "  $logFile" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or manually upload in WinSCP:" -ForegroundColor Yellow
    Write-Host "  1. Open WinSCP" -ForegroundColor White
    Write-Host "  2. Connect to session: $SessionName" -ForegroundColor White
    Write-Host "  3. Navigate to: $RemotePath" -ForegroundColor White
    Write-Host "  4. Upload all files from $LocalPath folder" -ForegroundColor White
    Write-Host ""
}

# Clean up
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
