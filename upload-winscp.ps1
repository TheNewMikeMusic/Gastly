# Upload using WinSCP command line
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$LocalPath = "deploy-temp",
    [string]$RemotePath = "/var/www/maclock"
)

# Check for WinSCP in common locations
$winscpPaths = @(
    "C:\Program Files (x86)\WinSCP\WinSCP.com",
    "C:\Program Files\WinSCP\WinSCP.com",
    "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com",
    "$env:ProgramFiles\WinSCP\WinSCP.com"
)

$winscpPath = $null
foreach ($path in $winscpPaths) {
    if (Test-Path $path) {
        $winscpPath = $path
        break
    }
}

if (-not $winscpPath) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "WinSCP 未安装" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "请选择以下方法之一上传文件:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "方法 1: 安装 WinSCP（推荐）" -ForegroundColor Cyan
    Write-Host "  下载: https://winscp.net/" -ForegroundColor White
    Write-Host "  安装后重新运行此脚本" -ForegroundColor White
    Write-Host ""
    Write-Host "方法 2: 使用 FileZilla" -ForegroundColor Cyan
    Write-Host "  下载: https://filezilla-project.org/" -ForegroundColor White
    Write-Host "  服务器: sftp://$ServerIP" -ForegroundColor White
    Write-Host "  用户名: $Username" -ForegroundColor White
    Write-Host "  密码: $Password" -ForegroundColor White
    Write-Host "  远程路径: $RemotePath" -ForegroundColor White
    Write-Host ""
    Write-Host "方法 3: 手动 SCP（需要输入密码）" -ForegroundColor Cyan
    Write-Host "  执行: scp -r deploy-temp\* root@$ServerIP`:/var/www/maclock/" -ForegroundColor White
    Write-Host "  密码: $Password" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "使用 WinSCP 上传文件" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "服务器: $ServerIP" -ForegroundColor Yellow
Write-Host "远程路径: $RemotePath" -ForegroundColor Yellow
Write-Host ""

# Create WinSCP script
$scriptContent = @"
option batch abort
option confirm off
open sftp://$Username`:$Password@$ServerIP
mkdir $RemotePath
cd $RemotePath
put "$LocalPath\*" *
exit
"@

$scriptFile = Join-Path $env:TEMP "winscp_upload_script.txt"
$scriptContent | Out-File -FilePath $scriptFile -Encoding ASCII -NoNewline

Write-Host "正在上传文件..." -ForegroundColor Yellow
Write-Host ""

# Execute WinSCP
& $winscpPath /script=$scriptFile /log=$env:TEMP\winscp_upload.log

# Check result
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
    $logFile = Join-Path $env:TEMP "winscp_upload.log"
    Write-Host "上传可能失败，请查看日志: $logFile" -ForegroundColor Red
    Write-Host "或使用其他方法上传（参考 UPLOAD_GUIDE.md）" -ForegroundColor Yellow
}

# Clean up
Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue

