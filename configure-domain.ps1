# 域名配置脚本 - 直接执行版本
param(
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

$ServerIP = "38.175.195.104"
$Username = "root"
$Password = "0iHSn3CpCpDmlkub"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Maclock 域名配置" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 移除协议前缀
$Domain = $Domain -replace '^https?://', '' -replace '/$', ''

Write-Host "配置信息:" -ForegroundColor Yellow
Write-Host "  服务器: $ServerIP" -ForegroundColor Gray
Write-Host "  域名: $Domain" -ForegroundColor Gray
Write-Host "  端口: 80" -ForegroundColor Gray
Write-Host ""

# 创建远程执行命令（使用单引号避免变量替换问题）
$RemoteCommand = "bash -c 'DOMAIN=`"$Domain`"; CONFIG_FILE=`"/etc/nginx/sites-available/maclock`"; CONFIG_LINK=`"/etc/nginx/sites-enabled/maclock`"; if [ -f `"`$CONFIG_FILE`" ]; then cp `"`$CONFIG_FILE`" `"`$CONFIG_FILE.backup.`$(date +%Y%m%d_%H%M%S)`"; fi; cat > `"`$CONFIG_FILE`" <<EOFNGINX
server {
    listen 80;
    listen [::]:80;
    server_name `$DOMAIN www.`$DOMAIN;
    access_log /var/log/nginx/maclock-access.log;
    error_log /var/log/nginx/maclock-error.log;
    client_max_body_size 10M;
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    proxy_http_version 1.1;
    proxy_set_header Upgrade `\$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host `\$host;
    proxy_set_header X-Real-IP `\$remote_addr;
    proxy_set_header X-Forwarded-For `\$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto `\$scheme;
    proxy_cache_bypass `\$http_upgrade;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    location / {
        proxy_pass http://localhost:3000;
        proxy_redirect off;
    }
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|avif|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
EOFNGINX
if [ ! -L `"`$CONFIG_LINK`" ]; then ln -s `"`$CONFIG_FILE`" `"`$CONFIG_LINK`"; fi; nginx -t && systemctl restart nginx && echo \"✅ 配置完成！域名: `$DOMAIN\"'"

Write-Host "🚀 正在连接服务器并执行配置..." -ForegroundColor Yellow
Write-Host ""

# 检查是否有sshpass
$sshpassAvailable = $false
try {
    $null = Get-Command sshpass -ErrorAction Stop
    $sshpassAvailable = $true
} catch {
    $sshpassAvailable = $false
}

if ($sshpassAvailable) {
    Write-Host "使用sshpass执行..." -ForegroundColor Gray
    $env:SSHPASS = $Password
    sshpass -e ssh -o StrictHostKeyChecking=no "${Username}@${ServerIP}" $RemoteCommand
} else {
    Write-Host "⚠️  未找到sshpass，将使用交互式SSH" -ForegroundColor Yellow
    Write-Host "提示: 请在提示时输入密码: $Password" -ForegroundColor Yellow
    Write-Host ""
    
    # 使用expect-like的方式，或者直接ssh
    # 由于Windows PowerShell不支持expect，我们使用另一种方法
    # 创建一个临时脚本文件，然后通过ssh执行
    
    $TempScript = "temp-domain-setup.sh"
    $ScriptContent = @"
#!/bin/bash
set -e

DOMAIN="$Domain"
CONFIG_FILE="/etc/nginx/sites-available/maclock"
CONFIG_LINK="/etc/nginx/sites-enabled/maclock"

echo "=========================================="
echo "配置域名: `$DOMAIN"
echo "=========================================="
echo ""

# 备份现有配置
if [ -f "`$CONFIG_FILE" ]; then
    echo "📦 备份现有配置..."
    cp "`$CONFIG_FILE" "`$CONFIG_FILE.backup.`$(date +%Y%m%d_%H%M%S)"
fi

# 创建配置文件
echo "📝 创建Nginx配置文件..."
cat > "`$CONFIG_FILE" <<'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name `$DOMAIN www.`$DOMAIN;

    access_log /var/log/nginx/maclock-access.log;
    error_log /var/log/nginx/maclock-error.log;

    client_max_body_size 10M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    proxy_http_version 1.1;
    proxy_set_header Upgrade `\$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host `\$host;
    proxy_set_header X-Real-IP `\$remote_addr;
    proxy_set_header X-Forwarded-For `\$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto `\$scheme;
    proxy_cache_bypass `\$http_upgrade;

    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_redirect off;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|avif|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF

echo "✅ 配置文件已创建: `$CONFIG_FILE"

# 创建符号链接
if [ ! -L "`$CONFIG_LINK" ]; then
    echo "🔗 创建符号链接..."
    ln -s "`$CONFIG_FILE" "`$CONFIG_LINK"
    echo "✅ 符号链接已创建"
else
    echo "ℹ️  符号链接已存在"
fi

# 测试Nginx配置
echo ""
echo "🧪 测试Nginx配置..."
if nginx -t; then
    echo "✅ Nginx配置测试通过"
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi

# 重启Nginx
echo ""
echo "🔄 重启Nginx服务..."
systemctl restart nginx

if systemctl is-active --quiet nginx; then
    echo "✅ Nginx已成功重启"
else
    echo "❌ Nginx重启失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 域名配置完成！"
echo "=========================================="
echo ""
echo "域名: `$DOMAIN"
echo "端口: 80"
echo "访问: http://`$DOMAIN"
echo ""
"@
    
    $ScriptContent | Out-File -FilePath $TempScript -Encoding UTF8 -NoNewline
    
    Write-Host "📤 上传脚本到服务器..." -ForegroundColor Yellow
    Write-Host "提示: 请在提示时输入密码: $Password" -ForegroundColor Yellow
    Write-Host ""
    
    # 上传脚本
    scp -o StrictHostKeyChecking=no $TempScript "${Username}@${ServerIP}:/tmp/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 脚本上传成功" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 执行配置脚本..." -ForegroundColor Yellow
        Write-Host "提示: 请在提示时输入密码: $Password" -ForegroundColor Yellow
        Write-Host ""
        
        # 执行脚本
        ssh -o StrictHostKeyChecking=no "${Username}@${ServerIP}" "chmod +x /tmp/$TempScript && bash /tmp/$TempScript"
        
        # 清理临时文件
        Remove-Item $TempScript -ErrorAction SilentlyContinue
    } else {
        Write-Host "❌ 脚本上传失败" -ForegroundColor Red
        Write-Host "请手动执行以下命令:" -ForegroundColor Yellow
        Write-Host "scp $TempScript ${Username}@${ServerIP}:/tmp/" -ForegroundColor Gray
        Write-Host "ssh ${Username}@${ServerIP} 'chmod +x /tmp/$TempScript && bash /tmp/$TempScript'" -ForegroundColor Gray
    }
}

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
    Write-Host "❌ 配置失败" -ForegroundColor Red
    Write-Host "请检查错误信息" -ForegroundColor Yellow
}



