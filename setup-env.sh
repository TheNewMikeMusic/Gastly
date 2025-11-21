#!/bin/bash
# 设置环境变量

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}配置环境变量...${NC}"
echo ""

# 检查是否已有 .env.local
if [ -f .env.local ]; then
    echo -e "${GREEN}.env.local 已存在${NC}"
    echo -e "${YELLOW}是否要覆盖? (y/n)${NC}"
    read -r answer
    if [ "$answer" != "y" ]; then
        echo "跳过环境变量配置"
        exit 0
    fi
fi

# 创建 .env.local 文件
cat > .env.local << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_URL=http://38.175.195.104

# 数据库配置（使用 Docker Compose 中的 PostgreSQL）
DATABASE_URL=postgresql://maclock:maclock123@localhost:5432/maclock

# Stripe 配置（请替换为您的实际密钥）
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_STRIPE_PRICE_ID=price_placeholder

# Clerk 配置（请替换为您的实际密钥）
CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# 其他配置
RESEND_API_KEY=re_placeholder
EOF

echo -e "${GREEN}✓ .env.local 文件已创建${NC}"
echo ""
echo -e "${YELLOW}重要: 请编辑 .env.local 文件，替换以下占位符为实际值:${NC}"
echo "  - STRIPE_SECRET_KEY"
echo "  - NEXT_PUBLIC_STRIPE_PRICE_ID"
echo "  - CLERK_PUBLISHABLE_KEY"
echo "  - CLERK_SECRET_KEY"
echo "  - RESEND_API_KEY"
echo ""
echo -e "${YELLOW}编辑命令: nano .env.local${NC}"
echo ""



