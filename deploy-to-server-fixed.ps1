# 完整部署脚本 - 上传代码到服务器并执行部署
param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$RemotePath = "/var/www/maclock"
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开始部署到服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "服务器: $ServerIP" -ForegroundColor Yellow
Write-Host "用户名: $Username" -ForegroundColor Yellow
Write-Host "远程路径: $RemotePath" -ForegroundColor Yellow
Write-Host ""

# 检查必要的文件
Write-Host "检查项目文件..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "错误: 找不到 package.json" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 项目文件检查通过" -ForegroundColor Green
Write-Host ""

# 创建临时目录用于上传
$tempDir = "deploy-temp"
if (Test-Path $tempDir) {
    Write-Host "清理临时目录..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Write-Host "✓ 临时目录已创建" -ForegroundColor Green
Write-Host ""

# 复制文件到临时目录（排除不需要的文件）
Write-Host "准备上传文件..." -ForegroundColor Yellow
$excludePatterns = @(
    "node_modules",
    ".next",
    ".git",
    "deploy-temp",
    "*.log",
    ".env.local",
    ".env",
    "*.md",
    "*.sh",
    "*.ps1",
    "*.bat",
    "*.jar",
    "Maclock"
)

# 获取所有文件
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    $shouldExclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($relativePath -like "*$pattern*") {
            $shouldExclude = $true
            break
        }
    }
    return -not $shouldExclude
}

$fileCount = 0
foreach ($file in $files) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    $targetPath = Join-Path $tempDir $relativePath
    $targetDir = Split-Path $targetPath -Parent
    
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    Copy-Item -Path $file.FullName -Destination $targetPath -Force
    $fileCount++
}

Write-Host "✓ 已准备 $fileCount 个文件" -ForegroundColor Green
Write-Host ""

# 使用SSH上传文件
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开始上传文件到服务器..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "服务器密码: $Password" -ForegroundColor Yellow
Write-Host ""

# 检查是否有WSL或Git Bash
$wslAvailable = Get-Command wsl -ErrorAction SilentlyContinue
$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
$gitBashAvailable = Test-Path $gitBashPath

# 创建简单的上传脚本文件
$scriptPath = "upload-temp.sh"
$scriptContent = @'
#!/bin/bash
SERVER_IP="PLACEHOLDER_SERVER_IP"
USERNAME="PLACEHOLDER_USERNAME"
PASSWORD="PLACEHOLDER_PASSWORD"
REMOTE_PATH="PLACEHOLDER_REMOTE_PATH"
LOCAL_PATH="PLACEHOLDER_LOCAL_PATH"

echo "========================================"
echo "Uploading files to server"
echo "========================================"
echo ""
echo "Server: $SERVER_IP"
echo "Remote path: $REMOTE_PATH"
echo ""
echo "Please enter password: $PASSWORD"
echo ""

scp -r -o StrictHostKeyChecking=no "$LOCAL_PATH"/* "${USERNAME}@${SERVER_IP}:${REMOTE_PATH}/"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Upload successful!"
    echo "========================================"
    exit 0
else
    echo ""
    echo "========================================"
    echo "Upload failed"
    echo "========================================"
    exit 1
fi
'@
$scriptContent = $scriptContent -replace 'PLACEHOLDER_SERVER_IP', $ServerIP
$scriptContent = $scriptContent -replace 'PLACEHOLDER_USERNAME', $Username
$scriptContent = $scriptContent -replace 'PLACEHOLDER_PASSWORD', $Password
$scriptContent = $scriptContent -replace 'PLACEHOLDER_REMOTE_PATH', $RemotePath
$scriptContent = $scriptContent -replace 'PLACEHOLDER_LOCAL_PATH', $tempDir
[System.IO.File]::WriteAllText($scriptPath, $scriptContent, [System.Text.Encoding]::UTF8)

# 尝试使用WSL或Git Bash上传
$uploadSuccess = $false

if ($wslAvailable) {
    Write-Host "检测到 WSL，使用 WSL 进行上传..." -ForegroundColor Green
    
    Write-Host "正在上传文件（需要输入密码: $Password）..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        wsl bash $scriptPath
        if ($LASTEXITCODE -eq 0) {
            $uploadSuccess = $true
        }
    } catch {
        Write-Host "WSL上传失败: $_" -ForegroundColor Yellow
    }
    
    if (Test-Path $scriptPath) {
        Remove-Item $scriptPath -Force
    }
} elseif ($gitBashAvailable) {
    Write-Host "检测到 Git Bash，使用 Git Bash 进行上传..." -ForegroundColor Green
    
    Write-Host "正在上传文件（需要输入密码: $Password）..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        & $gitBashPath $scriptPath
        if ($LASTEXITCODE -eq 0) {
            $uploadSuccess = $true
        }
    } catch {
        Write-Host "Git Bash上传失败: $_" -ForegroundColor Yellow
    }
    
    if (Test-Path $scriptPath) {
        Remove-Item $scriptPath -Force
    }
} else {
    # 即使没有WSL/Git Bash，也创建脚本文件供用户手动使用
    Write-Host "已创建上传脚本: $scriptPath" -ForegroundColor Green
    Write-Host "您可以使用 WSL、Git Bash 或其他工具运行此脚本" -ForegroundColor Yellow
}

# 如果自动上传失败，提供手动上传选项
if (-not $uploadSuccess) {
    Write-Host ""
    Write-Host "自动上传未成功，请选择上传方式:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "方法1: 使用 PowerShell SCP (需要手动输入密码)" -ForegroundColor Cyan
    Write-Host "  执行命令: scp -r `"$tempDir\*`" ${Username}@${ServerIP}:${RemotePath}/" -ForegroundColor Gray
    Write-Host "  密码: $Password" -ForegroundColor Gray
    Write-Host ""
    Write-Host "方法2: 使用 WinSCP (推荐，图形界面)" -ForegroundColor Cyan
    Write-Host "  1. 下载: https://winscp.net/" -ForegroundColor White
    Write-Host "  2. 连接信息:" -ForegroundColor White
    Write-Host "     - 协议: SFTP" -ForegroundColor White
    Write-Host "     - 主机: $ServerIP" -ForegroundColor White
    Write-Host "     - 用户名: $Username" -ForegroundColor White
    Write-Host "     - 密码: $Password" -ForegroundColor White
    Write-Host "  3. 上传目录: $tempDir -> $RemotePath" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "文件已准备好，是否继续执行服务器部署命令? (y/n)"
    if ($continue -ne "y") {
        Write-Host "部署已取消。文件已准备好，请手动上传后运行部署命令。" -ForegroundColor Yellow
        Write-Host "临时文件位置: $tempDir" -ForegroundColor Gray
        exit 0
    }
} else {
    Write-Host ""
    Write-Host "✓ 文件上传成功！" -ForegroundColor Green
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "执行服务器部署命令..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 创建部署命令（使用单引号避免PowerShell解析bash语法）
$deployCmd1 = "cd $RemotePath"
$deployCmd2 = "chmod +x deploy-complete.sh 2>/dev/null " + [char]124 + [char]124 + " true"
$deployCmd3 = "if [ -f deploy-complete.sh ]; then"
$deployCmd4 = "    ./deploy-complete.sh"
$deployCmd5 = "else"
$deployCmd6 = "    echo 'Deploy script not found, running standard deploy...'"
$deployCmd7 = "    npm install"
$deployCmd8 = "    npm run build"
$deployCmd9 = "    pm2 restart maclock " + [char]124 + [char]124 + " pm2 start npm --name maclock -- start"
$deployCmd10 = "fi"
$deployCommands = $deployCmd1 + "`n" + $deployCmd2 + "`n" + $deployCmd3 + "`n" + $deployCmd4 + "`n" + $deployCmd5 + "`n" + $deployCmd6 + "`n" + $deployCmd7 + "`n" + $deployCmd8 + "`n" + $deployCmd9 + "`n" + $deployCmd10

Write-Host "连接到服务器并执行部署..." -ForegroundColor Yellow
Write-Host "提示: 如果要求输入密码，请输入: $Password" -ForegroundColor Yellow
Write-Host ""

# 执行SSH命令
$sshCommand = "ssh -o StrictHostKeyChecking=no ${Username}@${ServerIP} `"$deployCommands`""

Write-Host "执行命令: $sshCommand" -ForegroundColor Gray
Write-Host ""

try {
    Invoke-Expression $sshCommand
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ 部署完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ 部署过程中出现错误" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "错误信息: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "您可以手动执行以下命令:" -ForegroundColor Yellow
    Write-Host "  ssh ${Username}@${ServerIP}" -ForegroundColor Gray
    Write-Host "  cd $RemotePath" -ForegroundColor Gray
    Write-Host "  ./deploy-complete.sh" -ForegroundColor Gray
}

Write-Host ""
Write-Host "清理临时文件..." -ForegroundColor Yellow
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
    Write-Host "✓ 临时文件已清理" -ForegroundColor Green
}

Write-Host ""
Write-Host "部署流程完成！" -ForegroundColor Green
Write-Host ""

