# Upload .env file to server
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\.env.local`" .env.local`nput `"$localPath\.env`" .env`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_upload_env.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Environment file uploaded!" -ForegroundColor Green





