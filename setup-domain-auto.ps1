# 自动配置域名 hello1984.net - 使用sshpass
$ServerIP = "38.175.195.104"
$Username = "root"
$Password = "0iHSn3CpCpDmlkub"
$Domain = "hello1984.net"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "配置域名: $Domain" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查sshpass是否可用
try {
    $null = Get-Command sshpass -ErrorAction Stop
    Write-Host "✅ 检测到sshpass" -ForegroundColor Green
} catch {
    Write-Host "❌ 未找到sshpass，请先安装" -ForegroundColor Red
    exit 1
}

Write-Host "📤 上传脚本到服务器..." -ForegroundColor Yellow

# 设置sshpass环境变量
$env:SSHPASS = $Password

# 上传脚本
sshpass -e scp -o StrictHostKeyChecking=no domain-setup.sh "${Username}@${ServerIP}:/tmp/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 脚本上传成功" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 执行配置脚本..." -ForegroundColor Yellow
    
    # 执行脚本（使用分号分隔命令）
    $remoteCmd = "chmod +x /tmp/domain-setup.sh; bash /tmp/domain-setup.sh"
    sshpass -e ssh -o StrictHostKeyChecking=no "${Username}@${ServerIP}" $remoteCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "✅ 域名配置完成！" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "域名: $Domain" -ForegroundColor Cyan
        Write-Host "访问地址: http://$Domain" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⚠️  重要提示：" -ForegroundColor Yellow
        Write-Host "1. 请确保DNS已正确解析到此服务器IP ($ServerIP)" -ForegroundColor Gray
        Write-Host "2. 请确保防火墙已开放80端口" -ForegroundColor Gray
        Write-Host "3. 如果使用云服务器，请检查安全组规则" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ 配置执行失败" -ForegroundColor Red
        Write-Host "请检查错误信息" -ForegroundColor Yellow
    }
} else {
    Write-Host "脚本上传失败" -ForegroundColor Red
    Write-Host "请检查网络连接和服务器状态" -ForegroundColor Yellow
}

# 清理环境变量
Remove-Item Env:\SSHPASS -ErrorAction SilentlyContinue
