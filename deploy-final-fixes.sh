#!/bin/bash
# 部署最终修复

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "部署最终修复"
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
echo -e "最终修复部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}修复内容:${NC}"
echo -e "  ✓ Hero组件：删除Hello1984 · 2025 Edition文本"
echo -e "  ✓ Checkout手机端：优化padding（px-4 sm:px-4）"
echo -e "  ✓ Checkout手机端：调整间距（gap-4 sm:gap-6）"
echo -e "  ✓ Checkout手机端：订单摘要移到顶部（order-1）"
echo -e "  ✓ Checkout手机端：优化表单padding（p-4 sm:p-6）"
echo -e "  ✓ SellerReviews：移除backdrop-blur，使用纯白背景"
echo -e "  ✓ SellerReviews：简化背景渐变，避免白色显示问题"
echo -e "  ✓ SellerReviews：优化手机端padding（p-4 sm:p-6）"
echo ""





