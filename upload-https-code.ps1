# Upload HTTPS code updates
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\lib\config.ts`" lib/config.ts`nput `"$localPath\app\layout.tsx`" app/layout.tsx`nput `"$localPath\next.config.js`" next.config.js`nput `"$localPath\env.example`" env.example`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_https_code.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "HTTPS code updates uploaded!" -ForegroundColor Green


