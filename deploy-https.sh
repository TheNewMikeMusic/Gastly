#!/bin/bash
# Deploy HTTPS configuration and rebuild application

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================"
echo -e "部署HTTPS配置"
echo -e "========================================${NC}"
echo ""

cd /var/www/maclock

# 1. Update environment variable
echo -e "${YELLOW}1. 更新环境变量...${NC}"
if [ -f ".env.local" ]; then
    # 备份原文件
    cp .env.local .env.local.backup
    
    # 更新URL为HTTPS
    if grep -q "NEXT_PUBLIC_URL=" .env.local; then
        sed -i 's|NEXT_PUBLIC_URL=.*|NEXT_PUBLIC_URL=https://38.175.195.104|' .env.local
    else
        echo "NEXT_PUBLIC_URL=https://38.175.195.104" >> .env.local
    fi
    echo -e "${GREEN}✓ 环境变量已更新${NC}"
else
    echo -e "${YELLOW}⚠ .env.local 不存在，请手动创建并设置 NEXT_PUBLIC_URL=https://38.175.195.104${NC}"
fi
echo ""

# 2. Clean build
echo -e "${YELLOW}2. 清理旧的构建文件...${NC}"
rm -rf .next
echo -e "${GREEN}✓ 清理完成${NC}"
echo ""

# 3. Rebuild
echo -e "${YELLOW}3. 重新构建项目...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}构建失败！${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 构建成功${NC}"
echo ""

# 4. Restart PM2
echo -e "${YELLOW}4. 重启PM2进程...${NC}"
pm2 restart maclock

if [ $? -ne 0 ]; then
    echo -e "${RED}重启失败！${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PM2进程已重启${NC}"
echo ""

# 5. Wait for service
sleep 3

# 6. Check status
echo -e "${YELLOW}5. 检查服务状态...${NC}"
pm2 status maclock
echo ""

echo -e "${GREEN}========================================"
echo -e "HTTPS部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}访问地址:${NC}"
echo -e "  HTTPS: https://38.175.195.104"
echo -e "  HTTP会自动重定向到HTTPS"
echo ""
echo -e "${YELLOW}注意事项:${NC}"
echo -e "  - 首次访问会显示证书警告，需要手动接受"
echo -e "  - iOS设备需要在设置中信任证书"
echo ""





