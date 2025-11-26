#!/bin/bash
# 诊断HTTPS连接问题

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "HTTPS连接诊断"
echo -e "========================================${NC}"
echo ""

# 1. Check Nginx status
echo -e "${YELLOW}1. 检查Nginx状态...${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx正在运行${NC}"
    systemctl status nginx --no-pager -l | head -5
else
    echo -e "${RED}✗ Nginx未运行${NC}"
    echo -e "${YELLOW}尝试启动Nginx...${NC}"
    systemctl start nginx
    sleep 2
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx已启动${NC}"
    else
        echo -e "${RED}✗ Nginx启动失败${NC}"
        echo -e "${YELLOW}错误信息:${NC}"
        systemctl status nginx --no-pager -l | tail -10
    fi
fi
echo ""

# 2. Check Nginx configuration
echo -e "${YELLOW}2. 检查Nginx配置...${NC}"
if nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx配置有效${NC}"
else
    echo -e "${RED}✗ Nginx配置有错误${NC}"
    nginx -t
fi
echo ""

# 3. Check SSL certificates
echo -e "${YELLOW}3. 检查SSL证书...${NC}"
if [ -f "/etc/nginx/ssl/maclock.crt" ] && [ -f "/etc/nginx/ssl/maclock.key" ]; then
    echo -e "${GREEN}✓ SSL证书文件存在${NC}"
    ls -lh /etc/nginx/ssl/maclock.*
else
    echo -e "${RED}✗ SSL证书文件不存在${NC}"
    echo -e "${YELLOW}需要生成SSL证书${NC}"
fi
echo ""

# 4. Check port listening
echo -e "${YELLOW}4. 检查端口监听...${NC}"
if netstat -tuln | grep -q ":443 "; then
    echo -e "${GREEN}✓ 端口443正在监听${NC}"
    netstat -tuln | grep ":443 "
else
    echo -e "${RED}✗ 端口443未监听${NC}"
fi

if netstat -tuln | grep -q ":80 "; then
    echo -e "${GREEN}✓ 端口80正在监听${NC}"
    netstat -tuln | grep ":80 "
else
    echo -e "${RED}✗ 端口80未监听${NC}"
fi
echo ""

# 5. Check Next.js application
echo -e "${YELLOW}5. 检查Next.js应用状态...${NC}"
if pm2 list | grep -q "maclock.*online"; then
    echo -e "${GREEN}✓ Next.js应用正在运行${NC}"
    pm2 list | grep maclock
else
    echo -e "${RED}✗ Next.js应用未运行${NC}"
fi

if netstat -tuln | grep -q ":3000 "; then
    echo -e "${GREEN}✓ 端口3000正在监听${NC}"
else
    echo -e "${RED}✗ 端口3000未监听${NC}"
fi
echo ""

# 6. Check firewall
echo -e "${YELLOW}6. 检查防火墙...${NC}"
if command -v ufw &> /dev/null; then
    ufw status | grep -E "(443|80)" || echo -e "${YELLOW}UFW状态:${NC}" && ufw status
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --list-all | grep -E "(443|80)" || echo -e "${YELLOW}Firewalld状态:${NC}" && firewall-cmd --list-all
else
    echo -e "${YELLOW}未检测到防火墙管理工具${NC}"
fi
echo ""

# 7. Check Nginx error logs
echo -e "${YELLOW}7. 最近的Nginx错误日志（最后10行）...${NC}"
if [ -f "/var/log/nginx/error.log" ]; then
    tail -10 /var/log/nginx/error.log
else
    echo -e "${YELLOW}错误日志文件不存在${NC}"
fi
echo ""

# 8. Test local connection
echo -e "${YELLOW}8. 测试本地连接...${NC}"
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 本地HTTPS连接正常${NC}"
else
    echo -e "${RED}✗ 本地HTTPS连接失败${NC}"
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Next.js应用响应正常${NC}"
else
    echo -e "${RED}✗ Next.js应用无响应${NC}"
fi
echo ""

echo -e "${YELLOW}========================================"
echo -e "诊断完成"
echo -e "========================================${NC}"
echo ""





