#!/bin/bash
# 部署图片序列版本

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}开始部署图片序列版本...${NC}"
echo ""

cd /var/www/maclock

# 检查文件是否存在
if [ ! -f "components/ProductSpinVideo.tsx" ]; then
    echo -e "${RED}错误: ProductSpinVideo.tsx 文件不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 文件已上传${NC}"
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
echo -e "${YELLOW}正在重启服务...${NC}"
pm2 restart maclock

if [ $? -ne 0 ]; then
    echo -e "${RED}重启失败！${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 服务已重启${NC}"
echo ""

# 等待服务启动
sleep 3

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
pm2 status maclock
echo ""

# 检查端口监听
echo -e "${YELLOW}检查端口监听...${NC}"
netstat -tulpn | grep 3000 || ss -tulpn | grep 3000
echo ""

# 测试本地访问
echo -e "${YELLOW}测试本地访问...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ 本地访问正常${NC}"
else
    echo -e "${RED}✗ 本地访问失败${NC}"
fi
echo ""

echo -e "${GREEN}========================================"
echo -e "图片序列版本部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}更新说明:${NC}"
echo -e "  - 使用图片序列替代视频（60张图片）"
echo -e "  - iOS、Android、PC都支持滚动控制"
echo -e "  - 智能预加载关键帧和相邻帧"
echo -e "  - 流畅的滚动驱动动画"
echo ""





