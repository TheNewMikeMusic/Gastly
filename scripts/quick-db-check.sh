#!/bin/bash

# 快速数据库检查脚本
# 用于上线前验证数据库配置

echo "🔍 开始检查生产环境数据库..."
echo ""

cd /var/www/maclock || exit 1

# 1. 检查环境变量
echo "1️⃣ 检查环境变量..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL 未设置"
    exit 1
else
    echo "✅ DATABASE_URL 已设置"
fi
echo ""

# 2. 检查 Prisma Client
echo "2️⃣ 检查 Prisma Client..."
if npx prisma generate --schema=./prisma/schema.prisma > /dev/null 2>&1; then
    echo "✅ Prisma Client 生成成功"
else
    echo "❌ Prisma Client 生成失败"
    exit 1
fi
echo ""

# 3. 检查数据库连接
echo "3️⃣ 检查数据库连接..."
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ 数据库连接成功"
else
    echo "❌ 数据库连接失败"
    echo "请检查 DATABASE_URL 和数据库服务状态"
    exit 1
fi
echo ""

# 4. 检查表结构
echo "4️⃣ 检查数据库表..."
TABLES=("Order" "Product" "Coupon" "SavedAddress" "Wishlist" "Newsletter" "Waitlist" "Thread" "Message")

for table in "${TABLES[@]}"; do
    if npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"$table\";" > /dev/null 2>&1; then
        echo "✅ 表 $table 存在"
    else
        echo "❌ 表 $table 不存在或无法访问"
    fi
done
echo ""

# 5. 检查 Order 表字段
echo "5️⃣ 检查 Order 表字段..."
REQUIRED_FIELDS=("id" "userId" "amount" "status" "stripeSessionId" "shippingName" "shippingAddress" "shippingCity" "shippingZip" "createdAt")

for field in "${REQUIRED_FIELDS[@]}"; do
    if npx prisma db execute --stdin <<< "SELECT \"$field\" FROM \"Order\" LIMIT 1;" > /dev/null 2>&1; then
        echo "✅ 字段 $field 存在"
    else
        echo "❌ 字段 $field 不存在"
    fi
done
echo ""

# 6. 检查默认产品
echo "6️⃣ 检查默认产品..."
PRODUCT_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Product\" WHERE id = 'maclock-default';" 2>/dev/null | grep -o '[0-9]' | head -1)
if [ "$PRODUCT_COUNT" -gt 0 ]; then
    echo "✅ 默认产品存在"
else
    echo "⚠️  警告: 默认产品不存在，需要创建"
fi
echo ""

# 7. 统计信息
echo "7️⃣ 数据库统计信息..."
ORDER_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Order\";" 2>/dev/null | grep -o '[0-9]' | head -1 || echo "0")
PRODUCT_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Product\";" 2>/dev/null | grep -o '[0-9]' | head -1 || echo "0")
COUPON_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Coupon\";" 2>/dev/null | grep -o '[0-9]' | head -1 || echo "0")

echo "   订单总数: $ORDER_COUNT"
echo "   产品总数: $PRODUCT_COUNT"
echo "   优惠券总数: $COUPON_COUNT"
echo ""

echo "✅✅✅ 数据库检查完成！"
echo ""
echo "📋 上线前检查清单："
echo "   [ ] 确认所有表都存在"
echo "   [ ] 确认 Order 表字段完整"
echo "   [ ] 确认默认产品已创建"
echo "   [ ] 确认数据库连接正常"
echo "   [ ] 运行 'npx prisma migrate deploy' 确保迁移已应用"
echo ""


