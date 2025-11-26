# 上传域名配置文件和脚本到服务器
# 使用方法: .\upload-domain-config.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$false)]
    [string]$Password
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "上传域名配置文件到服务器" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查文件是否存在
$files = @(
    "nginx-domain.conf",
    "setup-domain.sh",
    "配置域名.md"
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ 文件不存在: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "📁 准备上传以下文件:" -ForegroundColor Yellow
foreach ($file in $files) {
    Write-Host "   - $file" -ForegroundColor Gray
}

Write-Host ""

# 使用SCP上传文件
$scpPath = "scp"
if (-not (Get-Command $scpPath -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未找到 scp 命令" -ForegroundColor Red
    Write-Host "请安装 OpenSSH 客户端或使用 WinSCP" -ForegroundColor Yellow
    exit 1
}

try {
    Write-Host "📤 上传文件到服务器..." -ForegroundColor Yellow
    
    foreach ($file in $files) {
        Write-Host "   上传: $file" -ForegroundColor Gray
        
        if ($Password) {
            # 如果提供了密码，使用sshpass（需要安装）
            sshpass -p $Password scp $file "${Username}@${ServerIP}:~/"
        } else {
            # 使用SSH密钥认证
            scp $file "${Username}@${ServerIP}:~/"
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ $file 上传成功" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $file 上传失败" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host ""
    Write-Host "✅ 所有文件上传完成！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步操作:" -ForegroundColor Cyan
    Write-Host "1. SSH连接到服务器: ssh ${Username}@${ServerIP}" -ForegroundColor Yellow
    Write-Host "2. 赋予脚本执行权限: chmod +x setup-domain.sh" -ForegroundColor Yellow
    Write-Host "3. 运行配置脚本: sudo ./setup-domain.sh" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "❌ 上传失败: $_" -ForegroundColor Red
    exit 1
}



