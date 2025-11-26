# Upload PC fix files
$localPath = "C:\Users\apple\Documents\Maclock"
$files = @(
    "app\layout.tsx",
    "force-rebuild-pc-fix.sh"
)

foreach ($file in $files) {
    $remotePath = $file.Replace('\', '/')
    $remotePath = $remotePath.Replace('[', '[').Replace(']', ']')
    $scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" $remotePath`nexit`n"
    $scriptFile = Join-Path $env:TEMP "winscp_pc_$($file.Replace('\', '_').Replace('/', '_').Replace('[', '').Replace(']', '').Replace('...', '')).txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    & "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
    Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
    Write-Host "$file uploaded!" -ForegroundColor Green
}

Write-Host "`nPC fix files uploaded!" -ForegroundColor Yellow
Write-Host "Please run on server: chmod +x force-rebuild-pc-fix.sh && ./force-rebuild-pc-fix.sh" -ForegroundColor Cyan





