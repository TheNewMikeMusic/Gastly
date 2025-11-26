# Upload trust strip error boundary fix
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\components\TrustStrip.tsx`" components/TrustStrip.tsx`nput `"$localPath\app\page.tsx`" app/page.tsx`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_trust_error_boundary.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Trust strip error boundary fix uploaded!" -ForegroundColor Green





