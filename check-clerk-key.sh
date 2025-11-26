#!/bin/bash

echo "=== 检查 Clerk 密钥格式 ==="
echo ""

cd /var/www/maclock

echo "1. 当前环境变量中的 Clerk 密钥："
CLERK_KEY=$(grep NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY .env.local | cut -d'=' -f2)
echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_KEY"
echo ""

echo "2. 密钥格式检查："
if [[ $CLERK_KEY == pk_test_* ]] || [[ $CLERK_KEY == pk_live_* ]]; then
    echo "✅ 密钥格式正确（以 pk_test_ 或 pk_live_ 开头）"
else
    echo "❌ 密钥格式不正确！"
    echo "   正确的格式应该是：pk_test_xxxxxxxxxxxxx 或 pk_live_xxxxxxxxxxxxx"
    echo ""
    echo "3. 尝试解码当前值（可能是 base64）："
    echo "$CLERK_KEY" | base64 -d 2>/dev/null || echo "无法解码"
fi

echo ""
echo "4. 如何获取正确的 Clerk Publishable Key："
echo "   1. 登录 https://dashboard.clerk.com/"
echo "   2. 选择你的应用"
echo "   3. 进入 Settings → API Keys"
echo "   4. 复制 'Publishable key'（应该以 pk_test_ 或 pk_live_ 开头）"
echo "   5. 更新 .env.local 文件中的 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"





