#!/bin/bash
# 为宝塔面板配置HTTPS

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

IP_ADDRESS="38.175.195.104"
SSL_DIR="/www/server/nginx/conf/ssl"
SITE_CONFIG_DIR="/www/server/panel/vhost/nginx"
SITE_CONFIG_FILE="$SITE_CONFIG_DIR/${IP_ADDRESS}.conf"

echo -e "${YELLOW}========================================"
echo -e "宝塔面板HTTPS配置"
echo -e "========================================${NC}"
echo ""

# 1. Check if BT Panel exists
if [ ! -d "/www/server/nginx" ]; then
    echo -e "${RED}✗ 未检测到宝塔面板Nginx${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 检测到宝塔面板${NC}"
echo ""

# 2. Create SSL directory
echo -e "${YELLOW}1. 创建SSL证书目录...${NC}"
mkdir -p $SSL_DIR
chmod 700 $SSL_DIR
echo -e "${GREEN}✓ SSL目录已创建${NC}"
echo ""

# 3. Generate SSL certificate
echo -e "${YELLOW}2. 生成SSL证书...${NC}"
if [ ! -f "$SSL_DIR/maclock.crt" ] || [ ! -f "$SSL_DIR/maclock.key" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $SSL_DIR/maclock.key \
        -out $SSL_DIR/maclock.crt \
        -subj "/C=US/ST=State/L=City/O=Hello1984/CN=$IP_ADDRESS" \
        -addext "subjectAltName=IP:$IP_ADDRESS"
    
    chmod 600 $SSL_DIR/maclock.key
    chmod 644 $SSL_DIR/maclock.crt
    echo -e "${GREEN}✓ SSL证书已生成${NC}"
else
    echo -e "${GREEN}✓ SSL证书已存在${NC}"
fi
echo ""

# 4. Create Nginx site configuration
echo -e "${YELLOW}3. 创建站点配置...${NC}"
mkdir -p $SITE_CONFIG_DIR

cat > $SITE_CONFIG_FILE << 'EOF'
# Maclock HTTPS Configuration for BT Panel

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name 38.175.195.104;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name 38.175.195.104;

    # SSL certificate paths
    ssl_certificate /www/server/nginx/conf/ssl/maclock.crt;
    ssl_certificate_key /www/server/nginx/conf/ssl/maclock.key;

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
    access_log /www/wwwlogs/maclock-access.log;
    error_log /www/wwwlogs/maclock-error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Proxy settings
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Increase timeouts for Next.js
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Main location - proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|avif|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

chmod 644 $SITE_CONFIG_FILE
echo -e "${GREEN}✓ 站点配置已创建: $SITE_CONFIG_FILE${NC}"
echo ""

# 5. Check if config is included in main nginx.conf
echo -e "${YELLOW}4. 检查主配置文件...${NC}"
NGINX_CONF="/www/server/nginx/conf/nginx.conf"
if grep -q "vhost/nginx" $NGINX_CONF; then
    echo -e "${GREEN}✓ 主配置已包含vhost目录${NC}"
else
    echo -e "${YELLOW}⚠ 主配置可能未包含vhost目录，需要手动检查${NC}"
fi
echo ""

# 6. Test Nginx configuration
echo -e "${YELLOW}5. 测试Nginx配置...${NC}"
if /www/server/nginx/sbin/nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx配置有效${NC}"
    /www/server/nginx/sbin/nginx -t
else
    echo -e "${RED}✗ Nginx配置错误${NC}"
    /www/server/nginx/sbin/nginx -t
    exit 1
fi
echo ""

# 7. Reload Nginx
echo -e "${YELLOW}6. 重新加载Nginx...${NC}"
if command -v bt &> /dev/null; then
    # Use BT Panel command if available
    bt reload
else
    # Fallback to systemctl or direct nginx reload
    if systemctl is-active --quiet nginx; then
        systemctl reload nginx
    else
        /www/server/nginx/sbin/nginx -s reload
    fi
fi

sleep 2
echo -e "${GREEN}✓ Nginx已重新加载${NC}"
echo ""

# 8. Check ports
echo -e "${YELLOW}7. 检查端口监听...${NC}"
sleep 2
if netstat -tuln | grep -q ":443 "; then
    echo -e "${GREEN}✓ 端口443正在监听${NC}"
    netstat -tuln | grep ":443 "
else
    echo -e "${RED}✗ 端口443未监听${NC}"
    echo -e "${YELLOW}尝试重启Nginx...${NC}"
    if command -v bt &> /dev/null; then
        bt restart
    else
        systemctl restart nginx || /www/server/nginx/sbin/nginx
    fi
    sleep 3
    if netstat -tuln | grep -q ":443 "; then
        echo -e "${GREEN}✓ 端口443现在正在监听${NC}"
    else
        echo -e "${RED}✗ 端口443仍然未监听${NC}"
        echo -e "${YELLOW}请检查错误日志:${NC}"
        tail -20 /www/wwwlogs/maclock-error.log 2>/dev/null || echo "日志文件不存在"
    fi
fi

if netstat -tuln | grep -q ":80 "; then
    echo -e "${GREEN}✓ 端口80正在监听${NC}"
fi
echo ""

echo -e "${GREEN}========================================"
echo -e "宝塔面板HTTPS配置完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}配置位置:${NC}"
echo -e "  站点配置: $SITE_CONFIG_FILE"
echo -e "  SSL证书: $SSL_DIR/maclock.crt"
echo ""
echo -e "${YELLOW}访问地址:${NC}"
echo -e "  HTTPS: https://$IP_ADDRESS"
echo ""


