#!/bin/bash

echo "=== 检查 Clerk API 配置 ==="
echo ""

cd /var/www/maclock

# 读取 Secret Key
CLERK_SECRET_KEY=$(grep CLERK_SECRET_KEY .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")

if [ -z "$CLERK_SECRET_KEY" ]; then
    echo "❌ 找不到 CLERK_SECRET_KEY"
    exit 1
fi

echo "1. 检查当前 Clerk 实例配置..."
RESPONSE=$(curl -s -X GET https://api.clerk.com/v1/instance \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-Type: application/json")

if [ $? -eq 0 ]; then
    echo "✅ 成功连接到 Clerk API"
    echo ""
    echo "2. 检查 Allowed Origins 配置..."
    echo "$RESPONSE" | grep -o '"allowed_origins":\[[^]]*\]' || echo "未找到 allowed_origins 配置"
    echo ""
    echo "3. 当前配置的 Origins："
    echo "$RESPONSE" | grep -A 10 "allowed_origins" || echo "需要配置 allowed_origins"
else
    echo "❌ 无法连接到 Clerk API"
    echo "响应：$RESPONSE"
fi

echo ""
echo "4. 重新配置 Allowed Origins..."
CONFIG_RESPONSE=$(curl -s -X PATCH https://api.clerk.com/v1/instance \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "allowed_origins": [
      "http://38.175.195.104:3000",
      "http://38.175.195.104",
      "http://localhost:3000"
    ]
  }')

if [ $? -eq 0 ]; then
    echo "✅ 配置更新成功"
    echo ""
    echo "5. 等待配置生效（30秒）..."
    sleep 30
    echo "✅ 配置应该已生效"
else
    echo "❌ 配置更新失败"
    echo "响应：$CONFIG_RESPONSE"
fi

echo ""
echo "=== 完成 ==="
echo ""
echo "请清除浏览器缓存并重新测试 Sign In 页面"





