# Upload BuyButton fix
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock/components`nput `"$localPath\components\BuyButton.tsx`" BuyButton.tsx`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_buybutton_fix.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "BuyButton fix uploaded!" -ForegroundColor Green


