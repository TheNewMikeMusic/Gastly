# Upload check-clerk-key script
$localPath = "C:\Users\apple\Documents\Maclock"
$file = "check-clerk-key.sh"

$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" $file`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_check.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "$file uploaded!" -ForegroundColor Green
Write-Host "`nPlease run on server: chmod +x check-clerk-key.sh && ./check-clerk-key.sh" -ForegroundColor Yellow





