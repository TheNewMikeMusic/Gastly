# Upload verify script
$localPath = "C:\Users\apple\Documents\Maclock"
$file = "verify-clerk-config.sh"

$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" $file`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_verify.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "$file uploaded!" -ForegroundColor Green
Write-Host "`nPlease run on server: chmod +x verify-clerk-config.sh && ./verify-clerk-config.sh" -ForegroundColor Yellow


