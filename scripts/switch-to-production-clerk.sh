#!/bin/bash

# 切换到生产环境 Clerk 密钥的脚本
# 使用前请确保 clerk.hello1984.net 的 DNS 和 SSL 已正确配置

set -e

echo "🔄 切换到生产环境 Clerk 密钥"
echo ""

# 服务器信息
SERVER_HOST="38.175.195.104"
SERVER_USER="root"
SERVER_PATH="/var/www/maclock"

# 生产环境 Clerk 密钥（请替换为您的实际密钥）
PROD_PUBLISHABLE_KEY="YOUR_PUBLISHABLE_KEY"
PROD_SECRET_KEY="YOUR_SECRET_KEY"

# 检查是否提供了服务器密码
if [ -z "$SERVER_PASSWORD" ]; then
    echo "❌ 错误：请设置 SERVER_PASSWORD 环境变量"
    echo "   例如：export SERVER_PASSWORD='your_password'"
    exit 1
fi

echo "📋 准备更新以下配置："
echo "   Publishable Key: ${PROD_PUBLISHABLE_KEY:0:30}..."
echo "   Secret Key: ${PROD_SECRET_KEY:0:30}..."
echo ""

# 确认操作
read -p "⚠️  确认切换到生产环境 Clerk 密钥？(y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 操作已取消"
    exit 1
fi

echo ""
echo "🔍 检查 DNS 配置..."
echo "   请确保 clerk.hello1984.net 的 DNS CNAME 记录已正确配置"
echo "   并且 SSL 证书已生成"
echo ""
read -p "⚠️  DNS 和 SSL 已配置完成？(y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 请先配置 DNS 和 SSL，然后再运行此脚本"
    exit 1
fi

echo ""
echo "📤 更新服务器配置..."

# 使用 sshpass 更新环境变量
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} << EOF
cd ${SERVER_PATH}

# 备份当前配置
cp .env.local .env.local.backup.\$(date +%Y%m%d_%H%M%S)

# 更新 Clerk 密钥
sed -i 's|^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${PROD_PUBLISHABLE_KEY}|' .env.local
sed -i 's|^CLERK_SECRET_KEY=.*|CLERK_SECRET_KEY=${PROD_SECRET_KEY}|' .env.local

echo "✅ 配置已更新"
EOF

echo ""
echo "🏗️  重新构建应用..."

sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} << EOF
cd ${SERVER_PATH}
rm -rf .next
npm run build 2>&1 | tail -10
EOF

echo ""
echo "🔄 重启 PM2 服务..."

sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} << EOF
pm2 restart maclock
sleep 5
pm2 status maclock
EOF

echo ""
echo "✅ 切换完成！"
echo ""
echo "🌐 测试地址："
echo "   - https://hello1984.net/sign-in"
echo "   - https://hello1984.net/sign-up"
echo ""
echo "💡 请测试登录/注册功能，确保一切正常"
echo "   如果遇到问题，检查浏览器控制台是否有错误"

