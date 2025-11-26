#!/bin/bash

echo "=========================================="
echo "检查Nginx状态和配置"
echo "=========================================="
echo ""

echo "1. Nginx进程状态..."
ps aux | grep nginx | grep -v grep

echo ""
echo "2. 检查端口监听..."
netstat -tlnp 2>/dev/null | grep -E "(80|443)" || ss -tlnp 2>/dev/null | grep -E "(80|443)"

echo ""
echo "3. 检查hello1984.net配置..."
cat /www/server/nginx/conf/vhost/hello1984.net.conf | grep -E "(listen|server_name)" | head -10

echo ""
echo "4. 检查IP配置文件..."
cat /www/server/panel/vhost/nginx/38.175.195.104.conf | grep -E "(listen|server_name)" | head -10

echo ""
echo "5. 测试HTTP连接..."
curl -I http://hello1984.net 2>&1 | head -5

echo ""
echo "6. 测试HTTPS连接..."
curl -k -I https://hello1984.net 2>&1 | head -5

echo ""
echo "7. 检查Nginx错误日志..."
tail -20 /var/log/nginx/maclock-error.log 2>/dev/null || tail -20 /www/wwwlogs/maclock-error.log 2>/dev/null || echo "日志文件不存在"



