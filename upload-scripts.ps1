# Upload diagnostic and restart scripts
$localPath = "C:\Users\apple\Documents\Maclock"
$files = @(
    "check-server-status.sh",
    "restart-server.sh",
    "force-rebuild-and-restart.sh"
)

foreach ($file in $files) {
    $scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" $file`nchmod +x $file`nexit`n"
    $scriptFile = Join-Path $env:TEMP "winscp_$($file.Replace('.sh', '')).txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    & "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
    Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
    Write-Host "$file uploaded!" -ForegroundColor Green
}

Write-Host "`nAll scripts uploaded! Please run check-server-status.sh on server first." -ForegroundColor Yellow


