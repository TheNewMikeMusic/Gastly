#!/bin/bash

# 生产环境变量检查脚本
# 使用方法: bash scripts/check-env-production.sh

echo "🔍 检查生产环境变量配置..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_env() {
    local var_name=$1
    local pattern=$2
    local description=$3
    
    if [ -z "${!var_name}" ]; then
        echo -e "${RED}✗${NC} $var_name: 未设置"
        return 1
    fi
    
    if [ -n "$pattern" ] && ! echo "${!var_name}" | grep -qE "$pattern"; then
        echo -e "${YELLOW}⚠${NC} $var_name: 格式不正确 ($description)"
        return 1
    fi
    
    echo -e "${GREEN}✓${NC} $var_name: 已设置"
    return 0
}

# 必需环境变量检查
echo "=== 必需环境变量 ==="
check_env "NEXT_PUBLIC_URL" "^https://" "必须是 HTTPS URL"
check_env "STRIPE_SECRET_KEY" "^sk_live_" "必须是生产密钥 (sk_live_...)"
check_env "NEXT_PUBLIC_STRIPE_PRICE_ID" "^price_" "必须是价格 ID"
check_env "STRIPE_WEBHOOK_SECRET" "^whsec_" "必须是 Webhook 密钥"
check_env "DATABASE_URL" "^postgresql://" "必须是 PostgreSQL 连接字符串"
check_env "CLERK_PUBLISHABLE_KEY" "^pk_live_" "必须是生产公钥 (pk_live_...)"
check_env "CLERK_SECRET_KEY" "^sk_live_" "必须是生产密钥 (sk_live_...)"

echo ""
echo "=== 可选环境变量 ==="
check_env "FOURPX_API_KEY" "" "4PX API 密钥（如果使用物流）"
check_env "RESEND_API_KEY" "" "Resend API 密钥（如果使用邮件）"
check_env "ADMIN_SESSION_SECRET" "" "管理员会话密钥"

echo ""
echo "=== 安全检查 ==="

# 检查是否包含测试密钥
if echo "$STRIPE_SECRET_KEY" | grep -q "sk_test_"; then
    echo -e "${RED}✗${NC} STRIPE_SECRET_KEY 包含测试密钥 (sk_test_)"
fi

if echo "$CLERK_PUBLISHABLE_KEY" | grep -q "pk_test_"; then
    echo -e "${RED}✗${NC} CLERK_PUBLISHABLE_KEY 包含测试密钥 (pk_test_)"
fi

if echo "$CLERK_SECRET_KEY" | grep -q "sk_test_"; then
    echo -e "${RED}✗${NC} CLERK_SECRET_KEY 包含测试密钥 (sk_test_)"
fi

# 检查默认值
if [ "$ADMIN_SESSION_SECRET" = "change-this-secret-key-in-production" ]; then
    echo -e "${YELLOW}⚠${NC} ADMIN_SESSION_SECRET 仍使用默认值，请更改"
fi

echo ""
echo "检查完成！"

