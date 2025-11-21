# Upload layout fix
$localPath = "C:\Users\apple\Documents\Maclock"
$file = "app\layout.tsx"

$scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" app/layout.tsx`nexit`n"
$scriptFile = Join-Path $env:TEMP "winscp_layout_final.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "$file uploaded!" -ForegroundColor Green


