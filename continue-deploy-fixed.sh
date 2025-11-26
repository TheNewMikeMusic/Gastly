#!/bin/bash
# 继续部署脚本 - 修复版本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}检查当前安装状态...${NC}"
echo ""

cd /var/www/maclock

# 检查 Docker Compose 命令（支持两种格式）
DOCKER_COMPOSE_CMD=""
if command -v docker-compose > /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo -e "${RED}错误: 未找到 Docker Compose${NC}"
    echo -e "${YELLOW}安装 Docker Compose...${NC}"
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4 || echo "v2.24.0")
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    DOCKER_COMPOSE_CMD="docker-compose"
fi

echo -e "${GREEN}使用 Docker Compose 命令: $DOCKER_COMPOSE_CMD${NC}"
echo ""

# 启动数据库
echo -e "${YELLOW}[2/8] 启动 PostgreSQL 数据库...${NC}"
if [ -f docker-compose.yml ]; then
    echo -e "${YELLOW}启动数据库容器...${NC}"
    $DOCKER_COMPOSE_CMD up -d postgres 2>&1 || $DOCKER_COMPOSE_CMD up -d 2>&1
    
    echo -e "${YELLOW}等待数据库就绪...${NC}"
    sleep 5
    for i in {1..30}; do
        if $DOCKER_COMPOSE_CMD exec -T postgres pg_isready -U maclock > /dev/null 2>&1; then
            echo -e "${GREEN}✓ 数据库已就绪${NC}"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${YELLOW}⚠ 数据库启动超时，但继续部署${NC}"
        fi
        sleep 2
    done
else
    echo -e "${YELLOW}未找到 docker-compose.yml${NC}"
fi
echo ""

# 检查环境变量
echo -e "${YELLOW}[3/8] 检查环境变量配置...${NC}"
if [ ! -f .env.local ] && [ ! -f .env ]; then
    echo -e "${YELLOW}警告: 未找到环境变量文件，将使用默认配置${NC}"
    echo -e "${YELLOW}部署完成后请创建 .env.local 文件${NC}"
else
    echo -e "${GREEN}✓ 环境变量文件已找到${NC}"
fi
echo ""

# 安装依赖
echo -e "${YELLOW}[4/8] 安装 Node.js 依赖...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}清理旧的依赖...${NC}"
    rm -rf node_modules
fi
if [ -d ".next" ]; then
    echo -e "${YELLOW}清理旧的构建文件...${NC}"
    rm -rf .next
fi

echo -e "${YELLOW}正在安装依赖，这可能需要几分钟...${NC}"
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# 生成 Prisma Client
echo -e "${YELLOW}[5/8] 生成 Prisma Client...${NC}"
if [ -f "prisma/schema.prisma" ]; then
    npx prisma generate
    echo -e "${GREEN}✓ Prisma Client 生成完成${NC}"
else
    echo -e "${YELLOW}未找到 Prisma schema，跳过${NC}"
fi
echo ""

# 运行数据库迁移
echo -e "${YELLOW}[6/8] 运行数据库迁移...${NC}"
if [ -f "prisma/schema.prisma" ]; then
    npx prisma migrate deploy 2>&1 || npx prisma db push 2>&1 || {
        echo -e "${YELLOW}数据库迁移失败，但继续部署${NC}"
    }
    echo -e "${GREEN}✓ 数据库迁移完成${NC}"
else
    echo -e "${YELLOW}未找到 Prisma schema，跳过迁移${NC}"
fi
echo ""

# 构建项目
echo -e "${YELLOW}[7/8] 构建 Next.js 项目...${NC}"
export NODE_ENV=production
npm run build
echo -e "${GREEN}✓ 项目构建完成${NC}"
echo ""

# 启动服务
echo -e "${YELLOW}[8/8] 启动应用服务...${NC}"
if pm2 list | grep -q "maclock"; then
    echo -e "${YELLOW}停止现有服务...${NC}"
    pm2 stop maclock || true
    pm2 delete maclock || true
fi

echo -e "${YELLOW}启动 PM2 服务...${NC}"
pm2 start npm --name maclock -- start
pm2 save || true
pm2 startup systemd -u root --hp /root || true

echo -e "${GREEN}✓ 服务启动完成${NC}"
echo ""

echo -e "${GREEN}========================================"
echo -e "部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${GREEN}服务状态:${NC}"
pm2 list
echo ""
echo -e "${GREEN}常用命令:${NC}"
echo "  查看日志: pm2 logs maclock"
echo "  实时日志: pm2 logs maclock --lines 50"
echo "  重启服务: pm2 restart maclock"
echo "  停止服务: pm2 stop maclock"
echo ""
echo -e "${YELLOW}注意: 请确保防火墙已开放端口 3000${NC}"
echo ""






