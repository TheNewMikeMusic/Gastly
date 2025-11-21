# Upload diagnose and fix scripts
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput diagnose-https.sh /var/www/maclock/`nput fix-https-connection.sh /var/www/maclock/`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_diagnose_fix.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Diagnose and fix scripts uploaded!" -ForegroundColor Green


