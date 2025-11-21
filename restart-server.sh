#!/bin/bash

echo "=== 重启服务器 ==="
echo ""

cd /var/www/maclock

echo "1. 停止PM2进程..."
pm2 stop maclock || true
pm2 delete maclock || true

echo ""
echo "2. 检查是否有残留进程..."
pkill -f "next-server" || true
pkill -f "node.*maclock" || true

echo ""
echo "3. 等待进程完全停止..."
sleep 2

echo ""
echo "4. 检查构建文件..."
if [ ! -d ".next" ]; then
    echo "警告：.next目录不存在，需要重新构建"
    echo "运行: npm run build"
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
echo "10. 查看PM2日志（最后10行）："
pm2 logs maclock --lines 10 --nostream

echo ""
echo "=== 重启完成 ==="


