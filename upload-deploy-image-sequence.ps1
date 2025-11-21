# Upload deploy script for image sequence
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`nput deploy-image-sequence.sh /var/www/maclock/`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_deploy_image_seq.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Deploy script uploaded!" -ForegroundColor Green


