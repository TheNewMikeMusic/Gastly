#!/bin/bash
# 最终流畅度优化部署

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "最终流畅度优化部署"
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
echo -e "流畅度优化部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}优化内容:${NC}"
echo -e "  ✓ 双缓冲技术：两个img元素交替显示，消除闪白"
echo -e "  ✓ 全量预加载：预加载所有60帧，显示加载进度"
echo -e "  ✓ 无缝切换：使用opacity过渡，确保图片已加载再切换"
echo -e "  ✓ 移除限制：直接使用requestAnimationFrame，无延迟"
echo -e "  ✓ CSS优化：will-change和image-rendering提升性能"
echo ""





