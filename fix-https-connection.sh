#!/bin/bash
# 修复HTTPS连接问题

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

set -e

echo -e "${YELLOW}========================================"
echo -e "修复HTTPS连接问题"
echo -e "========================================${NC}"
echo ""

# 1. Ensure Nginx is installed
echo -e "${YELLOW}1. 确保Nginx已安装...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}安装Nginx...${NC}"
    apt-get update
    apt-get install -y nginx openssl
else
    echo -e "${GREEN}✓ Nginx已安装${NC}"
fi
echo ""

# 2. Generate SSL certificate if missing
echo -e "${YELLOW}2. 检查SSL证书...${NC}"
SSL_DIR="/etc/nginx/ssl"
mkdir -p $SSL_DIR
chmod 700 $SSL_DIR

if [ ! -f "$SSL_DIR/maclock.crt" ] || [ ! -f "$SSL_DIR/maclock.key" ]; then
    echo -e "${YELLOW}生成SSL证书...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $SSL_DIR/maclock.key \
        -out $SSL_DIR/maclock.crt \
        -subj "/C=US/ST=State/L=City/O=Hello1984/CN=38.175.195.104" \
        -addext "subjectAltName=IP:38.175.195.104"
    
    chmod 600 $SSL_DIR/maclock.key
    chmod 644 $SSL_DIR/maclock.crt
    echo -e "${GREEN}✓ SSL证书已生成${NC}"
else
    echo -e "${GREEN}✓ SSL证书已存在${NC}"
fi
echo ""

# 3. Configure Nginx
echo -e "${YELLOW}3. 配置Nginx...${NC}"
cd /var/www/maclock

if [ ! -f "nginx-maclock.conf" ]; then
    echo -e "${RED}✗ nginx-maclock.conf 不存在${NC}"
    exit 1
fi

# Backup existing config if exists
if [ -f "/etc/nginx/sites-available/maclock" ]; then
    cp /etc/nginx/sites-available/maclock /etc/nginx/sites-available/maclock.backup.$(date +%Y%m%d_%H%M%S)
fi

# Copy new config
cp nginx-maclock.conf /etc/nginx/sites-available/maclock

# Enable site
if [ -L "/etc/nginx/sites-enabled/maclock" ]; then
    rm /etc/nginx/sites-enabled/maclock
fi
ln -sf /etc/nginx/sites-available/maclock /etc/nginx/sites-enabled/maclock

# Remove default site if exists
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
fi

echo -e "${GREEN}✓ Nginx配置已更新${NC}"
echo ""

# 4. Test Nginx configuration
echo -e "${YELLOW}4. 测试Nginx配置...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Nginx配置有效${NC}"
else
    echo -e "${RED}✗ Nginx配置错误${NC}"
    nginx -t
    exit 1
fi
echo ""

# 5. Start/restart Nginx
echo -e "${YELLOW}5. 启动/重启Nginx...${NC}"
systemctl enable nginx
systemctl restart nginx
sleep 2

if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx运行正常${NC}"
else
    echo -e "${RED}✗ Nginx启动失败${NC}"
    systemctl status nginx --no-pager -l | tail -20
    exit 1
fi
echo ""

# 6. Configure firewall
echo -e "${YELLOW}6. 配置防火墙...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 443/tcp comment 'HTTPS'
    ufw allow 80/tcp comment 'HTTP'
    echo -e "${GREEN}✓ UFW防火墙已配置${NC}"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-service=http
    firewall-cmd --reload
    echo -e "${GREEN}✓ Firewalld防火墙已配置${NC}"
else
    echo -e "${YELLOW}未检测到防火墙，请手动开放80和443端口${NC}"
fi
echo ""

# 7. Check Next.js app
echo -e "${YELLOW}7. 检查Next.js应用...${NC}"
if ! pm2 list | grep -q "maclock.*online"; then
    echo -e "${YELLOW}Next.js应用未运行，尝试启动...${NC}"
    cd /var/www/maclock
    pm2 start npm --name "maclock" -- start || pm2 restart maclock
    sleep 3
fi

if pm2 list | grep -q "maclock.*online"; then
    echo -e "${GREEN}✓ Next.js应用运行正常${NC}"
else
    echo -e "${RED}✗ Next.js应用启动失败${NC}"
    pm2 logs maclock --lines 10 --nostream
fi
echo ""

# 8. Verify ports
echo -e "${YELLOW}8. 验证端口监听...${NC}"
if netstat -tuln | grep -q ":443 "; then
    echo -e "${GREEN}✓ 端口443正在监听${NC}"
else
    echo -e "${RED}✗ 端口443未监听${NC}"
fi

if netstat -tuln | grep -q ":80 "; then
    echo -e "${GREEN}✓ 端口80正在监听${NC}"
else
    echo -e "${RED}✗ 端口80未监听${NC}"
fi

if netstat -tuln | grep -q ":3000 "; then
    echo -e "${GREEN}✓ 端口3000正在监听（Next.js）${NC}"
else
    echo -e "${RED}✗ 端口3000未监听${NC}"
fi
echo ""

echo -e "${GREEN}========================================"
echo -e "修复完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}测试连接:${NC}"
echo -e "  curl -k https://38.175.195.104"
echo -e "  或访问: https://38.175.195.104"
echo ""


