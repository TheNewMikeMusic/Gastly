# Upload all fixes to server
$localPath = "C:\Users\apple\Documents\Maclock"
$files = @(
    "components\OptimizedImage.tsx",
    "components\FeaturesGrid.tsx",
    "components\SellerReviews.tsx",
    "components\Navigation.tsx",
    "app\layout.tsx",
    "app\sign-in\[[...sign-in]]\page.tsx",
    "app\login\page.tsx",
    "app\checkout\page.tsx",
    "app\globals.css",
    "middleware.ts",
    "app\api\inventory\check\route.ts"
)

foreach ($file in $files) {
    $remotePath = $file.Replace('\', '/')
    # 处理特殊路径
    $remotePath = $remotePath.Replace('[', '[').Replace(']', ']')
    $scriptContent = "option batch abort`noption confirm off`nopen sftp://root:0iHSn3CpCpDmlkub@38.175.195.104`ncd /var/www/maclock`nput `"$localPath\$file`" $remotePath`nexit`n"
    $scriptFile = Join-Path $env:TEMP "winscp_$($file.Replace('\', '_').Replace('/', '_').Replace('[', '').Replace(']', '').Replace('...', '')).txt"
    $scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII
    & "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=$scriptFile
    Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
    Write-Host "$file uploaded!" -ForegroundColor Green
}

Write-Host "`nAll fixes uploaded! Please run force-rebuild.sh on server." -ForegroundColor Yellow





