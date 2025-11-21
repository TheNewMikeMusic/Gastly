#!/bin/bash
# 部署移动设备图片加载修复

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}开始部署移动设备图片加载修复...${NC}"
echo ""

cd /var/www/maclock

# 检查文件是否存在
if [ ! -f "components/ProductSpinVideo.tsx" ]; then
    echo -e "${RED}错误: ProductSpinVideo.tsx 文件不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 文件检查通过${NC}"
echo ""

# 检查图片文件是否存在
echo -e "${YELLOW}检查图片文件...${NC}"
if [ -f "public/product-spin-000.webp" ]; then
    echo -e "${GREEN}✓ 图片文件存在${NC}"
    ls -lh public/product-spin-000.webp public/product-spin-059.webp 2>/dev/null | head -2
else
    echo -e "${RED}✗ 图片文件不存在！${NC}"
    echo -e "${YELLOW}检查public目录...${NC}"
    ls -la public/ | grep product-spin | head -5
fi
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
    exit 1
fi

echo -e "${GREEN}✓ 构建成功${NC}"
echo ""

# 重启服务
echo -e "${YELLOW}重启服务...${NC}"
pm2 restart maclock

if [ $? -ne 0 ]; then
    echo -e "${RED}重启失败！${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 服务已重启${NC}"
echo ""

# 等待服务启动
sleep 5

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
pm2 status maclock
echo ""

# 测试图片访问
echo -e "${YELLOW}测试图片访问...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/product-spin-000.webp | grep -q "200"; then
    echo -e "${GREEN}✓ 图片可以正常访问 (HTTP 200)${NC}"
else
    echo -e "${RED}✗ 图片访问失败${NC}"
    echo -e "${YELLOW}尝试访问图片...${NC}"
    curl -I http://localhost:3000/product-spin-000.webp 2>&1 | head -5
fi
echo ""

echo -e "${GREEN}========================================"
echo -e "移动设备图片加载修复部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}修复说明:${NC}"
echo -e "  - 使用绝对路径确保移动设备能正确加载"
echo -e "  - 添加详细的错误日志和重试机制"
echo -e "  - 优化预加载策略，减少初始加载"
echo ""


