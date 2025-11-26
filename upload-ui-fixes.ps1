# Upload UI fixes
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\components\Hero.tsx`" components/Hero.tsx`nput `"$localPath\app\checkout\page.tsx`" app/checkout/page.tsx`nput `"$localPath\components\SellerReviews.tsx`" components/SellerReviews.tsx`nput `"$localPath\app\globals.css`" app/globals.css`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_ui_fixes.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "UI fixes uploaded!" -ForegroundColor Green





