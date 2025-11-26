# Upload HTTPS setup files
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\nginx-maclock.conf`" nginx-maclock.conf`nput `"$localPath\setup-https.sh`" setup-https.sh`nput `"$localPath\HTTPS_SETUP.md`" HTTPS_SETUP.md`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_https_setup.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "HTTPS setup files uploaded!" -ForegroundColor Green





