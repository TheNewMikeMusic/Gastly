# Upload all product-spin images to server
$localPath = "C:\Users\apple\Documents\Maclock\public"
$remotePath = "/var/www/maclock/public"

# Generate WinSCP script content
$scriptLines = @(
    "option batch abort",
    "option confirm off",
    "open sftp://root:0iHSn3CpCpDmlkub@38.175.195.104",
    "cd $remotePath"
)

# Add upload commands for all 60 images
for ($i = 0; $i -lt 60; $i++) {
    $paddedIndex = $i.ToString().PadLeft(3, '0')
    $fileName = "product-spin-$paddedIndex.webp"
    $localFile = Join-Path $localPath $fileName
    if (Test-Path $localFile) {
        $scriptLines += "put `"$localFile`" $fileName"
    }
}

$scriptLines += "exit"

$scriptContent = $scriptLines -join "`n"
$scriptFile = Join-Path $env:TEMP "winscp_upload_images.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII

Write-Host "Uploading 60 product-spin images..." -ForegroundColor Yellow
& "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
Write-Host "All images uploaded!" -ForegroundColor Green


