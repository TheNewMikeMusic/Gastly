# Upload SignIn page with debug
$localPath = "C:\Users\apple\Documents\Maclock"
$file = "app\sign-in\[[...sign-in]]\page.tsx"

$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" app/sign-in/[[...sign-in]]/page.tsx`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_signin_debug.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "$file uploaded!" -ForegroundColor Green
Write-Host "`nPlease rebuild on server: npm run build && pm2 restart maclock" -ForegroundColor Yellow


