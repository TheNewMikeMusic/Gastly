# Upload BT Panel HTTPS setup
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput check-bt-nginx.sh /var/www/maclock/`nput setup-bt-https.sh /var/www/maclock/`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_bt_https.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "BT Panel HTTPS setup uploaded!" -ForegroundColor Green


