#!/bin/bash
# 检查服务器端图片文件和构建状态

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "检查服务器端图片文件和构建状态"
echo -e "========================================${NC}"
echo ""

cd /var/www/maclock

# 检查public目录下的图片文件
echo -e "${YELLOW}检查图片文件...${NC}"
PUBLIC_DIR="/var/www/maclock/public"
EXPECTED_FILES=60
FOUND_FILES=0

for i in $(seq -f "%03g" 0 59); do
    if [ -f "$PUBLIC_DIR/product-spin-${i}.webp" ]; then
        FOUND_FILES=$((FOUND_FILES + 1))
    else
        echo -e "${RED}✗ 缺少文件: product-spin-${i}.webp${NC}"
    fi
done

echo ""
if [ $FOUND_FILES -eq $EXPECTED_FILES ]; then
    echo -e "${GREEN}✓ 所有图片文件都存在 (${FOUND_FILES}/${EXPECTED_FILES})${NC}"
else
    echo -e "${RED}✗ 图片文件不完整 (${FOUND_FILES}/${EXPECTED_FILES})${NC}"
fi
echo ""

# 检查图片文件大小（确保不是空文件）
echo -e "${YELLOW}检查图片文件大小...${NC}"
EMPTY_FILES=0
for i in $(seq -f "%03g" 0 59); do
    if [ -f "$PUBLIC_DIR/product-spin-${i}.webp" ]; then
        SIZE=$(stat -f%z "$PUBLIC_DIR/product-spin-${i}.webp" 2>/dev/null || stat -c%s "$PUBLIC_DIR/product-spin-${i}.webp" 2>/dev/null)
        if [ "$SIZE" -lt 1000 ]; then
            echo -e "${RED}✗ 文件太小: product-spin-${i}.webp (${SIZE} bytes)${NC}"
            EMPTY_FILES=$((EMPTY_FILES + 1))
        fi
    fi
done

if [ $EMPTY_FILES -eq 0 ]; then
    echo -e "${GREEN}✓ 所有图片文件大小正常${NC}"
else
    echo -e "${RED}✗ 发现 ${EMPTY_FILES} 个异常小的文件${NC}"
fi
echo ""

# 检查构建目录
echo -e "${YELLOW}检查构建状态...${NC}"
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ .next 目录存在${NC}"
    
    # 检查构建时间
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        echo -e "${GREEN}✓ 构建ID: ${BUILD_ID}${NC}"
    fi
else
    echo -e "${RED}✗ .next 目录不存在，需要重新构建${NC}"
fi
echo ""

# 检查PM2服务状态
echo -e "${YELLOW}检查PM2服务状态...${NC}"
pm2 status maclock
echo ""

# 检查最近的日志
echo -e "${YELLOW}检查最近的错误日志...${NC}"
pm2 logs maclock --lines 20 --nostream --err 2>/dev/null | tail -10 || echo "无法获取日志"
echo ""

echo -e "${YELLOW}========================================"
echo -e "检查完成"
echo -e "========================================${NC}"





