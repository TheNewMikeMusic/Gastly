#!/bin/bash

echo "=========================================="
echo "最终SSL证书验证"
echo "=========================================="
echo ""

echo "1. 验证证书信息..."
certbot certificates

echo ""
echo "2. 通过IP地址测试（模拟SSL Labs）..."
echo "测试1: 不使用SNI"
echo | openssl s_client -connect 38.175.195.104:443 2>&1 | grep -A 5 "subject=" | head -8

echo ""
echo "测试2: 使用SNI（域名）"
echo | openssl s_client -connect 38.175.195.104:443 -servername hello1984.net 2>&1 | grep -A 5 "subject=" | head -8

echo ""
echo "3. 检查证书的完整信息..."
echo | openssl s_client -connect hello1984.net:443 -servername hello1984.net 2>&1 | openssl x509 -noout -text 2>/dev/null | grep -E "(Subject:|Issuer:|DNS:)" | head -5

echo ""
echo "4. 检查所有443端口配置..."
echo "查找所有包含443的配置（排除已禁用的）..."
for conf in /www/server/panel/vhost/nginx/*.conf; do
    if [ -f "$conf" ] && ! [[ "$conf" =~ \.disabled$ ]]; then
        if grep -q "listen.*443" "$conf"; then
            echo "=== $conf ==="
            grep -A 3 "listen.*443" "$conf"
            echo ""
        fi
    fi
done

echo ""
echo "5. 检查Nginx实际加载的配置..."
/www/server/nginx/sbin/nginx -T 2>&1 | grep -A 10 "server_name hello1984.net" | head -15

echo ""
echo "=========================================="
echo "验证完成"
echo "=========================================="
echo ""
echo "如果SSL Labs仍显示错误，请："
echo "1. 等待5-10分钟让配置完全生效"
echo "2. 在SSL Labs点击 'Clear cache' 清除缓存"
echo "3. 重新扫描：https://www.ssllabs.com/ssltest/analyze.html?d=hello1984.net"
echo ""



