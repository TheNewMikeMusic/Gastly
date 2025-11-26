# Upload and deploy all files
$localPath = "C:\Users\apple\Documents\Maclock"
$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\components\ProductSpinVideo.tsx`" components/ProductSpinVideo.tsx`nput `"$localPath\deploy-image-sequence.sh`" deploy-image-sequence.sh`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_upload_all.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "Files uploaded! Now deploying..." -ForegroundColor Green





