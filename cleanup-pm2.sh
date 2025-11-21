#!/bin/bash
# 清理 PM2 停止的进程

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}清理 PM2 停止的进程...${NC}"
echo ""

# 删除所有停止的进程
pm2 delete all

# 重新启动服务
cd /var/www/maclock
pm2 start npm --name maclock -- start
pm2 save

echo ""
echo -e "${GREEN}✓ PM2 已清理并重启${NC}"
echo ""
pm2 status
echo ""


