#!/bin/bash
# 诊断 500 错误

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}========================================"
echo -e "诊断 500 错误"
echo -e "========================================${NC}"
echo ""

# 1. 检查 PM2 日志
echo -e "${YELLOW}[1] 检查 PM2 错误日志...${NC}"
echo -e "${YELLOW}最近的错误日志:${NC}"
pm2 logs maclock --err --lines 30
echo ""

# 2. 检查应用日志
echo -e "${YELLOW}[2] 检查应用输出日志...${NC}"
echo -e "${YELLOW}最近的输出日志:${NC}"
pm2 logs maclock --out --lines 30
echo ""

# 3. 检查服务状态
echo -e "${YELLOW}[3] 检查服务状态...${NC}"
pm2 status
echo ""

# 4. 检查环境变量
echo -e "${YELLOW}[4] 检查环境变量配置...${NC}"
if [ -f .env.local ]; then
    echo -e "${GREEN}✓ .env.local 文件存在${NC}"
    echo -e "${YELLOW}检查关键环境变量:${NC}"
    grep -E "DATABASE_URL|CLERK|STRIPE" .env.local | sed 's/=.*/=***/' || echo "未找到关键环境变量"
else
    echo -e "${RED}✗ .env.local 文件不存在${NC}"
fi
echo ""

# 5. 检查数据库连接
echo -e "${YELLOW}[5] 检查数据库连接...${NC}"
if docker-compose ps | grep -q "postgres.*Up"; then
    echo -e "${GREEN}✓ PostgreSQL 容器正在运行${NC}"
    docker-compose ps | grep postgres
else
    echo -e "${RED}✗ PostgreSQL 容器未运行${NC}"
    echo -e "${YELLOW}尝试启动数据库...${NC}"
    docker-compose up -d postgres
    sleep 3
fi
echo ""

# 6. 测试数据库连接
echo -e "${YELLOW}[6] 测试数据库连接...${NC}"
if [ -f .env.local ]; then
    export $(cat .env.local | grep DATABASE_URL | xargs)
    if docker-compose exec -T postgres pg_isready -U maclock > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 数据库连接正常${NC}"
    else
        echo -e "${RED}✗ 数据库连接失败${NC}"
    fi
fi
echo ""

# 7. 检查 Node.js 和依赖
echo -e "${YELLOW}[7] 检查 Node.js 版本...${NC}"
node -v
npm -v
echo ""

# 8. 检查端口监听
echo -e "${YELLOW}[8] 检查端口监听...${NC}"
netstat -tulpn | grep 3000 || ss -tulpn | grep 3000
echo ""

# 9. 尝试本地访问
echo -e "${YELLOW}[9] 测试本地访问...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ 本地访问成功${NC}"
    echo -e "${YELLOW}响应状态码:${NC}"
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
    echo ""
else
    echo -e "${RED}✗ 本地访问失败${NC}"
fi
echo ""

echo -e "${YELLOW}========================================"
echo -e "诊断完成"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}常见 500 错误原因:${NC}"
echo "  1. 环境变量未配置或配置错误"
echo "  2. 数据库连接失败"
echo "  3. Prisma Client 未生成"
echo "  4. 缺少必要的依赖"
echo "  5. 代码运行时错误"
echo ""
echo -e "${YELLOW}查看详细错误信息:${NC}"
echo "  pm2 logs maclock --err --lines 50"
echo ""


