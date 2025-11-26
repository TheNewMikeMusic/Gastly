# Upload navigation and checkout fixes
$localPath = "C:\Users\apple\Documents\Maclock"
$files = @(
    "components\Navigation.tsx",
    "app\checkout\page.tsx"
)

foreach ($file in $files) {
    $remotePath = $file.Replace('\', '/')
    $scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" $remotePath`nexit`n"
    $scriptFile = Join-Path $env:TEMP "winscp_$($file.Replace('\', '_').Replace('/', '_')).txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    & "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
    Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
    Write-Host "$file uploaded!" -ForegroundColor Green
}

Write-Host "`nNavigation and checkout fixes uploaded! Please rebuild on server." -ForegroundColor Yellow





