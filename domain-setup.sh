#!/bin/bash
set -e

DOMAIN="hello1984.net"
CONFIG_FILE="/etc/nginx/sites-available/maclock"
CONFIG_LINK="/etc/nginx/sites-enabled/maclock"

echo "=========================================="
echo "配置域名: $DOMAIN"
echo "=========================================="
echo ""

# Create directories if they don't exist
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

if [ -f "$CONFIG_FILE" ]; then
    echo "📦 备份现有配置..."
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

echo "📝 创建Nginx配置文件..."
cat > "$CONFIG_FILE" <<'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name hello1984.net www.hello1984.net;

    access_log /var/log/nginx/maclock-access.log;
    error_log /var/log/nginx/maclock-error.log;

    client_max_body_size 10M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

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

echo "✅ 配置文件已创建: $CONFIG_FILE"

if [ ! -L "$CONFIG_LINK" ]; then
    echo "🔗 创建符号链接..."
    ln -s "$CONFIG_FILE" "$CONFIG_LINK"
    echo "✅ 符号链接已创建"
else
    echo "ℹ️  符号链接已存在"
fi

echo ""
echo "🧪 测试Nginx配置..."
if nginx -t; then
    echo "✅ Nginx配置测试通过"
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi

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
echo "域名: $DOMAIN"
echo "端口: 80"
echo "访问: http://$DOMAIN"
echo ""

