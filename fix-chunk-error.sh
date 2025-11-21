#!/bin/bash
# 修复 chunk 加载错误

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}========================================"
echo -e "修复 Chunk 加载错误"
echo -e "========================================${NC}"
echo ""

# 1. 停止服务
echo -e "${YELLOW}[1] 停止服务...${NC}"
pm2 stop maclock || true
echo -e "${GREEN}✓ 服务已停止${NC}"
echo ""

# 2. 清理旧的构建文件
echo -e "${YELLOW}[2] 清理旧的构建文件...${NC}"
if [ -d ".next" ]; then
    rm -rf .next
    echo -e "${GREEN}✓ .next 目录已删除${NC}"
fi
echo ""

# 3. 确保环境变量已加载
echo -e "${YELLOW}[3] 检查环境变量...${NC}"
if [ -f .env.local ]; then
    echo -e "${GREEN}✓ .env.local 文件存在${NC}"
    # 导出环境变量
    export $(cat .env.local | grep -v '^#' | xargs)
else
    echo -e "${RED}✗ .env.local 文件不存在${NC}"
fi
echo ""

# 4. 重新构建项目
echo -e "${YELLOW}[4] 重新构建项目（这可能需要几分钟）...${NC}"
export NODE_ENV=production
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}✗ 构建失败${NC}"
    exit 1
fi
echo ""

# 5. 检查构建文件
echo -e "${YELLOW}[5] 检查构建文件...${NC}"
if [ -d ".next/static/chunks" ]; then
    CHUNK_COUNT=$(find .next/static/chunks -name "*.js" | wc -l)
    echo -e "${GREEN}✓ 找到 $CHUNK_COUNT 个 chunk 文件${NC}"
    
    # 检查是否有缺失的 chunk
    if [ -f ".next/build-manifest.json" ]; then
        echo -e "${GREEN}✓ build-manifest.json 存在${NC}"
    fi
else
    echo -e "${RED}✗ chunks 目录不存在${NC}"
    exit 1
fi
echo ""

# 6. 设置正确的文件权限
echo -e "${YELLOW}[6] 设置文件权限...${NC}"
chmod -R 755 .next
echo -e "${GREEN}✓ 权限已设置${NC}"
echo ""

# 7. 重启服务
echo -e "${YELLOW}[7] 启动服务...${NC}"
pm2 start npm --name maclock -- start
pm2 save

sleep 3

# 8. 检查服务状态
echo -e "${YELLOW}[8] 检查服务状态...${NC}"
pm2 status

echo ""
echo -e "${GREEN}========================================"
echo -e "修复完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}请清除浏览器缓存后重新访问:${NC}"
echo "  http://38.175.195.104:3000"
echo ""
echo -e "${YELLOW}如果问题仍然存在，请:${NC}"
echo "  1. 清除浏览器缓存（Ctrl+Shift+Delete）"
echo "  2. 使用无痕模式访问"
echo "  3. 检查 pm2 logs maclock 查看错误"
echo ""


