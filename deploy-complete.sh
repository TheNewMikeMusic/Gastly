#!/bin/bash
# 完整部署脚本 - 确保服务器端代码和本地一致

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "开始完整部署"
echo -e "========================================${NC}"
echo ""

cd /var/www/maclock

# 检查文件是否存在
if [ ! -f "components/ProductSpinVideo.tsx" ]; then
    echo -e "${RED}错误: ProductSpinVideo.tsx 文件不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 文件检查通过${NC}"
echo ""

# 显示文件信息
echo -e "${YELLOW}文件信息:${NC}"
ls -lh components/ProductSpinVideo.tsx
echo ""

# 清理旧的构建
echo -e "${YELLOW}清理旧的构建文件...${NC}"
rm -rf .next
echo -e "${GREEN}✓ 清理完成${NC}"
echo ""

# 重新构建
echo -e "${YELLOW}正在重新构建项目...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}构建失败！${NC}"
    echo -e "${YELLOW}查看构建日志...${NC}"
    npm run build 2>&1 | tail -50
    exit 1
fi

echo -e "${GREEN}✓ 构建成功${NC}"
echo ""

# 停止服务
echo -e "${YELLOW}停止服务...${NC}"
pm2 stop maclock 2>/dev/null || true
sleep 2

# 重启服务
echo -e "${YELLOW}启动服务...${NC}"
pm2 restart maclock || pm2 start npm --name maclock -- start

if [ $? -ne 0 ]; then
    echo -e "${RED}服务启动失败！${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 服务已重启${NC}"
echo ""

# 等待服务启动
echo -e "${YELLOW}等待服务启动...${NC}"
sleep 5

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
pm2 status maclock
echo ""

# 检查端口监听
echo -e "${YELLOW}检查端口监听...${NC}"
if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
    netstat -tulpn | grep 3000
elif ss -tulpn 2>/dev/null | grep -q ":3000"; then
    ss -tulpn | grep 3000
else
    echo -e "${YELLOW}无法检查端口状态${NC}"
fi
echo ""

# 测试本地访问
echo -e "${YELLOW}测试本地访问...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo -e "${GREEN}✓ 本地访问正常 (HTTP 200)${NC}"
else
    echo -e "${RED}✗ 本地访问失败${NC}"
    echo -e "${YELLOW}查看服务日志...${NC}"
    pm2 logs maclock --lines 20 --nostream
fi
echo ""

# 显示最近的日志
echo -e "${YELLOW}最近的日志:${NC}"
pm2 logs maclock --lines 10 --nostream
echo ""

echo -e "${GREEN}========================================"
echo -e "部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}优化说明:${NC}"
echo -e "  - 直接更新图片src，减少React状态更新延迟"
echo -e "  - 移动设备使用4ms节流（约250fps）"
echo -e "  - PC使用直接requestAnimationFrame"
echo -e "  - 添加图片加载错误重试机制"
echo -e "  - 优化预加载逻辑，避免重复加载"
echo ""
