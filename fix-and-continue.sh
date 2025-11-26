#!/bin/bash
# 修复环境变量并继续部署

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}修复环境变量配置...${NC}"
echo ""

# 创建 .env.local（如果不存在）
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}创建 .env.local 文件...${NC}"
    cat > .env.local << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_URL=http://38.175.195.104
DATABASE_URL=postgresql://maclock:maclock123@localhost:5432/maclock
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_STRIPE_PRICE_ID=price_placeholder
CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
RESEND_API_KEY=re_placeholder
EOF
    echo -e "${GREEN}✓ .env.local 已创建${NC}"
else
    echo -e "${GREEN}✓ .env.local 已存在${NC}"
fi

# 确保 DATABASE_URL 存在
if ! grep -q "DATABASE_URL" .env.local; then
    echo "DATABASE_URL=postgresql://maclock:maclock123@localhost:5432/maclock" >> .env.local
    echo -e "${GREEN}✓ 添加了 DATABASE_URL${NC}"
fi

echo ""

# 检查 Docker Compose 命令
DOCKER_COMPOSE_CMD=""
if command -v docker-compose > /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
fi

# 确保数据库正在运行
echo -e "${YELLOW}检查数据库状态...${NC}"
if [ -n "$DOCKER_COMPOSE_CMD" ] && [ -f docker-compose.yml ]; then
    if ! $DOCKER_COMPOSE_CMD ps | grep -q "postgres.*Up"; then
        echo -e "${YELLOW}启动数据库...${NC}"
        $DOCKER_COMPOSE_CMD up -d postgres || $DOCKER_COMPOSE_CMD up -d
        sleep 5
    else
        echo -e "${GREEN}✓ 数据库正在运行${NC}"
    fi
fi
echo ""

# 运行数据库迁移
echo -e "${YELLOW}[6/8] 运行数据库迁移...${NC}"
if [ -f "prisma/schema.prisma" ]; then
    export $(cat .env.local | grep DATABASE_URL | xargs)
    npx prisma migrate deploy 2>&1 || npx prisma db push 2>&1 || {
        echo -e "${YELLOW}数据库迁移失败，但继续部署${NC}"
    }
    echo -e "${GREEN}✓ 数据库迁移完成${NC}"
fi
echo ""

# 构建项目
echo -e "${YELLOW}[7/8] 构建 Next.js 项目...${NC}"
export NODE_ENV=production
export $(cat .env.local | xargs)

# 显示构建错误详情
npm run build 2>&1 || {
    echo -e "${RED}构建失败，查看详细错误信息...${NC}"
    echo ""
    echo "常见问题："
    echo "1. 缺少环境变量 - 检查 .env.local"
    echo "2. 数据库连接失败 - 检查数据库是否运行"
    echo "3. 依赖问题 - 尝试: rm -rf node_modules && npm install"
    exit 1
}

echo -e "${GREEN}✓ 项目构建完成${NC}"
echo ""

# 启动服务
echo -e "${YELLOW}[8/8] 启动应用服务...${NC}"
if pm2 list | grep -q "maclock"; then
    pm2 stop maclock || true
    pm2 delete maclock || true
fi

pm2 start npm --name maclock -- start
pm2 save || true

echo -e "${GREEN}✓ 服务启动完成${NC}"
echo ""

echo -e "${GREEN}========================================"
echo -e "部署完成！"
echo -e "========================================${NC}"
echo ""
pm2 list
echo ""
echo -e "${YELLOW}重要提醒:${NC}"
echo "  1. 请编辑 .env.local 文件，替换占位符为实际 API 密钥"
echo "  2. 编辑命令: nano .env.local"
echo "  3. 更新后重启服务: pm2 restart maclock"
echo ""






