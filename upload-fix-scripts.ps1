# Upload fix scripts
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`nput setup-env.sh /var/www/maclock/`nput fix-and-continue.sh /var/www/maclock/`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_fix_env.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Fix scripts uploaded!" -ForegroundColor Green
