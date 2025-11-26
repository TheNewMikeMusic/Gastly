# Upload console fixes
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\app\api\inventory\check\route.ts`" app/api/inventory/check/route.ts`nput `"$localPath\app\layout.tsx`" app/layout.tsx`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_console_fixes.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Console fixes uploaded!" -ForegroundColor Green





