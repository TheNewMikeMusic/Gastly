# Upload fixed components
$localPath = "C:\Users\apple\Documents\Maclock\components"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock/components`nput `"$localPath\FeaturesGrid.tsx`"`nput `"$localPath\FAQ.tsx`"`nput `"$localPath\SellerReviews.tsx`"`nput `"$localPath\TrustStrip.tsx`"`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_fix_components.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Fixed components uploaded!" -ForegroundColor Green
