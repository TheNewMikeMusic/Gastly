#!/bin/bash

echo "========================================="
echo "重启应用以应用所有修复"
echo "========================================="

APP_DIR="/var/www/maclock"

cd "$APP_DIR" || { echo "错误: 无法进入应用目录"; exit 1; }

# 1. 停止PM2进程
echo "1. 停止PM2进程..."
pm2 stop maclock &> /dev/null || true
pm2 delete maclock &> /dev/null || true
sleep 2
echo "✓ PM2进程已停止"

# 2. 清理构建缓存
echo ""
echo "2. 清理构建缓存..."
rm -rf .next/cache
rm -rf .next/server/app/api/inventory/check
echo "✓ 缓存已清理"

# 3. 重新构建（如果需要）
echo ""
echo "3. 检查构建文件..."
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
    echo "构建文件缺失，正在重新构建..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✓ 项目构建成功"
    else
        echo "✗ 项目构建失败"
        exit 1
    fi
else
    echo "✓ 构建文件存在"
fi

# 4. 启动PM2进程
echo ""
echo "4. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save
sleep 5
echo "✓ PM2进程已启动"

# 5. 检查应用状态
echo ""
echo "5. 检查应用状态..."
pm2 status maclock

# 6. 测试API
echo ""
echo "6. 测试API..."
sleep 3
API_RESPONSE=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/inventory/check?productId=maclock-default&quantity=1" 2>&1)
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n 1)
BODY=$(echo "$API_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ API返回200"
    if echo "$BODY" | grep -q "inStock\|stock\|productId"; then
        echo "✓ API返回有效JSON"
    else
        echo "⚠ API返回200但内容可能异常"
    fi
else
    echo "✗ API返回错误: $HTTP_CODE"
    echo "响应内容:"
    echo "$BODY" | head -n 5
fi

echo ""
echo "========================================="
echo "重启完成！"
echo ""
echo "修复内容："
echo "1. ✓ 评论组件布局优化（移除空白）"
echo "2. ✓ 图片加载优化（PC视图eager loading）"
echo "3. ✓ API错误处理修复"
echo "4. ✓ Middleware API路由修复"
echo "========================================="





