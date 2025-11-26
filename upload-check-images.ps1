# Upload check images script
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`nput check-images.sh /var/www/maclock/`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_check_images.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Check images script uploaded!" -ForegroundColor Green





