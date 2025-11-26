#!/bin/bash
# 部署导航栏修复

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "部署导航栏修复"
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
echo -e "导航栏修复部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}修复内容:${NC}"
echo -e "  ✓ 登录重定向：登录后重定向到首页而不是checkout"
echo -e "  ✓ 手机菜单质感：添加backdrop-blur、改进阴影和边框"
echo -e "  ✓ 菜单项样式：更精致的间距、字体和hover效果"
echo -e "  ✓ Account区域：添加背景和更好的视觉层次"
echo -e "  ✓ PC窄视图：调整断点从sm到md，确保头像和按钮可见"
echo ""





