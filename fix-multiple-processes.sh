#!/bin/bash
# 修复多个进程问题

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}清理重复的 PM2 进程...${NC}"
echo ""

# 停止所有 maclock 进程
pm2 stop all
pm2 delete all

echo -e "${GREEN}✓ 所有进程已清理${NC}"
echo ""

# 检查端口占用
echo -e "${YELLOW}检查端口 3000 占用...${NC}"
if lsof -ti:3000 > /dev/null 2>&1 || netstat -tulpn | grep -q ":3000"; then
    echo -e "${YELLOW}发现端口 3000 被占用，正在清理...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 1
fi
echo ""

# 重新启动服务
cd /var/www/maclock
echo -e "${YELLOW}启动服务...${NC}"
pm2 start npm --name maclock -- start
pm2 save

sleep 3

# 检查状态
echo -e "${GREEN}服务状态:${NC}"
pm2 status
echo ""

# 检查端口监听
echo -e "${YELLOW}检查端口监听...${NC}"
netstat -tulpn | grep 3000 || ss -tulpn | grep 3000
echo ""

# 测试本地访问
echo -e "${YELLOW}测试本地访问...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ 本地访问正常${NC}"
else
    echo -e "${RED}✗ 本地访问失败${NC}"
fi
echo ""

echo -e "${GREEN}========================================"
echo -e "修复完成！"
echo -e "========================================${NC}"
echo ""


