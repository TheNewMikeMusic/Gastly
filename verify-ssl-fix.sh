#!/bin/bash

DOMAIN="hello1984.net"
IP="38.175.195.104"

echo "=========================================="
echo "验证SSL配置修复"
echo "=========================================="
echo ""

echo "1. 通过域名测试SSL证书..."
echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>&1 | grep -A 3 "subject="

echo ""
echo "2. 通过IP测试SSL证书（应该失败或显示证书不匹配）..."
echo | openssl s_client -connect $IP:443 -servername $DOMAIN 2>&1 | grep -A 3 "subject="

echo ""
echo "3. 检查Nginx配置..."
cat /www/server/nginx/conf/vhost/$DOMAIN.conf | grep -E "(listen|server_name|ssl_certificate)" | head -10

echo ""
echo "4. 测试HTTPS连接..."
curl -vI https://$DOMAIN 2>&1 | grep -E "(SSL|certificate|HTTP)" | head -5

echo ""
echo "=========================================="
echo "如果通过域名访问显示正确的证书，说明配置正确"
echo "SSL Labs可能需要几分钟才能更新结果"
echo "=========================================="



