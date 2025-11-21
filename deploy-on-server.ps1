# Deploy on server via SSH
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Connecting to server and deploying..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create SSH command
$deployCommands = @"
cd /var/www/maclock
chmod +x deploy-complete.sh
./deploy-complete.sh
"@

Write-Host "SSH to server and execute deployment..." -ForegroundColor Yellow
Write-Host "Server: $ServerIP" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: You may need to enter password manually:" -ForegroundColor Yellow
Write-Host "Password: $Password" -ForegroundColor Gray
Write-Host ""

# Try to execute via SSH
$sshCommand = "ssh -o StrictHostKeyChecking=no ${Username}@${ServerIP} `"$deployCommands`""

Write-Host "Executing: $sshCommand" -ForegroundColor Gray
Write-Host ""

# Execute SSH command
Invoke-Expression $sshCommand



