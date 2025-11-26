# 使用 sshpass 部署 Maclock 到服务器 (PowerShell版本)
# 注意: 此脚本需要在 WSL 或 Git Bash 中运行 bash 脚本

param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Maclock 项目部署脚本 (使用 sshpass)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 WSL 是否可用
$wslAvailable = $false
try {
    $null = wsl --version 2>$null
    $wslAvailable = $true
} catch {
    $wslAvailable = $false
}

# 检查 Git Bash 是否可用
$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
if (-not (Test-Path $gitBashPath)) {
    $gitBashPath = "C:\Program Files (x86)\Git\bin\bash.exe"
}

if ($wslAvailable) {
    Write-Host "检测到 WSL，使用 WSL 执行部署脚本..." -ForegroundColor Yellow
    Write-Host ""
    
    # 获取当前目录的 WSL 路径
    $currentPath = (Get-Location).Path
    $wslPath = wsl wslpath -a $currentPath
    
    # 在 WSL 中执行部署脚本
    wsl bash -c "cd '$wslPath' && bash deploy-with-sshpass.sh"
    
} elseif (Test-Path $gitBashPath) {
    Write-Host "检测到 Git Bash，使用 Git Bash 执行部署脚本..." -ForegroundColor Yellow
    Write-Host ""
    
    $currentPath = (Get-Location).Path
    & $gitBashPath -c "cd '$currentPath' && bash deploy-with-sshpass.sh"
    
} else {
    Write-Host "错误: 未找到 WSL 或 Git Bash" -ForegroundColor Red
    Write-Host ""
    Write-Host "请选择以下方式之一:" -ForegroundColor Yellow
    Write-Host "1. 安装 WSL: wsl --install" -ForegroundColor Green
    Write-Host "2. 安装 Git Bash: https://git-scm.com/downloads" -ForegroundColor Green
    Write-Host "3. 使用 WSL 或 Git Bash 手动执行: bash deploy-with-sshpass.sh" -ForegroundColor Green
    Write-Host ""
    Write-Host "或者，你可以使用以下命令手动部署:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "# 在 WSL/Git Bash 中执行:" -ForegroundColor Cyan
    Write-Host "bash deploy-with-sshpass.sh" -ForegroundColor Green
    exit 1
}

