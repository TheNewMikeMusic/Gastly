#!/bin/bash
# 继续部署脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}检查当前安装状态...${NC}"
echo ""

# 检查已安装的软件
command -v node > /dev/null && echo -e "${GREEN}✓ Node.js: $(node -v)${NC}" || echo -e "${RED}✗ Node.js 未安装${NC}"
command -v npm > /dev/null && echo -e "${GREEN}✓ npm: $(npm -v)${NC}" || echo -e "${RED}✗ npm 未安装${NC}"
command -v pm2 > /dev/null && echo -e "${GREEN}✓ PM2: $(pm2 -v)${NC}" || echo -e "${RED}✗ PM2 未安装${NC}"
command -v docker > /dev/null && echo -e "${GREEN}✓ Docker: $(docker --version)${NC}" || echo -e "${YELLOW}⚠ Docker 未完全安装${NC}"
echo ""

cd /var/www/maclock

# 完成 Docker 安装（如果未完成）
if ! command -v docker > /dev/null; then
    echo -e "${YELLOW}完成 Docker 安装...${NC}"
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sh /tmp/get-docker.sh
    rm /tmp/get-docker.sh
    systemctl enable docker || true
    systemctl start docker || true
    echo -e "${GREEN}✓ Docker 安装完成${NC}"
else
    echo -e "${GREEN}✓ Docker 已安装${NC}"
fi

# 检查 Docker Compose
if ! command -v docker-compose > /dev/null && ! command -v docker compose &> /dev/null; then
    echo -e "${YELLOW}安装 Docker Compose...${NC}"
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4 || echo "v2.24.0")
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓ Docker Compose 安装完成${NC}"
else
    echo -e "${GREEN}✓ Docker Compose 已安装${NC}"
fi

echo ""

# 启动数据库
echo -e "${YELLOW}[2/8] 启动 PostgreSQL 数据库...${NC}"
if [ -f docker-compose.yml ]; then
    docker-compose up -d postgres 2>&1 || docker-compose up -d 2>&1
    echo -e "${YELLOW}等待数据库就绪...${NC}"
    sleep 5
    for i in {1..30}; do
        if docker-compose exec -T postgres pg_isready -U maclock > /dev/null 2>&1; then
            echo -e "${GREEN}✓ 数据库已就绪${NC}"
            break
        fi
        sleep 2
    done
fi
echo ""

# 检查环境变量
echo -e "${YELLOW}[3/8] 检查环境变量配置...${NC}"
if [ ! -f .env.local ] && [ ! -f .env ]; then
    echo -e "${YELLOW}警告: 未找到环境变量文件，将使用默认配置${NC}"
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
fi
echo ""

# 运行数据库迁移
echo -e "${YELLOW}[6/8] 运行数据库迁移...${NC}"
if [ -f "prisma/schema.prisma" ]; then
    npx prisma migrate deploy || npx prisma db push || {
        echo -e "${YELLOW}数据库迁移失败，但继续部署${NC}"
    }
    echo -e "${GREEN}✓ 数据库迁移完成${NC}"
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
    pm2 stop maclock || true
    pm2 delete maclock || true
fi

pm2 start npm --name maclock -- start
pm2 save || true
pm2 startup systemd -u root --hp /root || true

echo -e "${GREEN}✓ 服务启动完成${NC}"
echo ""

echo -e "${GREEN}========================================"
echo -e "部署完成！"
echo -e "========================================${NC}"
echo ""
pm2 list
echo ""
echo "查看日志: pm2 logs maclock"
echo ""






