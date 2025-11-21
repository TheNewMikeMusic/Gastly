#!/bin/bash

echo "=== 检查服务器状态 ==="
echo ""

echo "1. 检查PM2进程状态："
pm2 list

echo ""
echo "2. 检查端口3000监听："
netstat -tlnp | grep 3000 || ss -tlnp | grep 3000

echo ""
echo "3. 检查Nginx状态："
systemctl status nginx --no-pager | head -20

echo ""
echo "4. 检查PM2日志（最后20行）："
pm2 logs maclock --lines 20 --nostream

echo ""
echo "5. 检查Next.js进程："
ps aux | grep -i next | grep -v grep

echo ""
echo "6. 检查磁盘空间："
df -h | head -5

echo ""
echo "7. 检查内存使用："
free -h


