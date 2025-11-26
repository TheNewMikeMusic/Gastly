# Auto configure domain hello1984.net using sshpass
$ServerIP = "38.175.195.104"
$Username = "root"
$Password = "0iHSn3CpCpDmlkub"
$Domain = "hello1984.net"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Configuring domain: $Domain" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Uploading script to server..." -ForegroundColor Yellow

# Use bash to execute sshpass commands
$uploadScript = @"
export SSHPASS='$Password'
sshpass -e scp -o StrictHostKeyChecking=no domain-setup.sh ${Username}@${ServerIP}:/tmp/
"@

$uploadScript | bash

if ($LASTEXITCODE -eq 0) {
    Write-Host "Script uploaded successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "Executing configuration script..." -ForegroundColor Yellow
    
    # Upload updated script and execute
    $uploadScript2 = @"
export SSHPASS='$Password'
sshpass -e scp -o StrictHostKeyChecking=no domain-setup.sh ${Username}@${ServerIP}:/tmp/
"@
    $uploadScript2 | bash
    
    # Execute script
    $executeScript = @"
export SSHPASS='$Password'
sshpass -e ssh -o StrictHostKeyChecking=no ${Username}@${ServerIP} 'bash /tmp/domain-setup.sh'
"@
    
    $executeScript | bash
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "Domain configuration completed!" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Domain: $Domain" -ForegroundColor Cyan
        Write-Host "Access URL: http://$Domain" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Important notes:" -ForegroundColor Yellow
        Write-Host "1. Ensure DNS is correctly pointing to server IP ($ServerIP)" -ForegroundColor Gray
        Write-Host "2. Ensure firewall allows port 80" -ForegroundColor Gray
        Write-Host "3. If using cloud server, check security group rules" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "Configuration execution failed" -ForegroundColor Red
        Write-Host "Please check error messages" -ForegroundColor Yellow
    }
} else {
    Write-Host "Script upload failed" -ForegroundColor Red
    Write-Host "Please check network connection and server status" -ForegroundColor Yellow
}
