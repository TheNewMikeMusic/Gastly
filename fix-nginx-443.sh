#!/bin/bash
# 修复Nginx 443端口监听问题

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "修复Nginx 443端口监听问题"
echo -e "========================================${NC}"
echo ""

# 1. Check current config
echo -e "${YELLOW}1. 检查当前配置...${NC}"
cd /var/www/maclock

if [ ! -f "nginx-maclock.conf" ]; then
    echo -e "${RED}✗ nginx-maclock.conf 不存在${NC}"
    exit 1
fi

# 2. Backup existing config
echo -e "${YELLOW}2. 备份现有配置...${NC}"
if [ -f "/etc/nginx/sites-available/maclock" ]; then
    cp /etc/nginx/sites-available/maclock /etc/nginx/sites-available/maclock.backup.$(date +%Y%m%d_%H%M%S)
fi
echo -e "${GREEN}✓ 备份完成${NC}"
echo ""

# 3. Copy new config
echo -e "${YELLOW}3. 更新Nginx配置...${NC}"
cp nginx-maclock.conf /etc/nginx/sites-available/maclock
chmod 644 /etc/nginx/sites-available/maclock
echo -e "${GREEN}✓ 配置已更新${NC}"
echo ""

# 4. Ensure site is enabled
echo -e "${YELLOW}4. 启用站点配置...${NC}"
# Remove old symlink if exists
if [ -L "/etc/nginx/sites-enabled/maclock" ]; then
    rm /etc/nginx/sites-enabled/maclock
fi
# Remove default if exists
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
fi
# Create new symlink
ln -sf /etc/nginx/sites-available/maclock /etc/nginx/sites-enabled/maclock
echo -e "${GREEN}✓ 站点已启用${NC}"
echo ""

# 5. Verify SSL certificates
echo -e "${YELLOW}5. 验证SSL证书...${NC}"
if [ ! -f "/etc/nginx/ssl/maclock.crt" ] || [ ! -f "/etc/nginx/ssl/maclock.key" ]; then
    echo -e "${YELLOW}生成SSL证书...${NC}"
    mkdir -p /etc/nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/maclock.key \
        -out /etc/nginx/ssl/maclock.crt \
        -subj "/C=US/ST=State/L=City/O=Hello1984/CN=38.175.195.104" \
        -addext "subjectAltName=IP:38.175.195.104"
    chmod 600 /etc/nginx/ssl/maclock.key
    chmod 644 /etc/nginx/ssl/maclock.crt
    echo -e "${GREEN}✓ SSL证书已生成${NC}"
else
    echo -e "${GREEN}✓ SSL证书已存在${NC}"
fi
echo ""

# 6. Test configuration
echo -e "${YELLOW}6. 测试Nginx配置...${NC}"
if nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx配置有效${NC}"
    nginx -t
else
    echo -e "${RED}✗ Nginx配置错误${NC}"
    nginx -t
    exit 1
fi
echo ""

# 7. Show what will be loaded
echo -e "${YELLOW}7. 检查将加载的配置...${NC}"
echo "启用的站点:"
ls -la /etc/nginx/sites-enabled/
echo ""
echo "监听端口配置:"
grep "listen" /etc/nginx/sites-enabled/maclock || echo "未找到监听配置"
echo ""

# 8. Reload Nginx
echo -e "${YELLOW}8. 重新加载Nginx...${NC}"
systemctl reload nginx
sleep 2

if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx重新加载成功${NC}"
else
    echo -e "${RED}✗ Nginx重新加载失败${NC}"
    systemctl status nginx --no-pager -l | tail -20
    exit 1
fi
echo ""

# 9. Check ports
echo -e "${YELLOW}9. 检查端口监听...${NC}"
sleep 2
if netstat -tuln | grep -q ":443 "; then
    echo -e "${GREEN}✓ 端口443正在监听${NC}"
    netstat -tuln | grep ":443 "
else
    echo -e "${RED}✗ 端口443仍未监听${NC}"
    echo -e "${YELLOW}尝试重启Nginx...${NC}"
    systemctl restart nginx
    sleep 3
    if netstat -tuln | grep -q ":443 "; then
        echo -e "${GREEN}✓ 端口443现在正在监听${NC}"
    else
        echo -e "${RED}✗ 端口443仍然未监听${NC}"
        echo -e "${YELLOW}检查Nginx错误日志:${NC}"
        tail -20 /var/log/nginx/error.log 2>/dev/null || journalctl -u nginx -n 20 --no-pager
    fi
fi

if netstat -tuln | grep -q ":80 "; then
    echo -e "${GREEN}✓ 端口80正在监听${NC}"
fi
echo ""

# 10. Test connections
echo -e "${YELLOW}10. 测试连接...${NC}"
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 本地HTTPS连接成功${NC}"
else
    echo -e "${RED}✗ 本地HTTPS连接失败${NC}"
fi

echo ""
echo -e "${GREEN}========================================"
echo -e "修复完成！"
echo -e "========================================${NC}"
echo ""





