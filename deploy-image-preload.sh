#!/bin/bash
# 部署图片预加载优化

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "部署图片预加载优化"
echo -e "========================================${NC}"
echo ""

cd /var/www/maclock

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

echo -e "${GREEN}========================================"
echo -e "图片预加载优化部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}优化内容:${NC}"
echo -e "  ✓ Hero组件：添加useEffect预加载图片"
echo -e "  ✓ OptimizedImage：priority图片使用sync decoding"
echo -e "  ✓ OptimizedImage：优化路径处理，避免重复添加扩展名"
echo -e "  ✓ Layout：添加preload link标签"
echo ""


