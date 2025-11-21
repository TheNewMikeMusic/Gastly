#!/bin/bash

echo "=== 验证 Clerk 配置 ==="
echo ""

cd /var/www/maclock

echo "1. 检查环境变量..."
CLERK_PUB_KEY=$(grep NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY .env.local | cut -d'=' -f2)
CLERK_SECRET=$(grep CLERK_SECRET_KEY .env.local | cut -d'=' -f2)

if [ -z "$CLERK_PUB_KEY" ] || [ -z "$CLERK_SECRET" ]; then
    echo "❌ 环境变量配置不完整"
    exit 1
fi

echo "✅ Clerk 密钥已配置"
echo ""

echo "2. 重启 PM2 服务以应用配置..."
pm2 restart maclock
sleep 3

echo ""
echo "3. 检查 PM2 状态..."
pm2 list

echo ""
echo "4. 检查端口监听..."
netstat -tlnp | grep 3000 || ss -tlnp | grep 3000

echo ""
echo "5. 测试本地连接..."
curl -I http://localhost:3000 2>&1 | head -3

echo ""
echo "=== 验证完成 ==="
echo ""
echo "下一步："
echo "1. 清除浏览器缓存（Ctrl+Shift+Delete）"
echo "2. 访问: http://38.175.195.104:3000/sign-in"
echo "3. 检查浏览器控制台，401错误应该消失"
echo "4. Sign In 页面应该正常显示"


