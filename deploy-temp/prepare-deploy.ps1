# Prepare deployment files
$DeployDir = "deploy-temp"
if (Test-Path $DeployDir) {
    Remove-Item -Recurse -Force $DeployDir
}
New-Item -ItemType Directory -Path $DeployDir | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow

# Use robocopy to copy files (excluding unnecessary directories)
robocopy . $DeployDir /E /XD node_modules .next .git deploy-temp Maclock /XF .env.local .env /NFL /NDL /NJH /NJS

Write-Host "Files prepared!" -ForegroundColor Green
Write-Host "Deployment files located at: $DeployDir" -ForegroundColor Cyan
