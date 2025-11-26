#!/bin/bash

echo "=== 强制重建并重启 ==="
echo ""

cd /var/www/maclock

echo "1. 停止PM2进程..."
pm2 stop maclock || true
pm2 delete maclock || true

echo ""
echo "2. 清理残留进程..."
pkill -f "next-server" || true
pkill -f "node.*maclock" || true
sleep 2

echo ""
echo "3. 清理构建缓存..."
rm -rf .next
rm -rf node_modules/.cache

echo ""
echo "4. 重新构建..."
npm run build

if [ $? -ne 0 ]; then
    echo "构建失败！请检查错误信息。"
    exit 1
fi

echo ""
echo "5. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save

echo ""
echo "6. 等待服务启动..."
sleep 5

echo ""
echo "7. 检查PM2状态："
pm2 list

echo ""
echo "8. 检查端口3000："
netstat -tlnp | grep 3000 || ss -tlnp | grep 3000

echo ""
echo "9. 测试本地连接："
curl -I http://localhost:3000 || echo "本地连接失败"

echo ""
echo "10. 查看PM2日志（最后20行）："
pm2 logs maclock --lines 20 --nostream

echo ""
echo "=== 重建并重启完成 ==="





