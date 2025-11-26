# Upload iOS fixes
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\components\SellerReviews.tsx`" components/SellerReviews.tsx`nput `"$localPath\app\error.tsx`" app/error.tsx`nput `"$localPath\next.config.js`" next.config.js`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_ios_fixes.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "iOS fixes uploaded!" -ForegroundColor Green





