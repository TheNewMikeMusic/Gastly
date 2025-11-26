#!/bin/bash

echo "=== 强制重建并修复PC端问题 ==="
echo ""

cd /var/www/maclock

echo "1. 停止PM2进程..."
pm2 stop maclock || true
pm2 delete maclock || true

echo ""
echo "2. 清理构建缓存..."
rm -rf .next
rm -rf node_modules/.cache

echo ""
echo "3. 重新构建..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo ""
echo "4. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save

echo ""
echo "5. 等待服务启动..."
sleep 5

echo ""
echo "6. 检查PM2状态..."
pm2 list

echo ""
echo "7. 检查端口3000..."
netstat -tlnp | grep 3000 || ss -tlnp | grep 3000

echo ""
echo "8. 查看PM2日志（最后20行）..."
pm2 logs maclock --lines 20 --nostream

echo ""
echo "=== 重建完成 ==="
echo ""
echo "请清除PC浏览器缓存并重新测试："
echo "1. 按 Ctrl+Shift+Delete 清除缓存"
echo "2. 或使用无痕模式（Ctrl+Shift+N）"
echo "3. 访问: http://38.175.195.104:3000/sign-in"





