# 简化版域名配置脚本 - 使用密码认证
# 需要安装 sshpass 或手动输入密码

param(
    [Parameter(Mandatory=$false)]
    [string]$Domain
)

$ServerIP = "38.175.195.104"
$Username = "root"
$Password = "0iHSn3CpCpDmlkub"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Maclock 域名配置" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrWhiteSpace($Domain)) {
    $Domain = Read-Host "请输入您的域名 (例如: example.com)"
}

if ([string]::IsNullOrWhiteSpace($Domain)) {
    Write-Host "❌ 域名不能为空" -ForegroundColor Red
    exit 1
}

# 移除协议前缀
$Domain = $Domain -replace '^https?://', '' -replace '/$', ''

Write-Host ""
Write-Host "配置信息:" -ForegroundColor Yellow
Write-Host "  服务器: $ServerIP" -ForegroundColor Gray
Write-Host "  域名: $Domain" -ForegroundColor Gray
Write-Host ""

# 创建远程执行命令
$RemoteCommand = @"
DOMAIN='$Domain'
CONFIG_FILE='/etc/nginx/sites-available/maclock'
CONFIG_LINK='/etc/nginx/sites-enabled/maclock'

echo '=========================================='
echo '配置域名: '\$DOMAIN
echo '=========================================='
echo ''

# 备份现有配置
if [ -f "\$CONFIG_FILE" ]; then
    echo '📦 备份现有配置...'
    cp "\$CONFIG_FILE" "\$CONFIG_FILE.backup.\$(date +%Y%m%d_%H%M%S)"
fi

# 创建配置文件
echo '📝 创建Nginx配置文件...'
cat > "\$CONFIG_FILE" <<'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name \$DOMAIN www.\$DOMAIN;

    access_log /var/log/nginx/maclock-access.log;
    error_log /var/log/nginx/maclock-error.log;

    client_max_body_size 10M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;

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

echo '✅ 配置文件已创建'

# 创建符号链接
if [ ! -L "\$CONFIG_LINK" ]; then
    echo '🔗 创建符号链接...'
    ln -s "\$CONFIG_FILE" "\$CONFIG_LINK"
    echo '✅ 符号链接已创建'
fi

# 测试配置
echo ''
echo '🧪 测试Nginx配置...'
nginx -t

# 重启Nginx
echo ''
echo '🔄 重启Nginx服务...'
systemctl restart nginx

echo ''
echo '=========================================='
echo '✅ 域名配置完成！'
echo '=========================================='
echo ''
echo "域名: \$DOMAIN"
echo "访问: http://\$DOMAIN"
echo ''
"@

Write-Host "🚀 正在连接服务器并执行配置..." -ForegroundColor Yellow
Write-Host "提示: 如果提示输入密码，请输入: $Password" -ForegroundColor Gray
Write-Host ""

# 尝试使用sshpass
$sshpassCmd = Get-Command sshpass -ErrorAction SilentlyContinue

if ($sshpassCmd) {
    Write-Host "使用sshpass执行..." -ForegroundColor Gray
    $env:SSHPASS = $Password
    sshpass -e ssh -o StrictHostKeyChecking=no "${Username}@${ServerIP}" $RemoteCommand
} else {
    Write-Host "未找到sshpass，使用交互式SSH..." -ForegroundColor Yellow
    Write-Host "请在提示时输入密码: $Password" -ForegroundColor Yellow
    Write-Host ""
    ssh -o StrictHostKeyChecking=no "${Username}@${ServerIP}" $RemoteCommand
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ 配置完成！" -ForegroundColor Green
    Write-Host "域名: http://$Domain" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ 配置失败，请检查错误信息" -ForegroundColor Red
}



