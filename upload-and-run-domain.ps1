# 上传并执行域名配置脚本
$ServerIP = "38.175.195.104"
$Username = "root"
$Password = "0iHSn3CpCpDmlkub"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "配置域名: hello1984.net" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📤 上传脚本到服务器..." -ForegroundColor Yellow
Write-Host "提示: 请在提示时输入密码: $Password" -ForegroundColor Yellow
Write-Host ""

scp -o StrictHostKeyChecking=no domain-setup.sh "${Username}@${ServerIP}:/tmp/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 脚本上传成功" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 执行配置脚本..." -ForegroundColor Yellow
    Write-Host "提示: 请在提示时输入密码: $Password" -ForegroundColor Yellow
    Write-Host ""
    
    ssh -o StrictHostKeyChecking=no "${Username}@${ServerIP}" "chmod +x /tmp/domain-setup.sh && bash /tmp/domain-setup.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "✅ 域名配置完成！" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "域名: hello1984.net" -ForegroundColor Cyan
        Write-Host "访问地址: http://hello1984.net" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⚠️  重要提示：" -ForegroundColor Yellow
        Write-Host "1. 请确保DNS已正确解析到此服务器IP ($ServerIP)" -ForegroundColor Gray
        Write-Host "2. 请确保防火墙已开放80端口" -ForegroundColor Gray
        Write-Host "3. 如果使用云服务器，请检查安全组规则" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ 配置执行失败" -ForegroundColor Red
    }
} else {
    Write-Host "❌ 脚本上传失败" -ForegroundColor Red
}



