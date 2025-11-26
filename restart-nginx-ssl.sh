#!/bin/bash

echo "=========================================="
echo "重启Nginx并启用SSL"
echo "=========================================="
echo ""

echo "1. 停止Nginx..."
/etc/init.d/nginx stop
sleep 2

echo ""
echo "2. 检查配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -ne 0 ]; then
    echo "❌ 配置测试失败"
    exit 1
fi

echo ""
echo "3. 启动Nginx..."
/etc/init.d/nginx start
sleep 3

echo ""
echo "4. 检查Nginx状态..."
if ps aux | grep -q "[n]ginx: master"; then
    echo "✅ Nginx已启动"
else
    echo "❌ Nginx启动失败"
    exit 1
fi

echo ""
echo "5. 检查端口监听..."
netstat -tlnp 2>/dev/null | grep -E "(80|443)" || ss -tlnp 2>/dev/null | grep -E "(80|443)"

echo ""
echo "6. 测试HTTPS连接..."
curl -k -I https://localhost 2>&1 | head -3

echo ""
echo "=========================================="
echo "完成"
echo "=========================================="



