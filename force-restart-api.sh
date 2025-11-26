#!/bin/bash

echo "========================================="
echo "强制重启并修复API"
echo "========================================="

APP_DIR="/var/www/maclock"

cd "$APP_DIR" || { echo "错误: 无法进入应用目录"; exit 1; }

# 1. 完全停止所有相关进程
echo "1. 完全停止所有进程..."
pm2 stop all &> /dev/null || true
pm2 delete all &> /dev/null || true
pkill -f "next-server" &> /dev/null || true
pkill -f "node.*start" &> /dev/null || true
sleep 3
echo "✓ 所有进程已停止"

# 2. 确认API文件存在且正确
echo ""
echo "2. 检查API文件..."
if [ ! -f "app/api/inventory/check/route.ts" ]; then
    echo "✗ API文件不存在！"
    exit 1
fi

# 检查文件是否包含safeResponse函数（我们的修复标记）
if grep -q "safeResponse" app/api/inventory/check/route.ts; then
    echo "✓ API文件包含修复代码"
else
    echo "⚠ API文件可能未更新，显示前20行："
    head -n 20 app/api/inventory/check/route.ts
fi

# 3. 完全清理构建缓存
echo ""
echo "3. 清理构建缓存..."
rm -rf .next
echo "✓ 构建缓存已清理"

# 4. 重新构建
echo ""
echo "4. 重新构建项目..."
npm run build
if [ $? -eq 0 ]; then
    echo "✓ 项目构建成功"
else
    echo "✗ 项目构建失败，显示错误："
    npm run build 2>&1 | tail -n 20
    exit 1
fi

# 5. 启动PM2
echo ""
echo "5. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save
sleep 5
echo "✓ PM2进程已启动"

# 6. 等待应用完全启动
echo ""
echo "6. 等待应用启动（10秒）..."
sleep 10

# 7. 测试API
echo ""
echo "7. 测试API..."
for i in {1..3}; do
    echo "尝试 $i/3..."
    API_RESPONSE=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/inventory/check?productId=maclock-default&quantity=1" 2>&1)
    HTTP_CODE=$(echo "$API_RESPONSE" | tail -n 1)
    BODY=$(echo "$API_RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✓ API返回200"
        if echo "$BODY" | grep -q "inStock\|stock\|productId"; then
            echo "✓ API返回有效JSON:"
            echo "$BODY" | head -n 5
            break
        else
            echo "⚠ API返回200但内容异常:"
            echo "$BODY" | head -n 3
        fi
    else
        echo "✗ API返回错误: $HTTP_CODE"
        if [ $i -lt 3 ]; then
            echo "等待5秒后重试..."
            sleep 5
        else
            echo "响应内容:"
            echo "$BODY" | head -n 10
        fi
    fi
done

# 8. 显示PM2状态
echo ""
echo "8. PM2状态："
pm2 status maclock

echo ""
echo "========================================="
echo "重启完成！"
echo "========================================="





