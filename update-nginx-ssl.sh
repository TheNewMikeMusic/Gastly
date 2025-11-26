#!/bin/bash
set -e

DOMAIN="hello1984.net"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"

echo "=========================================="
echo "更新Nginx配置以支持HTTPS"
echo "=========================================="
echo ""

# 检查证书是否存在
if [ ! -f "$CERT_PATH/fullchain.pem" ]; then
    echo "❌ SSL证书不存在: $CERT_PATH/fullchain.pem"
    exit 1
fi

echo "✅ 找到SSL证书"
echo ""

# 查找Nginx配置文件位置
NGINX_CONF="/www/server/nginx/conf/nginx.conf"
VHOST_DIR="/www/server/nginx/conf/vhost"

# 检查是否是宝塔面板
if [ -f "$NGINX_CONF" ]; then
    echo "检测到宝塔面板Nginx配置"
    CONFIG_FILE="$VHOST_DIR/${DOMAIN}.conf"
else
    # 标准Nginx配置
    CONFIG_FILE="/etc/nginx/sites-available/maclock"
fi

echo "配置文件位置: $CONFIG_FILE"
echo ""

# 备份现有配置
if [ -f "$CONFIG_FILE" ]; then
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ 已备份现有配置"
fi

# 创建新的Nginx配置（包含HTTP和HTTPS）
cat > "$CONFIG_FILE" <<EOF
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL certificate paths
    ssl_certificate $CERT_PATH/fullchain.pem;
    ssl_certificate_key $CERT_PATH/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/maclock-access.log;
    error_log /var/log/nginx/maclock-error.log;

    # Client max body size
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Proxy settings
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;

    # Increase timeouts for Next.js
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Main location - proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_redirect off;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|avif|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "✅ Nginx配置已更新"
echo ""

# 测试Nginx配置
echo "🧪 测试Nginx配置..."
if /www/server/nginx/sbin/nginx -t 2>/dev/null; then
    echo "✅ Nginx配置测试通过（使用宝塔路径）"
    NGINX_CMD="/www/server/nginx/sbin/nginx"
elif nginx -t 2>/dev/null; then
    echo "✅ Nginx配置测试通过（使用标准路径）"
    NGINX_CMD="nginx"
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi

# 重启Nginx
echo ""
echo "🔄 重启Nginx服务..."

# 尝试不同的重启方式
if systemctl restart nginx 2>/dev/null; then
    echo "✅ Nginx已通过systemctl重启"
elif /etc/init.d/nginx restart 2>/dev/null; then
    echo "✅ Nginx已通过init.d重启"
elif $NGINX_CMD -s reload 2>/dev/null; then
    echo "✅ Nginx已重新加载配置"
else
    echo "⚠️  请手动重启Nginx"
fi

# 检查Nginx状态
sleep 2
if systemctl is-active --quiet nginx 2>/dev/null || pgrep nginx > /dev/null 2>&1; then
    echo "✅ Nginx运行正常"
else
    echo "⚠️  Nginx可能未运行，请检查"
fi

echo ""
echo "=========================================="
echo "✅ HTTPS配置完成！"
echo "=========================================="
echo ""
echo "域名: $DOMAIN"
echo "HTTPS: https://$DOMAIN"
echo ""
echo "证书位置:"
echo "  证书: $CERT_PATH/fullchain.pem"
echo "  私钥: $CERT_PATH/privkey.pem"
echo ""
echo "配置文件: $CONFIG_FILE"
echo ""



