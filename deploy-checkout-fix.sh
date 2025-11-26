#!/bin/bash
# 部署checkout页面修复

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "部署checkout页面修复"
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
echo -e "checkout页面修复部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}修复内容:${NC}"
echo -e "  ✓ 改进加载状态：等待Clerk完全加载后再处理"
echo -e "  ✓ 使用isSignedIn检查：更可靠的登录状态检查"
echo -e "  ✓ 添加错误处理：所有Clerk hooks调用都有try-catch保护"
echo -e "  ✓ 改进重定向：使用setTimeout避免重定向过程中的错误"
echo -e "  ✓ 更好的加载UI：显示加载动画和提示信息"
echo ""





