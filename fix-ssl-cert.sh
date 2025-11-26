#!/bin/bash
set -e

DOMAIN="hello1984.net"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
CONFIG_FILE="/www/server/nginx/conf/vhost/hello1984.net.conf"

echo "=========================================="
echo "修复SSL证书配置"
echo "=========================================="
echo ""

# 检查证书文件
echo "检查证书文件..."
if [ ! -f "$CERT_PATH/fullchain.pem" ]; then
    echo "❌ 证书文件不存在，重新获取证书..."
    systemctl stop nginx
    certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@hello1984.net --force-renewal
    systemctl start nginx
else
    echo "✅ 证书文件存在"
fi

# 验证证书
echo ""
echo "验证证书..."
openssl x509 -in $CERT_PATH/fullchain.pem -noout -subject -issuer -dates

# 检查Nginx配置
echo ""
echo "检查Nginx配置..."
if [ -f "$CONFIG_FILE" ]; then
    echo "✅ 配置文件存在: $CONFIG_FILE"
    
    # 确保使用fullchain.pem而不是cert.pem
    if grep -q "ssl_certificate.*cert.pem" "$CONFIG_FILE"; then
        echo "⚠️  发现使用cert.pem，需要改为fullchain.pem"
        sed -i 's|ssl_certificate.*cert.pem|ssl_certificate '"$CERT_PATH/fullchain.pem"';|g' "$CONFIG_FILE"
    fi
    
    # 确保SSL配置正确
    if ! grep -q "ssl_trusted_certificate" "$CONFIG_FILE"; then
        echo "添加ssl_trusted_certificate配置..."
        sed -i '/ssl_certificate_key/a\    ssl_trusted_certificate '"$CERT_PATH/chain.pem"';' "$CONFIG_FILE"
    fi
else
    echo "❌ 配置文件不存在"
    exit 1
fi

# 测试Nginx配置
echo ""
echo "测试Nginx配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx配置测试通过"
    echo ""
    echo "重新加载Nginx..."
    /etc/init.d/nginx reload
    
    echo ""
    echo "=========================================="
    echo "✅ SSL配置已修复"
    echo "=========================================="
    echo ""
    echo "请等待几分钟后再次访问 https://$DOMAIN"
    echo "如果仍有问题，请清除浏览器缓存或使用隐私模式"
    echo ""
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi



