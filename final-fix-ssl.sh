#!/bin/bash

CONFIG_FILE="/www/server/nginx/conf/vhost/hello1984.net.conf"

echo "检查当前配置..."
cat "$CONFIG_FILE" | head -25

echo ""
echo "检查端口..."
netstat -tlnp 2>/dev/null | grep -E ":(80|443)" || ss -tlnp 2>/dev/null | grep -E ":(80|443)"

echo ""
echo "检查Nginx错误日志..."
tail -50 /www/wwwlogs/error.log 2>/dev/null | tail -10

echo ""
echo "尝试修复 - 简化SSL配置..."

# 备份
cp "$CONFIG_FILE" "$CONFIG_FILE.backup.final"

# 重新创建配置，确保语法正确
cat > "$CONFIG_FILE" <<'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name hello1984.net www.hello1984.net;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name hello1984.net www.hello1984.net;
    http2 on;

    ssl_certificate /etc/letsencrypt/live/hello1984.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hello1984.net/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/hello1984.net/chain.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

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
EOF

echo "测试配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "重启Nginx..."
    /etc/init.d/nginx stop
    sleep 2
    /etc/init.d/nginx start
    sleep 3
    
    echo ""
    echo "检查端口..."
    netstat -tlnp 2>/dev/null | grep -E ":(80|443)" || ss -tlnp 2>/dev/null | grep -E ":(80|443)"
fi



