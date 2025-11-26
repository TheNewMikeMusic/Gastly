#!/bin/bash

# 域名配置脚本
# 用于将网站映射到80端口

set -e

echo "=========================================="
echo "Maclock 域名配置脚本"
echo "=========================================="
echo ""

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    exit 1
fi

# 获取域名
read -p "请输入您的域名 (例如: example.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ 域名不能为空"
    exit 1
fi

# 移除协议前缀（如果有）
DOMAIN=$(echo $DOMAIN | sed 's|https\?://||' | sed 's|/$||')

echo ""
echo "配置域名: $DOMAIN"
echo ""

# 创建Nginx配置文件
CONFIG_FILE="/etc/nginx/sites-available/maclock"
CONFIG_LINK="/etc/nginx/sites-enabled/maclock"

echo "📝 创建Nginx配置文件..."

# 创建配置文件内容
cat > "$CONFIG_FILE" <<EOF
# Nginx configuration for Maclock with Domain Name
# Generated on $(date)

# HTTP server on port 80
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

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

echo "✅ 配置文件已创建: $CONFIG_FILE"

# 创建符号链接
if [ ! -L "$CONFIG_LINK" ]; then
    echo "🔗 创建符号链接..."
    ln -s "$CONFIG_FILE" "$CONFIG_LINK"
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
echo "域名: $DOMAIN"
echo "端口: 80"
echo "后端: http://localhost:3000"
echo ""
echo "⚠️  重要提示："
echo "1. 请确保您的域名DNS已正确解析到此服务器IP"
echo "2. 请确保防火墙已开放80端口"
echo "3. 如果使用云服务器，请检查安全组规则"
echo ""
echo "测试命令："
echo "  curl -I http://$DOMAIN"
echo ""



