# Upload directly using server credentials
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
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
    exit 1
}

Write-Host "Found WinSCP: $winscpPath" -ForegroundColor Green
Write-Host "Server: $ServerIP" -ForegroundColor Yellow
Write-Host "Local path: $LocalPath" -ForegroundColor Yellow
Write-Host "Remote path: $RemotePath" -ForegroundColor Yellow
Write-Host ""

# Create WinSCP script with directory creation
$scriptContent = "option batch abort`n"
$scriptContent += "option confirm off`n"
$scriptContent += "open sftp://${Username}:${Password}@${ServerIP}`n"
$scriptContent += "call mkdir -p $RemotePath`n"
$scriptContent += "cd $RemotePath`n"
$scriptContent += "put `"$LocalPath\*`" *`n"
$scriptContent += "exit`n"

$scriptFile = Join-Path $env:TEMP "winscp_upload_script.txt"
$logFile = Join-Path $env:TEMP "winscp_upload.log"

$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII

Write-Host "Uploading files..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
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
    Write-Host "     ssh root@$ServerIP" -ForegroundColor Gray
    Write-Host "     Password: $Password" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Run deployment on server:" -ForegroundColor White
    Write-Host "     cd /var/www/maclock" -ForegroundColor Gray
    Write-Host "     chmod +x deploy-complete.sh" -ForegroundColor Gray
    Write-Host "     ./deploy-complete.sh" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Trying alternative method: creating directories first..." -ForegroundColor Yellow
    
    # Try creating directories using SSH command
    $scriptContent2 = "option batch abort`n"
    $scriptContent2 += "option confirm off`n"
    $scriptContent2 += "open sftp://${Username}:${Password}@${ServerIP}`n"
    $scriptContent2 += "call mkdir -p /var/www`n"
    $scriptContent2 += "call mkdir -p $RemotePath`n"
    $scriptContent2 += "cd $RemotePath`n"
    $scriptContent2 += "put `"$LocalPath\*`" *`n"
    $scriptContent2 += "exit`n"
    
    $scriptContent2 | Out-File -FilePath $scriptFile -Encoding ASCII
    & $winscpPath /script=$scriptFile /log=$logFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Upload completed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Upload failed. Please create directory manually:" -ForegroundColor Red
        Write-Host "  SSH to server and run: mkdir -p /var/www/maclock" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or upload to home directory first:" -ForegroundColor Yellow
        Write-Host "  Remote path: ~/maclock" -ForegroundColor White
        Write-Host ""
        Write-Host "Log file: $logFile" -ForegroundColor Yellow
    }
}

# Clean up
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
