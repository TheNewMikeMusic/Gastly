#!/bin/bash
# 最终部署 - 图片已上传，重新构建并重启

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "最终部署 - 图片已上传"
echo -e "========================================${NC}"
echo ""

cd /var/www/maclock

# 验证图片文件
echo -e "${YELLOW}验证图片文件...${NC}"
IMAGE_COUNT=$(ls public/product-spin-*.webp 2>/dev/null | wc -l)
if [ "$IMAGE_COUNT" -eq 60 ]; then
    echo -e "${GREEN}✓ 找到 $IMAGE_COUNT 张图片文件${NC}"
else
    echo -e "${YELLOW}⚠ 找到 $IMAGE_COUNT 张图片文件（期望60张）${NC}"
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
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/product-spin-000.webp)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ 图片可以正常访问 (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ 图片访问失败 (HTTP $HTTP_CODE)${NC}"
fi

# 测试几张关键图片
for i in 0 30 59; do
    padded=$(printf "%03d" $i)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/product-spin-${padded}.webp)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ product-spin-${padded}.webp 可访问${NC}"
    else
        echo -e "${RED}✗ product-spin-${padded}.webp 访问失败 (HTTP $HTTP_CODE)${NC}"
    fi
done
echo ""

echo -e "${GREEN}========================================"
echo -e "部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}现在可以测试:${NC}"
echo -e "  - iOS设备: http://38.175.195.104:3000"
echo -e "  - Android设备: http://38.175.195.104:3000"
echo -e "  - PC: http://38.175.195.104:3000"
echo ""





