#!/bin/bash

echo "=== 配置 Clerk Allowed Origins ==="
echo ""

cd /var/www/maclock

# 读取环境变量
if [ ! -f .env.local ]; then
    echo "错误：找不到 .env.local 文件"
    exit 1
fi

CLERK_SECRET_KEY=$(grep CLERK_SECRET_KEY .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")

if [ -z "$CLERK_SECRET_KEY" ]; then
    echo "错误：找不到 CLERK_SECRET_KEY"
    exit 1
fi

echo "1. 读取 Clerk Secret Key..."
echo "   Secret Key: ${CLERK_SECRET_KEY:0:20}..." # 只显示前20个字符
echo ""

echo "2. 配置 Allowed Origins..."
echo "   添加: http://38.175.195.104:3000"
echo "   添加: http://38.175.195.104"
echo ""

# 使用 Clerk API 配置
RESPONSE=$(curl -s -X PATCH https://api.clerk.com/v1/instance \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "allowed_origins": [
      "http://38.175.195.104:3000",
      "http://38.175.195.104"
    ]
  }' 2>&1)

if [ $? -eq 0 ]; then
    echo "3. ✅ 配置成功！"
    echo ""
    echo "4. 等待配置生效（10秒）..."
    sleep 10
    echo ""
    echo "5. 请清除浏览器缓存并重新测试 Sign In 页面"
else
    echo "3. ❌ 配置失败"
    echo ""
    echo "错误信息："
    echo "$RESPONSE"
    echo ""
    echo "请手动在 Clerk Dashboard 中配置："
    echo "1. 登录 https://dashboard.clerk.com/"
    echo "2. 找到 Settings → Domains 或 Configure → Frontend API"
    echo "3. 添加: http://38.175.195.104:3000"
    echo "4. 添加: http://38.175.195.104"
fi

echo ""
echo "=== 完成 ==="





