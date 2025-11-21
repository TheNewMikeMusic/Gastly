# Upload network fix script
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`nput fix-network-access.sh /var/www/maclock/`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_network_fix.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Network fix script uploaded!" -ForegroundColor Green


