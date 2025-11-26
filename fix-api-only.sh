#!/bin/bash

echo "========================================="
echo "修复API错误并重启应用"
echo "========================================="

APP_DIR="/var/www/maclock"

cd "$APP_DIR" || { echo "错误: 无法进入应用目录"; exit 1; }

# 1. 停止PM2进程
echo "1. 停止PM2进程..."
pm2 stop maclock &> /dev/null || true
pm2 delete maclock &> /dev/null || true
sleep 2
echo "✓ PM2进程已停止"

# 2. 检查API文件是否存在
echo ""
echo "2. 检查API文件..."
if [ -f "app/api/inventory/check/route.ts" ]; then
    echo "✓ API文件存在"
    # 显示文件前几行确认内容
    head -n 10 app/api/inventory/check/route.ts
else
    echo "✗ API文件不存在！"
    exit 1
fi

# 3. 检查是否需要重新构建
echo ""
echo "3. 检查构建文件..."
if [ ! -d ".next" ]; then
    echo "构建文件不存在，正在构建..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✓ 项目构建成功"
    else
        echo "✗ 项目构建失败"
        exit 1
    fi
else
    echo "✓ 构建文件存在"
    # 清理旧的构建缓存，强制重新编译API路由
    echo "清理API路由缓存..."
    rm -rf .next/cache
    rm -rf .next/server/app/api/inventory/check
    echo "✓ 缓存已清理"
fi

# 4. 启动PM2进程
echo ""
echo "4. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save
sleep 3
echo "✓ PM2进程已启动"

# 5. 检查应用状态
echo ""
echo "5. 检查应用状态..."
pm2 status maclock
echo ""

# 6. 等待几秒让应用完全启动
echo "6. 等待应用启动..."
sleep 5

# 7. 测试API
echo "7. 测试API..."
API_RESPONSE=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/inventory/check?productId=maclock-default&quantity=1" 2>&1)
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n 1)
BODY=$(echo "$API_RESPONSE" | head -n -1)

echo "API响应状态码: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ API返回200，检查响应内容..."
    if echo "$BODY" | grep -q "inStock\|stock\|productId"; then
        echo "✓ API返回有效JSON"
    else
        echo "⚠ API返回200但内容可能不是JSON:"
        echo "$BODY" | head -n 3
    fi
else
    echo "✗ API返回错误状态码: $HTTP_CODE"
    echo "响应内容:"
    echo "$BODY" | head -n 5
fi

echo ""
echo "========================================="
echo "修复完成！"
echo ""
echo "请通过以下地址访问："
echo "  - HTTP: http://38.175.195.104:3000"
echo "  - HTTPS: https://38.175.195.104 (如果已配置)"
echo "========================================="





