# Final upload script - tries multiple methods
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Maclock Deployment - File Upload" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Method 1: Try WinSCP
$winscpPaths = @(
    "C:\Program Files (x86)\WinSCP\WinSCP.com",
    "C:\Program Files\WinSCP\WinSCP.com"
)

foreach ($winscpPath in $winscpPaths) {
    if (Test-Path $winscpPath) {
        Write-Host "Found WinSCP, using it to upload..." -ForegroundColor Green
        $scriptContent = "option batch abort`noption confirm off`nopen sftp://${Username}:${Password}@${ServerIP}`nmkdir $RemotePath`ncd $RemotePath`nput `"$LocalPath\*`" *`nexit`n"
        $scriptFile = Join-Path $env:TEMP "winscp_script.txt"
        $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII -NoNewline
        & $winscpPath /script=$scriptFile
        Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Upload completed!" -ForegroundColor Green
            exit 0
        }
    }
}

# Method 2: Try plink/pscp (PuTTY)
$puttyPaths = @(
    "C:\Program Files (x86)\PuTTY\pscp.exe",
    "C:\Program Files\PuTTY\pscp.exe",
    "pscp.exe"
)

foreach ($pscpPath in $puttyPaths) {
    if (Get-Command $pscpPath -ErrorAction SilentlyContinue) {
        Write-Host "Found PuTTY pscp, using it to upload..." -ForegroundColor Green
        $pscpFullPath = (Get-Command $pscpPath).Source
        & $pscpFullPath -pw $Password -r "$LocalPath\*" "${Username}@${ServerIP}:${RemotePath}/"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Upload completed!" -ForegroundColor Green
            exit 0
        }
    }
}

# Method 3: Manual instructions
Write-Host ""
Write-Host "Automatic upload methods not available." -ForegroundColor Yellow
Write-Host "Please use one of these manual methods:" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPTION 1: Install WinSCP (Recommended - Easiest)" -ForegroundColor Cyan
Write-Host "  1. Download: https://winscp.net/eng/download.php" -ForegroundColor White
Write-Host "  2. Install WinSCP" -ForegroundColor White
Write-Host "  3. Run this script again: .\final-upload.ps1" -ForegroundColor White
Write-Host ""
Write-Host "OPTION 2: Use FileZilla (Free GUI Tool)" -ForegroundColor Cyan
Write-Host "  1. Download: https://filezilla-project.org/download.php?type=client" -ForegroundColor White
Write-Host "  2. Open FileZilla" -ForegroundColor White
Write-Host "  3. Enter:" -ForegroundColor White
Write-Host "     Host: sftp://$ServerIP" -ForegroundColor Gray
Write-Host "     Username: $Username" -ForegroundColor Gray
Write-Host "     Password: $Password" -ForegroundColor Gray
Write-Host "     Port: 22" -ForegroundColor Gray
Write-Host "  4. Navigate to $RemotePath on server" -ForegroundColor White
Write-Host "  5. Upload all files from $LocalPath folder" -ForegroundColor White
Write-Host ""
Write-Host "OPTION 3: Manual SCP Command" -ForegroundColor Cyan
Write-Host "  Run this command in PowerShell:" -ForegroundColor White
Write-Host "  scp -r deploy-temp\* root@$ServerIP`:/var/www/maclock/" -ForegroundColor Green
Write-Host "  When prompted for password, enter: $Password" -ForegroundColor White
Write-Host ""
Write-Host "After uploading, SSH to server and run deployment:" -ForegroundColor Yellow
Write-Host "  ssh root@$ServerIP" -ForegroundColor White
Write-Host "  Password: $Password" -ForegroundColor White
Write-Host "  cd /var/www/maclock" -ForegroundColor White
Write-Host "  chmod +x deploy-complete.sh" -ForegroundColor White
Write-Host "  ./deploy-complete.sh" -ForegroundColor White
Write-Host ""



