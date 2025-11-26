#!/bin/bash
set -e

DOMAIN="hello1984.net"
EMAIL="admin@hello1984.net"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
CONFIG_FILE="/etc/nginx/sites-available/maclock"

echo "=========================================="
echo "配置SSL证书: $DOMAIN"
echo "=========================================="
echo ""

# 检查certbot
if ! command -v certbot &> /dev/null; then
    echo "❌ certbot未安装，请先安装certbot"
    exit 1
fi

echo "✅ certbot已安装: $(certbot --version)"
echo ""

# 停止nginx以便certbot使用80端口
echo "🛑 临时停止Nginx以获取证书..."
systemctl stop nginx

# 获取SSL证书
echo "🔐 获取SSL证书..."
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

if [ $? -ne 0 ]; then
    echo "❌ SSL证书获取失败"
    systemctl start nginx
    exit 1
fi

echo "✅ SSL证书获取成功！"
echo ""

# 启动nginx
echo "🔄 启动Nginx..."
systemctl start nginx

# 更新Nginx配置以支持HTTPS
echo "📝 更新Nginx配置以支持HTTPS..."

# 备份现有配置
if [ -f "$CONFIG_FILE" ]; then
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
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

# 确保符号链接存在
CONFIG_LINK="/etc/nginx/sites-enabled/maclock"
if [ ! -L "$CONFIG_LINK" ]; then
    ln -s "$CONFIG_FILE" "$CONFIG_LINK"
fi

# 测试Nginx配置
echo "🧪 测试Nginx配置..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx配置测试通过"
    echo ""
    echo "🔄 重启Nginx服务..."
    systemctl restart nginx
    
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx已成功重启"
    else
        echo "❌ Nginx重启失败"
        exit 1
    fi
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ SSL证书配置完成！"
echo "=========================================="
echo ""
echo "域名: $DOMAIN"
echo "HTTPS: https://$DOMAIN"
echo ""
echo "证书位置:"
echo "  证书: $CERT_PATH/fullchain.pem"
echo "  私钥: $CERT_PATH/privkey.pem"
echo ""
echo "证书自动续期:"
echo "  certbot会自动续期证书（每90天）"
echo "  测试续期: certbot renew --dry-run"
echo ""



