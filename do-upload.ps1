# Simple upload script using SCP
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "准备上传文件到服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "服务器: $ServerIP" -ForegroundColor Yellow
Write-Host "用户名: $Username" -ForegroundColor Yellow
Write-Host "远程路径: $RemotePath" -ForegroundColor Yellow
Write-Host ""
Write-Host "重要提示: 当提示输入密码时，请输入: $Password" -ForegroundColor Green
Write-Host ""
Write-Host "开始上传..." -ForegroundColor Yellow
Write-Host ""

# Execute SCP command
$scpCommand = "scp -r -o StrictHostKeyChecking=no `"$LocalPath\*`" ${Username}@${ServerIP}:${RemotePath}/"

Write-Host "执行命令: $scpCommand" -ForegroundColor Gray
Write-Host ""

# Run the command
Invoke-Expression $scpCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "上传完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步: SSH 连接到服务器并执行部署" -ForegroundColor Yellow
    Write-Host "  ssh root@$ServerIP" -ForegroundColor White
    Write-Host "  密码: $Password" -ForegroundColor White
    Write-Host ""
    Write-Host "然后在服务器上执行:" -ForegroundColor Yellow
    Write-Host "  cd /var/www/maclock" -ForegroundColor White
    Write-Host "  chmod +x deploy-complete.sh" -ForegroundColor White
    Write-Host "  ./deploy-complete.sh" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "上传可能失败，请查看上面的错误信息" -ForegroundColor Red
    Write-Host "或者使用 WinSCP/FileZilla 手动上传（参考 UPLOAD_GUIDE.md）" -ForegroundColor Yellow
}



