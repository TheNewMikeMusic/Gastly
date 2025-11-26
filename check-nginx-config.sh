#!/bin/bash
# 检查Nginx配置详情

echo "=========================================="
echo "检查Nginx配置详情"
echo "=========================================="
echo ""

echo "1. 检查启用的站点:"
ls -la /etc/nginx/sites-enabled/
echo ""

echo "2. 检查maclock配置:"
if [ -f "/etc/nginx/sites-available/maclock" ]; then
    echo "配置文件存在:"
    cat /etc/nginx/sites-available/maclock
else
    echo "配置文件不存在！"
fi
echo ""

echo "3. 检查Nginx主配置:"
grep -E "include|sites-enabled" /etc/nginx/nginx.conf | head -5
echo ""

echo "4. 检查所有监听配置:"
grep -r "listen" /etc/nginx/sites-enabled/ 2>/dev/null || echo "未找到监听配置"
echo ""

echo "5. 测试Nginx配置（详细输出）:"
nginx -T 2>&1 | grep -A 10 -B 5 "listen\|server_name\|ssl_certificate" | head -30
echo ""





