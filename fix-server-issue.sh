#!/bin/bash
# 修复服务器 ERR_EMPTY_RESPONSE 问题

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "诊断和修复服务器问题"
echo -e "========================================${NC}"
echo ""

cd /var/www/maclock

# 1. 检查PM2状态
echo -e "${YELLOW}1. 检查PM2进程状态...${NC}"
pm2 status
echo ""

# 2. 检查端口占用
echo -e "${YELLOW}2. 检查端口3000占用情况...${NC}"
lsof -i :3000 || netstat -tulpn | grep :3000 || echo "端口3000未被占用"
echo ""

# 3. 检查构建文件
echo -e "${YELLOW}3. 检查构建文件...${NC}"
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ .next 目录存在${NC}"
    ls -la .next | head -5
else
    echo -e "${RED}✗ .next 目录不存在，需要重新构建${NC}"
fi
echo ""

# 4. 停止所有PM2进程
echo -e "${YELLOW}4. 停止所有PM2进程...${NC}"
pm2 stop all || true
pm2 delete all || true
echo -e "${GREEN}✓ 所有进程已停止${NC}"
echo ""

# 5. 清理旧的构建
echo -e "${YELLOW}5. 清理旧的构建文件...${NC}"
rm -rf .next
echo -e "${GREEN}✓ 清理完成${NC}"
echo ""

# 6. 重新构建
echo -e "${YELLOW}6. 重新构建项目...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}构建失败！请检查错误信息${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 构建成功${NC}"
echo ""

# 7. 启动PM2
echo -e "${YELLOW}7. 启动PM2进程...${NC}"
pm2 start npm --name "maclock" -- start

if [ $? -ne 0 ]; then
    echo -e "${RED}启动失败！${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PM2进程已启动${NC}"
echo ""

# 8. 保存PM2配置
pm2 save
echo ""

# 9. 等待服务启动
echo -e "${YELLOW}8. 等待服务启动（5秒）...${NC}"
sleep 5

# 10. 检查服务状态
echo -e "${YELLOW}9. 检查服务状态...${NC}"
pm2 status
echo ""

# 11. 检查日志
echo -e "${YELLOW}10. 最近的日志（最后20行）...${NC}"
pm2 logs maclock --lines 20 --nostream
echo ""

echo -e "${GREEN}========================================"
echo -e "修复完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}如果问题仍然存在，请检查：${NC}"
echo -e "  1. 环境变量是否正确配置 (.env.local)"
echo -e "  2. 端口3000是否被其他程序占用"
echo -e "  3. 防火墙设置是否允许端口3000"
echo -e "  4. 查看完整日志: pm2 logs maclock"
echo ""





