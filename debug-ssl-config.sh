#!/bin/bash

DOMAIN="hello1984.net"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
CONFIG_FILE="/www/server/nginx/conf/vhost/hello1984.net.conf"

echo "=========================================="
echo "调试SSL配置"
echo "=========================================="
echo ""

echo "1. 检查证书文件..."
ls -la $CERT_PATH/

echo ""
echo "2. 检查证书文件权限..."
ls -l $CERT_PATH/fullchain.pem $CERT_PATH/privkey.pem

echo ""
echo "3. 测试证书文件可读性..."
test -r $CERT_PATH/fullchain.pem && echo "✅ fullchain.pem 可读" || echo "❌ fullchain.pem 不可读"
test -r $CERT_PATH/privkey.pem && echo "✅ privkey.pem 可读" || echo "❌ privkey.pem 不可读"

echo ""
echo "4. 检查Nginx配置中的SSL部分..."
grep -A 10 "listen.*443" $CONFIG_FILE

echo ""
echo "5. 测试Nginx配置（详细输出）..."
/www/server/nginx/sbin/nginx -t 2>&1

echo ""
echo "6. 检查是否有SSL相关错误..."
/www/server/nginx/sbin/nginx -t 2>&1 | grep -i "ssl\|cert\|443"

echo ""
echo "7. 尝试手动测试SSL配置..."
# 创建一个临时测试配置
TEST_CONFIG="/tmp/test-ssl.conf"
cat > $TEST_CONFIG <<EOF
server {
    listen 8443 ssl;
    server_name test;
    ssl_certificate $CERT_PATH/fullchain.pem;
    ssl_certificate_key $CERT_PATH/privkey.pem;
}
EOF

/www/server/nginx/sbin/nginx -t -c $TEST_CONFIG 2>&1
rm -f $TEST_CONFIG



