#!/bin/bash
# 超流畅优化部署

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "超流畅优化部署"
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
echo -e "超流畅优化部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}优化内容:${NC}"
echo -e "  ✓ 图片缓存：使用Map存储已加载的Image对象，确保即时可用"
echo -e "  ✓ 简化切换：移除所有检查步骤，直接切换src和opacity"
echo -e "  ✓ 移除过渡：CSS transition设为none，无延迟切换"
echo -e "  ✓ 移除状态更新：只使用ref，不触发React重新渲染"
echo -e "  ✓ 持续RAF：移除节流检查，确保每次滚动都更新"
echo -e "  ✓ 优化依赖：移除loadedFrames依赖，避免重新绑定"
echo ""


