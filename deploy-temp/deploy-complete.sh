#!/bin/bash
# Maclock 完整部署脚本 - 在服务器上执行

set -e

# 配置
PROJECT_DIR="/var/www/maclock"
SERVICE_NAME="maclock"
NODE_ENV="production"
PORT=3000

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "Maclock 完整部署脚本"
echo -e "========================================${NC}"
echo ""

# 进入项目目录
cd "$PROJECT_DIR" || {
    echo -e "${RED}错误: 项目目录不存在: $PROJECT_DIR${NC}"
    exit 1
}

echo -e "${YELLOW}当前目录: $(pwd)${NC}"
echo ""

# 1. 检查并安装系统依赖
echo -e "${YELLOW}[1/8] 检查系统依赖...${NC}"

# 更新包列表
apt-get update -qq

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}安装 Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js 已安装: $NODE_VERSION${NC}"
fi

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}安装 PM2...${NC}"
    npm install -g pm2
else
    PM2_VERSION=$(pm2 -v)
    echo -e "${GREEN}✓ PM2 已安装: $PM2_VERSION${NC}"
fi

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}安装 Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker 已安装: $DOCKER_VERSION${NC}"
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}安装 Docker Compose...${NC}"
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    DOCKER_COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓ Docker Compose 已安装: $DOCKER_COMPOSE_VERSION${NC}"
fi

echo ""

# 2. 启动 PostgreSQL 数据库
echo -e "${YELLOW}[2/8] 启动 PostgreSQL 数据库...${NC}"

if [ -f docker-compose.yml ]; then
    # 启动数据库容器
    docker-compose up -d postgres || {
        echo -e "${YELLOW}启动数据库容器...${NC}"
        docker-compose up -d
    }
    
    # 等待数据库就绪
    echo -e "${YELLOW}等待数据库就绪...${NC}"
    sleep 5
    for i in {1..30}; do
        if docker-compose exec -T postgres pg_isready -U maclock > /dev/null 2>&1; then
            echo -e "${GREEN}✓ 数据库已就绪${NC}"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${RED}✗ 数据库启动超时${NC}"
            exit 1
        fi
        sleep 2
    done
else
    echo -e "${YELLOW}未找到 docker-compose.yml，跳过数据库启动${NC}"
    echo -e "${YELLOW}请确保 DATABASE_URL 环境变量已正确配置${NC}"
fi

echo ""

# 3. 检查环境变量文件
echo -e "${YELLOW}[3/8] 检查环境变量配置...${NC}"

if [ ! -f .env.local ] && [ ! -f .env ]; then
    echo -e "${RED}警告: 未找到 .env.local 或 .env 文件${NC}"
    echo -e "${YELLOW}请创建 .env.local 文件并配置以下变量:${NC}"
    echo "  - DATABASE_URL"
    echo "  - STRIPE_SECRET_KEY"
    echo "  - NEXT_PUBLIC_STRIPE_PRICE_ID"
    echo "  - CLERK_PUBLISHABLE_KEY"
    echo "  - CLERK_SECRET_KEY"
    echo "  - NEXT_PUBLIC_URL"
    echo ""
    read -p "是否继续部署? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ 环境变量文件已找到${NC}"
fi

echo ""

# 4. 安装依赖
echo -e "${YELLOW}[4/8] 安装 Node.js 依赖...${NC}"

# 清理旧的 node_modules 和 .next
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}清理旧的依赖...${NC}"
    rm -rf node_modules
fi

if [ -d ".next" ]; then
    echo -e "${YELLOW}清理旧的构建文件...${NC}"
    rm -rf .next
fi

# 安装依赖
npm ci --production=false || npm install

echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# 5. 生成 Prisma Client
echo -e "${YELLOW}[5/8] 生成 Prisma Client...${NC}"

if [ -f "prisma/schema.prisma" ]; then
    npx prisma generate
    echo -e "${GREEN}✓ Prisma Client 生成完成${NC}"
else
    echo -e "${YELLOW}未找到 Prisma schema，跳过${NC}"
fi

echo ""

# 6. 运行数据库迁移
echo -e "${YELLOW}[6/8] 运行数据库迁移...${NC}"

if [ -f "prisma/schema.prisma" ]; then
    # 检查数据库连接
    if npx prisma db push --skip-generate 2>&1 | grep -q "Error"; then
        echo -e "${YELLOW}尝试运行迁移...${NC}"
        npx prisma migrate deploy || npx prisma db push
    else
        echo -e "${GREEN}✓ 数据库迁移完成${NC}"
    fi
else
    echo -e "${YELLOW}未找到 Prisma schema，跳过迁移${NC}"
fi

echo ""

# 7. 构建项目
echo -e "${YELLOW}[7/8] 构建 Next.js 项目...${NC}"

export NODE_ENV=production
npm run build

echo -e "${GREEN}✓ 项目构建完成${NC}"
echo ""

# 8. 启动服务
echo -e "${YELLOW}[8/8] 启动应用服务...${NC}"

# 停止现有服务
if pm2 list | grep -q "$SERVICE_NAME"; then
    echo -e "${YELLOW}停止现有服务...${NC}"
    pm2 stop "$SERVICE_NAME" || true
    pm2 delete "$SERVICE_NAME" || true
fi

# 启动新服务
echo -e "${YELLOW}启动 PM2 服务...${NC}"
pm2 start npm --name "$SERVICE_NAME" -- start
pm2 save
pm2 startup systemd -u root --hp /root || true

echo -e "${GREEN}✓ 服务启动完成${NC}"
echo ""

# 显示服务状态
echo -e "${BLUE}========================================"
echo -e "部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${GREEN}服务状态:${NC}"
pm2 list
echo ""
echo -e "${GREEN}服务日志:${NC}"
echo "  查看日志: pm2 logs $SERVICE_NAME"
echo "  实时日志: pm2 logs $SERVICE_NAME --lines 50"
echo ""
echo -e "${GREEN}常用命令:${NC}"
echo "  重启服务: pm2 restart $SERVICE_NAME"
echo "  停止服务: pm2 stop $SERVICE_NAME"
echo "  查看状态: pm2 status"
echo ""
echo -e "${YELLOW}注意: 请确保防火墙已开放端口 $PORT${NC}"
echo -e "${YELLOW}     并配置反向代理 (Nginx) 指向 http://localhost:$PORT${NC}"
echo ""

