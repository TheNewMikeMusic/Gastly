#!/bin/bash
# 部署UI修复

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "部署UI修复"
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
echo -e "UI修复部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}修复内容:${NC}"
echo -e "  ✓ Hero标题：Hello1984 · 2025 Edition颜色加深，从#f6f8ff改为#1d1d1f"
echo -e "  ✓ Hero标题：添加font-weight: 600增强可读性"
echo -e "  ✓ Checkout页面：添加w-full确保手机端居中"
echo -e "  ✓ Checkout页面：优化手机端间距（gap-6 sm:gap-8）"
echo -e "  ✓ SellerReviews：添加w-full确保手机端正常显示"
echo -e "  ✓ SellerReviews：优化grid布局宽度"
echo ""


