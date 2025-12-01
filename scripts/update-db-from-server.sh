#!/bin/bash

# 从服务器更新数据库配置脚本

echo "🔧 更新数据库配置为服务器数据库..."
echo ""

# 检查是否有服务器地址
if [ -z "$1" ]; then
    echo "使用方法: ./scripts/update-db-from-server.sh <服务器地址> [用户名] [密码] [数据库名]"
    echo ""
    echo "示例:"
    echo "  ./scripts/update-db-from-server.sh 38.175.195.104 maclock maclock123 maclock"
    echo ""
    echo "或者如果您有完整的 DATABASE_URL:"
    echo "  export DATABASE_URL='postgresql://user:pass@host:5432/dbname'"
    echo "  ./scripts/update-db-from-server.sh"
    exit 1
fi

SERVER_HOST=$1
DB_USER=${2:-maclock}
DB_PASS=${3:-maclock123}
DB_NAME=${4:-maclock}

# 如果提供了完整的 DATABASE_URL，使用它
if [ -n "$DATABASE_URL" ]; then
    NEW_DB_URL="$DATABASE_URL"
else
    NEW_DB_URL="postgresql://${DB_USER}:${DB_PASS}@${SERVER_HOST}:5432/${DB_NAME}"
fi

echo "新的 DATABASE_URL:"
echo "  ${NEW_DB_URL:0:50}..."
echo ""

# 备份当前的 .env.local
if [ -f .env.local ]; then
    cp .env.local .env.local.backup
    echo "✅ 已备份 .env.local 到 .env.local.backup"
fi

# 更新 .env.local
if [ -f .env.local ]; then
    # 如果 DATABASE_URL 已存在，替换它
    if grep -q "^DATABASE_URL=" .env.local; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=${NEW_DB_URL}|" .env.local
        else
            # Linux
            sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${NEW_DB_URL}|" .env.local
        fi
    else
        # 如果不存在，添加到文件末尾
        echo "DATABASE_URL=${NEW_DB_URL}" >> .env.local
    fi
    echo "✅ 已更新 .env.local"
else
    echo "❌ .env.local 文件不存在"
    exit 1
fi

echo ""
echo "✅ 数据库配置已更新！"
echo ""
echo "下一步："
echo "1. 测试数据库连接: npx ts-node scripts/check-database-production.ts"
echo "2. 手动创建订单: npx ts-node scripts/manual-create-order-from-session.ts <session_id>"
echo "3. 重启开发服务器以加载新配置"


