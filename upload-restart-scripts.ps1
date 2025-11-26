# Upload restart scripts
$localPath = "C:\Users\apple\Documents\Maclock"
$scripts = @("check-api-error.sh", "force-restart-api.sh")

foreach ($script in $scripts) {
    $scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$script`" $script`nexit`n"
    $scriptFile = Join-Path $env:TEMP "winscp_$script.txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    & "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
    Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
    Write-Host "$script uploaded!" -ForegroundColor Green
}





