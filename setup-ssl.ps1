# Auto setup SSL certificate for hello1984.net using certbot
$ServerIP = "38.175.195.104"
$Username = "root"
$Password = "0iHSn3CpCpDmlkub"
$Domain = "hello1984.net"
$Email = "admin@hello1984.net"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Configuring SSL certificate: $Domain" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Uploading SSL setup script to server..." -ForegroundColor Yellow

# Upload SSL setup script
$uploadScript = @"
export SSHPASS='$Password'
sshpass -e scp -o StrictHostKeyChecking=no setup-ssl.sh ${Username}@${ServerIP}:/tmp/
"@

$uploadScript | bash

if ($LASTEXITCODE -eq 0) {
    Write-Host "Script uploaded successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "Executing SSL setup script..." -ForegroundColor Yellow
    Write-Host "Note: Script will automatically install certbot and obtain SSL certificate" -ForegroundColor Gray
    Write-Host ""
    
    # Execute SSL setup script
    $executeScript = @"
export SSHPASS='$Password'
sshpass -e ssh -o StrictHostKeyChecking=no ${Username}@${ServerIP} 'chmod +x /tmp/setup-ssl.sh && bash /tmp/setup-ssl.sh'
"@
    
    $executeScript | bash
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "SSL certificate configuration completed!" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Domain: $Domain" -ForegroundColor Cyan
        Write-Host "HTTPS URL: https://$Domain" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Important notes:" -ForegroundColor Yellow
        Write-Host "1. Certificate is configured, HTTP will redirect to HTTPS" -ForegroundColor Gray
        Write-Host "2. Certificate valid for 90 days, certbot will auto-renew" -ForegroundColor Gray
        Write-Host "3. Ensure firewall allows port 443" -ForegroundColor Gray
        Write-Host "4. If using cloud server, check security group rules" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "SSL configuration failed" -ForegroundColor Red
        Write-Host "Please check error messages" -ForegroundColor Yellow
    }
} else {
    Write-Host "Script upload failed" -ForegroundColor Red
    Write-Host "Please check network connection" -ForegroundColor Yellow
}
