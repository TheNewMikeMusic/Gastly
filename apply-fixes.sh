#!/bin/bash
# 应用修复并重新部署

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}应用修复...${NC}"
echo ""

# 1. 停止服务
echo -e "${YELLOW}[1] 停止服务...${NC}"
pm2 stop maclock || true
echo ""

# 2. 重新构建（使用新的修复）
echo -e "${YELLOW}[2] 重新构建项目...${NC}"
export NODE_ENV=production
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}✗ 构建失败${NC}"
    exit 1
fi
echo ""

# 3. 重启服务
echo -e "${YELLOW}[3] 启动服务...${NC}"
pm2 start npm --name maclock -- start
pm2 save

sleep 3

# 4. 检查状态
echo -e "${YELLOW}[4] 检查服务状态...${NC}"
pm2 status
echo ""

# 5. 检查错误日志
echo -e "${YELLOW}[5] 检查错误日志...${NC}"
pm2 logs maclock --err --lines 10
echo ""

echo -e "${GREEN}========================================"
echo -e "修复已应用！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}修复内容:${NC}"
echo "  1. ✓ 库存 API 错误处理优化"
echo "  2. ✓ 视频组件移动端兼容性优化"
echo "  3. ✓ iOS 浏览器支持（webkit-playsinline）"
echo "  4. ✓ Android 性能优化（节流）"
echo ""
echo -e "${YELLOW}请清除浏览器缓存后测试:${NC}"
echo "  - iOS Safari: 应该可以显示视频"
echo "  - Android Edge: 应该更流畅"
echo ""


