#!/bin/bash

echo "========================================="
echo "强制重新构建应用"
echo "========================================="

APP_DIR="/var/www/maclock"

cd "$APP_DIR" || { echo "错误: 无法进入应用目录"; exit 1; }

# 1. 停止PM2进程
echo "1. 停止PM2进程..."
pm2 stop maclock &> /dev/null || true
pm2 delete maclock &> /dev/null || true
pkill -f "next-server" &> /dev/null || true
sleep 3
echo "✓ 所有进程已停止"

# 2. 完全清理构建文件
echo ""
echo "2. 完全清理构建文件..."
rm -rf .next
rm -rf node_modules/.cache
echo "✓ 构建文件已清理"

# 3. 重新构建项目
echo ""
echo "3. 重新构建项目..."
echo "这可能需要几分钟时间..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ 项目构建成功"
else
    echo "✗ 项目构建失败，显示错误："
    npm run build 2>&1 | tail -n 30
    exit 1
fi

# 4. 启动PM2进程
echo ""
echo "4. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save
sleep 5
echo "✓ PM2进程已启动"

# 5. 等待应用完全启动
echo ""
echo "5. 等待应用启动（10秒）..."
sleep 10

# 6. 检查应用状态
echo ""
echo "6. 检查应用状态..."
pm2 status maclock

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
            echo "✓ API返回有效JSON"
            echo "响应示例:"
            echo "$BODY" | head -n 3
            break
        else
            echo "⚠ API返回200但内容异常"
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

echo ""
echo "========================================="
echo "重建完成！"
echo ""
echo "修复内容："
echo "1. ✓ 评论组件布局优化（移除空白）"
echo "2. ✓ 图片加载优化（PC视图eager loading）"
echo "3. ✓ API错误处理修复"
echo "4. ✓ Middleware API路由修复"
echo ""
echo "请访问 http://38.175.195.104:3000 测试"
echo "========================================="


