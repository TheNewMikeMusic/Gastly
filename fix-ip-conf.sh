#!/bin/bash

IP_CONF="/www/server/panel/vhost/nginx/38.175.195.104.conf"
DOMAIN="hello1984.net"

echo "=========================================="
echo "修复IP地址配置文件"
echo "=========================================="
echo ""

if [ -f "$IP_CONF" ]; then
    echo "发现IP配置文件: $IP_CONF"
    echo ""
    echo "当前内容："
    cat "$IP_CONF"
    echo ""
    
    # 备份
    cp "$IP_CONF" "$IP_CONF.backup.$(date +%Y%m%d_%H%M%S)"
    
    # 检查是否有443端口配置
    if grep -q "listen.*443" "$IP_CONF"; then
        echo "⚠️  发现443端口配置，这可能会覆盖域名配置"
        echo ""
        echo "选项1: 禁用443端口配置（推荐）"
        echo "选项2: 更新为使用正确的证书"
        echo ""
        
        # 注释掉443端口的配置
        sed -i 's/^[^#]*listen.*443/# &/' "$IP_CONF"
        sed -i 's/^[^#]*ssl_certificate/# &/' "$IP_CONF"
        sed -i 's/^[^#]*ssl_certificate_key/# &/' "$IP_CONF"
        
        echo "✅ 已注释掉IP配置中的443端口和SSL配置"
    else
        echo "✅ IP配置文件中没有443端口配置"
    fi
    
    echo ""
    echo "更新后的内容："
    cat "$IP_CONF"
else
    echo "✅ IP配置文件不存在"
fi

echo ""
echo "测试Nginx配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx配置测试通过"
    echo ""
    echo "重新加载Nginx..."
    /etc/init.d/nginx reload
    echo "✅ Nginx已重新加载"
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 配置已修复"
echo "=========================================="
echo ""
echo "请等待几分钟后测试SSL"
echo ""



