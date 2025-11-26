#!/bin/bash

echo "=========================================="
echo "检查SSL配置"
echo "=========================================="
echo ""

echo "1. 检查所有443端口的配置..."
find /www/server/nginx/conf/vhost/ -name "*.conf" -exec grep -l "listen.*443" {} \;

echo ""
echo "2. 检查hello1984.net配置..."
cat /www/server/nginx/conf/vhost/hello1984.net.conf

echo ""
echo "3. 检查是否有其他配置使用443端口..."
grep -r "listen.*443" /www/server/nginx/conf/vhost/ 2>/dev/null | grep -v hello1984

echo ""
echo "4. 检查默认SSL配置..."
grep -A 10 "default_server" /www/server/nginx/conf/vhost/*.conf 2>/dev/null || echo "未找到default_server配置"

echo ""
echo "5. 检查证书域名..."
openssl x509 -in /etc/letsencrypt/live/hello1984.net/fullchain.pem -noout -text | grep -A 1 "Subject Alternative Name"



