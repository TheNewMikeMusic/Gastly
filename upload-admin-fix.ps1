# Upload admin login fix
$localPath = "C:\Users\apple\Documents\Maclock"
$files = @(
    "app\api\admin\login\route.ts",
    "app\admin\login\page.tsx"
)

foreach ($file in $files) {
    $remotePath = $file.Replace('\', '/')
    $scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" $remotePath`nexit`n"
    $scriptFile = Join-Path $env:TEMP "winscp_admin_$($file.Replace('\', '_').Replace('/', '_')).txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    & "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
    Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
    Write-Host "$file uploaded!" -ForegroundColor Green
}

Write-Host "`nAdmin login fixes uploaded!" -ForegroundColor Yellow
Write-Host "Please rebuild on server: npm run build && pm2 restart maclock" -ForegroundColor Cyan





