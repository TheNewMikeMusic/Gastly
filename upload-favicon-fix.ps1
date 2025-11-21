# Upload favicon fix
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock/app`nput `"$localPath\app\layout.tsx`"`ncd /var/www/maclock/lib`nput `"$localPath\lib\config.ts`"`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_favicon_fix.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Favicon fix uploaded!" -ForegroundColor Green
