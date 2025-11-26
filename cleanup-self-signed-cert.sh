#!/bin/bash

echo "=========================================="
echo "清理自签名证书影响"
echo "=========================================="
echo ""

IP_CONF="/www/server/panel/vhost/nginx/38.175.195.104.conf"
DOMAIN_CONF="/www/server/panel/vhost/nginx/hello1984.net.conf"
SELF_SIGNED_CERT="/www/server/nginx/conf/ssl/maclock.crt"
SELF_SIGNED_KEY="/www/server/nginx/conf/ssl/maclock.key"

echo "1. 检查IP配置文件..."
if [ -f "$IP_CONF" ]; then
    echo "发现IP配置文件，完全禁用443端口配置..."
    
    # 备份
    cp "$IP_CONF" "$IP_CONF.backup.$(date +%Y%m%d_%H%M%S)"
    
    # 完全禁用HTTPS server块或删除整个文件
    # 选项1: 重命名文件（推荐，保留备份）
    mv "$IP_CONF" "$IP_CONF.disabled"
    echo "✅ IP配置文件已禁用（重命名为 .disabled）"
else
    echo "✅ IP配置文件不存在或已禁用"
fi

echo ""
echo "2. 检查自签名证书文件..."
if [ -f "$SELF_SIGNED_CERT" ]; then
    echo "发现自签名证书文件: $SELF_SIGNED_CERT"
    echo "备份并重命名..."
    mv "$SELF_SIGNED_CERT" "${SELF_SIGNED_CERT}.disabled" 2>/dev/null
    echo "✅ 自签名证书已禁用"
fi

if [ -f "$SELF_SIGNED_KEY" ]; then
    echo "发现自签名私钥文件: $SELF_SIGNED_KEY"
    mv "$SELF_SIGNED_KEY" "${SELF_SIGNED_KEY}.disabled" 2>/dev/null
    echo "✅ 自签名私钥已禁用"
fi

echo ""
echo "3. 检查域名配置..."
if [ -f "$DOMAIN_CONF" ]; then
    echo "✅ 域名配置文件存在"
    echo "检查SSL证书配置..."
    grep -A 2 "ssl_certificate" "$DOMAIN_CONF" | head -5
    
    # 确保使用Let's Encrypt证书
    if grep -q "letsencrypt" "$DOMAIN_CONF"; then
        echo "✅ 使用Let's Encrypt证书"
    else
        echo "⚠️  未找到Let's Encrypt证书配置"
    fi
else
    echo "❌ 域名配置文件不存在"
fi

echo ""
echo "4. 检查所有443端口配置..."
echo "查找所有包含443端口的配置..."
find /www/server/panel/vhost/nginx/ -name "*.conf" -exec grep -l "listen.*443" {} \; 2>/dev/null

echo ""
echo "5. 测试Nginx配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx配置测试通过"
    echo ""
    echo "6. 重新加载Nginx..."
    /etc/init.d/nginx reload
    sleep 2
    
    echo ""
    echo "7. 验证SSL证书..."
    echo | openssl s_client -connect hello1984.net:443 -servername hello1984.net 2>&1 | grep -A 3 "subject=" | head -5
    
    echo ""
    echo "8. 检查端口监听..."
    netstat -tlnp 2>/dev/null | grep 443 || ss -tlnp 2>/dev/null | grep 443
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 清理完成"
echo "=========================================="
echo ""
echo "请清除浏览器缓存或使用隐私模式访问 https://hello1984.net"
echo ""



