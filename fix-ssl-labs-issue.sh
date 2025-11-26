#!/bin/bash

echo "=========================================="
echo "修复SSL Labs证书名称不匹配问题"
echo "=========================================="
echo ""

echo "1. 通过IP地址测试SSL证书（SSL Labs的方式）..."
echo | openssl s_client -connect 38.175.195.104:443 2>&1 | grep -A 3 "subject=" | head -5

echo ""
echo "2. 通过域名测试SSL证书..."
echo | openssl s_client -connect hello1984.net:443 -servername hello1984.net 2>&1 | grep -A 3 "subject=" | head -5

echo ""
echo "3. 检查所有443端口配置..."
find /www/server/panel/vhost/nginx/ -name "*.conf" ! -name "*.disabled" -exec echo "=== {} ===" \; -exec grep -A 2 "listen.*443" {} \; 2>/dev/null

echo ""
echo "4. 检查hello1984.net配置..."
cat /www/server/panel/vhost/nginx/hello1984.net.conf | grep -E "(listen|server_name|default_server)" | head -10

echo ""
echo "5. 确保default_server正确配置..."

CONFIG_FILE="/www/server/panel/vhost/nginx/hello1984.net.conf"

# 检查是否有default_server
if ! grep -q "default_server" "$CONFIG_FILE"; then
    echo "添加default_server..."
    sed -i 's/listen 443 ssl;/listen 443 ssl default_server;/g' "$CONFIG_FILE"
    sed -i 's/listen \[::\]:443 ssl;/listen [::]:443 ssl default_server;/g' "$CONFIG_FILE"
    echo "✅ 已添加default_server"
else
    echo "✅ default_server已配置"
fi

echo ""
echo "6. 确保没有其他default_server配置..."
grep -r "default_server" /www/server/panel/vhost/nginx/*.conf 2>/dev/null | grep -v ".disabled" | grep -v "hello1984"

echo ""
echo "7. 测试配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "✅ 配置测试通过"
    echo ""
    echo "8. 重新加载Nginx..."
    /etc/init.d/nginx reload
    sleep 2
    
    echo ""
    echo "9. 再次测试通过IP访问的证书..."
    echo | openssl s_client -connect 38.175.195.104:443 2>&1 | grep -A 3 "subject=" | head -5
    
    echo ""
    echo "10. 检查证书的SAN（Subject Alternative Name）..."
    echo | openssl s_client -connect hello1984.net:443 -servername hello1984.net 2>&1 | openssl x509 -noout -text 2>/dev/null | grep -A 1 "Subject Alternative Name"
else
    echo "❌ 配置测试失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "完成"
echo "=========================================="
echo ""
echo "如果通过IP访问仍返回错误证书，可能需要："
echo "1. 等待几分钟让配置生效"
echo "2. SSL Labs可能需要重新扫描"
echo ""



