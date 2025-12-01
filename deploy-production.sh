#!/bin/bash
# 生产环境完整部署脚本
# 确保支付、4px物流跟踪、后台管理等功能正常

set -e  # 遇到错误立即退出

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_USER="root"
SERVER_HOST="38.175.195.104"
SERVER_PASSWORD="0iHSn3CpCpDmlkub"
SERVER_PATH="/var/www/maclock"
LOCAL_PATH="/Users/mikexu/Desktop/Maclock"

# 检查是否有 sshpass
if command -v sshpass &> /dev/null; then
    export SSHPASS="${SERVER_PASSWORD}"
    SSHPASS_CMD="sshpass -e"
else
    echo -e "${YELLOW}⚠️  sshpass 未安装，将尝试使用 SSH 密钥或手动输入密码${NC}"
    SSHPASS_CMD=""
fi

echo -e "${BLUE}========================================"
echo -e "🚀 生产环境完整部署"
echo -e "========================================${NC}"
echo ""

# 1. 检查本地构建
echo -e "${YELLOW}[1/8] 检查本地构建...${NC}"
cd "$LOCAL_PATH"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 找不到 package.json${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 本地项目检查通过${NC}"
echo ""

# 2. 检查环境变量文件
echo -e "${YELLOW}[2/8] 检查环境变量配置...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ 错误: 找不到 .env.local 文件${NC}"
    echo -e "${YELLOW}请先创建 .env.local 并配置所有必要的环境变量${NC}"
    exit 1
fi

# 检查关键环境变量
REQUIRED_VARS=(
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_PRICE_ID"
    "DATABASE_URL"
    "NEXT_PUBLIC_URL"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env.local 2>/dev/null; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ 缺少必要的环境变量:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "  - $var"
    done
    exit 1
fi

echo -e "${GREEN}✓ 环境变量检查通过${NC}"
echo ""

# 3. 本地构建测试
echo -e "${YELLOW}[3/8] 本地构建测试...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败！请先修复构建错误${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 本地构建成功${NC}"
echo ""

# 4. 提交代码到 Git（可选）
echo -e "${YELLOW}[4/8] 检查 Git 状态...${NC}"
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✓ 工作目录干净${NC}"
else
    echo -e "${YELLOW}⚠️  工作目录有未提交的更改，继续部署...${NC}"
fi
echo ""

# 5. 上传文件到服务器
echo -e "${YELLOW}[5/8] 上传文件到服务器...${NC}"
echo -e "${BLUE}正在同步文件到 ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}${NC}"

# 使用 rsync 同步文件（排除 node_modules 和 .next）
if [ -n "$SSHPASS_CMD" ]; then
    $SSHPASS_CMD rsync -avz --progress \
        --exclude 'node_modules' \
        --exclude '.next' \
        --exclude '.git' \
        --exclude '.env.local' \
        --exclude '*.log' \
        --exclude '.DS_Store' \
        "$LOCAL_PATH/" \
        "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
else
    rsync -avz --progress \
        --exclude 'node_modules' \
        --exclude '.next' \
        --exclude '.git' \
        --exclude '.env.local' \
        --exclude '*.log' \
        --exclude '.DS_Store' \
        "$LOCAL_PATH/" \
        "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 文件上传失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 文件上传成功${NC}"
echo ""

# 6. 在服务器上执行部署步骤
echo -e "${YELLOW}[6/8] 在服务器上执行部署...${NC}"
if [ -n "$SSHPASS_CMD" ]; then
    $SSHPASS_CMD ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
else
    ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
fi
set -e

cd /var/www/maclock

echo "📦 安装依赖..."
npm ci --production=false

echo "🔧 生成 Prisma Client..."
npx prisma generate

echo "🗄️  运行数据库迁移..."
npx prisma migrate deploy || echo "⚠️  迁移可能已是最新状态"

echo "🏗️  构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建成功"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 服务器端部署失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 服务器端部署成功${NC}"
echo ""

# 7. 重启服务
echo -e "${YELLOW}[7/8] 重启服务...${NC}"
if [ -n "$SSHPASS_CMD" ]; then
    $SSHPASS_CMD ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
else
    ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
fi
cd /var/www/maclock

echo "🛑 停止服务..."
pm2 stop maclock 2>/dev/null || true
sleep 2

echo "🚀 启动服务..."
pm2 start npm --name maclock -- start || pm2 restart maclock

echo "⏳ 等待服务启动..."
sleep 5

echo "📊 检查服务状态..."
pm2 status maclock

echo "🔍 检查端口监听..."
if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
    netstat -tulpn | grep 3000
elif ss -tulpn 2>/dev/null | grep -q ":3000"; then
    ss -tulpn | grep 3000
fi
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 服务重启失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 服务重启成功${NC}"
echo ""

# 8. 健康检查
echo -e "${YELLOW}[8/8] 健康检查...${NC}"
sleep 3

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "http://${SERVER_HOST}:3000" || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ 网站响应正常 (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ 网站响应异常 (HTTP $HTTP_CODE)${NC}"
    echo -e "${YELLOW}查看服务器日志:${NC}"
    if [ -n "$SSHPASS_CMD" ]; then
        $SSHPASS_CMD ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" "pm2 logs maclock --lines 20 --nostream"
    else
        ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" "pm2 logs maclock --lines 20 --nostream"
    fi
    exit 1
fi

echo ""
echo -e "${GREEN}========================================"
echo -e "✅ 部署完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${BLUE}📋 部署后检查清单:${NC}"
echo -e "  1. ✅ 访问 http://${SERVER_HOST}:3000 确认网站正常"
echo -e "  2. ✅ 测试支付流程（使用 Stripe 测试卡）"
echo -e "  3. ✅ 检查 Stripe Webhook 是否正常工作"
echo -e "  4. ✅ 测试 4px 物流跟踪功能"
echo -e "  5. ✅ 验证后台管理功能（/admin）"
echo -e "  6. ✅ 测试不同用户账号的订单数据隔离"
echo -e "  7. ✅ 检查订单状态更新是否正常"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo -e "  - 查看日志: ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 logs maclock'"
echo -e "  - 重启服务: ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 restart maclock'"
echo -e "  - 查看状态: ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 status'"
echo ""

