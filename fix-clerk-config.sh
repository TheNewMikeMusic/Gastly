#!/bin/bash
# 修复 Clerk 配置问题

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}========================================"
echo -e "修复 Clerk 配置问题"
echo -e "========================================${NC}"
echo ""

# 检查 .env.local 文件
if [ ! -f .env.local ]; then
    echo -e "${RED}✗ .env.local 文件不存在${NC}"
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
    echo -e "${GREEN}✓ .env.local 文件已创建${NC}"
else
    echo -e "${GREEN}✓ .env.local 文件存在${NC}"
fi

echo ""
echo -e "${YELLOW}检查 Clerk 配置...${NC}"

# 检查 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder" .env.local || grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$" .env.local || ! grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local; then
    echo -e "${RED}✗ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 未配置或使用占位符${NC}"
    echo ""
    echo -e "${YELLOW}请编辑 .env.local 文件并设置正确的 Clerk 密钥:${NC}"
    echo "  nano .env.local"
    echo ""
    echo -e "${YELLOW}需要设置以下变量:${NC}"
    echo "  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx 或 pk_live_xxxxx"
    echo "  CLERK_SECRET_KEY=sk_test_xxxxx 或 sk_live_xxxxx"
    echo ""
    echo -e "${YELLOW}获取 Clerk 密钥:${NC}"
    echo "  https://dashboard.clerk.com/last-active?path=api-keys"
    echo ""
    
    # 检查是否有 CLERK_PUBLISHABLE_KEY（没有 NEXT_PUBLIC_ 前缀）
    if grep -q "^CLERK_PUBLISHABLE_KEY=" .env.local && ! grep -q "^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=" .env.local; then
        echo -e "${YELLOW}发现 CLERK_PUBLISHABLE_KEY，添加 NEXT_PUBLIC_ 前缀...${NC}"
        CLERK_KEY=$(grep "^CLERK_PUBLISHABLE_KEY=" .env.local | cut -d'=' -f2)
        echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_KEY" >> .env.local
        echo -e "${GREEN}✓ 已添加 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY${NC}"
    fi
else
    CLERK_KEY=$(grep "^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=" .env.local | cut -d'=' -f2)
    if [ -n "$CLERK_KEY" ] && [ "$CLERK_KEY" != "pk_test_placeholder" ] && [ "$CLERK_KEY" != "" ]; then
        echo -e "${GREEN}✓ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 已配置${NC}"
    else
        echo -e "${RED}✗ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 配置无效${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}当前 .env.local 中的 Clerk 配置:${NC}"
grep "CLERK" .env.local | sed 's/=.*/=***/' || echo "未找到 Clerk 配置"
echo ""

# 如果配置了占位符，提供临时解决方案
if grep -q "pk_test_placeholder\|pk_live_placeholder" .env.local; then
    echo -e "${YELLOW}========================================"
    echo -e "临时解决方案（禁用 Clerk）"
    echo -e "========================================${NC}"
    echo ""
    echo -e "${YELLOW}如果暂时不需要认证功能，可以临时禁用 Clerk:${NC}"
    echo ""
    echo "1. 编辑 app/layout.tsx:"
    echo "   nano app/layout.tsx"
    echo ""
    echo "2. 临时注释掉 ClerkProvider，改为直接返回 children"
    echo ""
    echo "3. 或者设置一个临时的测试密钥（仅用于测试）"
    echo ""
fi

echo -e "${YELLOW}修复后需要重启服务:${NC}"
echo "  pm2 restart maclock"
echo ""


