# Upload navigation fixes
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\app\layout.tsx`" app/layout.tsx`nput `"$localPath\app\sign-in\[[...sign-in]]\page.tsx`" app/sign-in/[[...sign-in]]/page.tsx`nput `"$localPath\components\Navigation.tsx`" components/Navigation.tsx`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_nav_fixes.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Navigation fixes uploaded!" -ForegroundColor Green


