#!/bin/bash

NGINX_MAIN_CONF="/www/server/nginx/conf/nginx.conf"
DOMAIN="hello1984.net"

echo "=========================================="
echo "检查并修复Nginx主配置"
echo "=========================================="
echo ""

echo "1. 检查主配置文件中的SSL配置..."
if grep -q "ssl_certificate" "$NGINX_MAIN_CONF"; then
    echo "⚠️  发现主配置文件中有SSL配置："
    grep -A 5 "ssl_certificate" "$NGINX_MAIN_CONF"
    echo ""
    echo "这可能会覆盖虚拟主机的配置"
else
    echo "✅ 主配置文件中没有SSL配置"
fi

echo ""
echo "2. 检查server块配置..."
if grep -q "server {" "$NGINX_MAIN_CONF"; then
    echo "⚠️  主配置文件中有server块："
    grep -A 10 "server {" "$NGINX_MAIN_CONF" | head -15
fi

echo ""
echo "3. 检查include配置..."
grep "include" "$NGINX_MAIN_CONF" | grep -v "^#"

echo ""
echo "4. 查找所有可能包含SSL配置的文件..."
find /www/server/nginx/conf -name "*.conf" -exec grep -l "ssl_certificate.*38.175.195.104\|CN.*38.175.195.104" {} \; 2>/dev/null

echo ""
echo "5. 检查是否有默认的server块在443端口..."
grep -r "listen.*443" /www/server/nginx/conf/ 2>/dev/null | grep -v "vhost" | grep -v "hello1984"



