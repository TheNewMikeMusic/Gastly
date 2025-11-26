#!/bin/bash

echo "=== 快速启动服务 ==="
echo ""

cd /var/www/maclock

echo "1. 检查构建文件..."
if [ ! -d ".next" ]; then
    echo "错误：.next目录不存在，需要先构建"
    echo "运行: npm run build"
    exit 1
fi

echo ""
echo "2. 启动PM2进程..."
pm2 start npm --name "maclock" -- start

echo ""
echo "3. 保存PM2配置..."
pm2 save

echo ""
echo "4. 等待服务启动..."
sleep 5

echo ""
echo "5. 检查PM2状态："
pm2 list

echo ""
echo "6. 检查端口3000："
netstat -tlnp | grep 3000 || ss -tlnp | grep 3000

echo ""
echo "7. 测试本地连接："
curl -I http://localhost:3000 2>&1 | head -5 || echo "本地连接失败"

echo ""
echo "8. 查看PM2日志（最后10行）："
pm2 logs maclock --lines 10 --nostream

echo ""
echo "=== 启动完成 ==="
echo ""
echo "如果服务启动成功，请访问: http://38.175.195.104"
echo "如果仍有问题，请运行: ./force-rebuild-and-restart.sh"





