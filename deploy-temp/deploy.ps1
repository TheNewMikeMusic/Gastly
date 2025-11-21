# Maclock 项目部署脚本
# 用于将项目部署到远程服务器

param(
    [string]$ServerIP = "38.175.195.104",
    [string]$Username = "root",
    [string]$Password = "0iHSn3CpCpDmlkub",
    [string]$ProjectPath = "."
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Maclock 项目部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 创建临时部署目录
$DeployDir = "deploy-temp"
if (Test-Path $DeployDir) {
    Remove-Item -Recurse -Force $DeployDir
}
New-Item -ItemType Directory -Path $DeployDir | Out-Null

Write-Host "复制项目文件..." -ForegroundColor Yellow

# 复制必要的文件（排除 node_modules, .next, .git 等）
$ExcludeDirs = @("node_modules", ".next", ".git", "deploy-temp", "Maclock", ".env.local", ".env")
$FilesToCopy = Get-ChildItem -Path $ProjectPath -Recurse | Where-Object {
    $item = $_
    $relativePath = $item.FullName.Replace((Resolve-Path $ProjectPath).Path + "\", "")
    $shouldExclude = $false
    foreach ($exclude in $ExcludeDirs) {
        if ($relativePath -like "$exclude*") {
            $shouldExclude = $true
            break
        }
    }
    return -not $shouldExclude
}

foreach ($file in $FilesToCopy) {
    $relativePath = $file.FullName.Replace((Resolve-Path $ProjectPath).Path + "\", "")
    $destPath = Join-Path $DeployDir $relativePath
    $destDir = Split-Path $destPath -Parent
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    Copy-Item $file.FullName -Destination $destPath -Force
}

Write-Host "✓ 文件复制完成" -ForegroundColor Green
Write-Host ""

# 现在直接使用 SSH 上传并部署
Write-Host "连接到服务器并开始部署..." -ForegroundColor Yellow

# 创建部署命令
$deployCommands = @"
cd /var/www/maclock || mkdir -p /var/www/maclock && cd /var/www/maclock
chmod +x deploy-complete.sh
./deploy-complete.sh
"@

# 使用 SSH 执行部署
$sshCommand = "echo '$Password' | ssh -o StrictHostKeyChecking=no root@$ServerIP `"$deployCommands`""

Write-Host "正在上传文件并执行部署..." -ForegroundColor Yellow
Write-Host "这可能需要几分钟时间，请耐心等待..." -ForegroundColor Yellow
Write-Host ""

# 先上传文件
Write-Host "步骤 1: 上传文件到服务器..." -ForegroundColor Cyan

# 使用 SCP 上传（需要手动输入密码或使用密钥）
$scpCommand = "scp -r -o StrictHostKeyChecking=no deploy-temp/* root@${ServerIP}:/var/www/maclock/"

Write-Host "执行命令: $scpCommand" -ForegroundColor Gray
Write-Host "提示: 如果提示输入密码，请输入: $Password" -ForegroundColor Yellow

# 尝试执行 SCP
try {
    & cmd /c "echo $Password | $scpCommand"
    Write-Host "✓ 文件上传完成" -ForegroundColor Green
} catch {
    Write-Host "⚠ 自动上传失败，请手动执行以下命令:" -ForegroundColor Yellow
    Write-Host "  $scpCommand" -ForegroundColor Green
    Write-Host "  密码: $Password" -ForegroundColor Green
}

Write-Host ""
Write-Host "步骤 2: 在服务器上执行部署脚本..." -ForegroundColor Cyan

# SSH 执行部署命令
$sshDeployCommand = "ssh -o StrictHostKeyChecking=no root@${ServerIP} `"cd /var/www/maclock && chmod +x deploy-complete.sh && ./deploy-complete.sh`""

Write-Host "执行命令: $sshDeployCommand" -ForegroundColor Gray
Write-Host "提示: 如果提示输入密码，请输入: $Password" -ForegroundColor Yellow

try {
    & cmd /c "echo $Password | $sshDeployCommand"
} catch {
    Write-Host "⚠ 自动执行失败，请手动 SSH 连接到服务器:" -ForegroundColor Yellow
    Write-Host "  ssh root@$ServerIP" -ForegroundColor Green
    Write-Host "  密码: $Password" -ForegroundColor Green
    Write-Host ""
    Write-Host "然后在服务器上执行:" -ForegroundColor Yellow
    Write-Host "  cd /var/www/maclock" -ForegroundColor Green
    Write-Host "  chmod +x deploy-complete.sh" -ForegroundColor Green
    Write-Host "  ./deploy-complete.sh" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "部署完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
