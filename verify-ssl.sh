#!/bin/bash

DOMAIN="hello1984.net"

echo "=========================================="
echo "验证SSL证书配置"
echo "=========================================="
echo ""

echo "1. 检查证书文件..."
ls -la /etc/letsencrypt/live/$DOMAIN/

echo ""
echo "2. 验证证书链..."
openssl verify -CAfile /etc/letsencrypt/live/$DOMAIN/chain.pem /etc/letsencrypt/live/$DOMAIN/cert.pem

echo ""
echo "3. 检查证书信息..."
openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -noout -text | grep -E "(Subject:|Issuer:|DNS:)"

echo ""
echo "4. 测试HTTPS连接..."
curl -vI https://$DOMAIN 2>&1 | grep -E "(SSL|certificate|HTTP)"

echo ""
echo "5. 检查Nginx SSL配置..."
cat /www/server/nginx/conf/vhost/$DOMAIN.conf | grep -A 5 ssl_certificate



