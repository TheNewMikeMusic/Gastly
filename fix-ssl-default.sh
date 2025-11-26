#!/bin/bash

DOMAIN="hello1984.net"
CONFIG_FILE="/www/server/nginx/conf/vhost/hello1984.net.conf"
NGINX_MAIN_CONF="/www/server/nginx/conf/nginx.conf"

echo "=========================================="
echo "修复SSL证书名称不匹配问题"
echo "=========================================="
echo ""

# 检查Nginx主配置文件
echo "1. 检查Nginx主配置文件..."
if grep -q "default_server" "$NGINX_MAIN_CONF"; then
    echo "⚠️  发现default_server配置，可能需要调整"
    grep -A 5 "default_server" "$NGINX_MAIN_CONF"
else
    echo "✅ 主配置文件中没有default_server"
fi

# 确保hello1984.net配置是默认的443配置
echo ""
echo "2. 更新hello1984.net配置，添加default_server..."
if ! grep -q "default_server" "$CONFIG_FILE"; then
    # 备份配置
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    
    # 添加default_server到443监听
    sed -i 's/listen 443 ssl http2;/listen 443 ssl http2 default_server;/g' "$CONFIG_FILE"
    sed -i 's/listen \[::\]:443 ssl http2;/listen [::]:443 ssl http2 default_server;/g' "$CONFIG_FILE"
    
    echo "✅ 已添加default_server到443端口"
else
    echo "✅ default_server已配置"
fi

# 检查是否有其他配置文件也在443端口
echo ""
echo "3. 检查其他443端口配置..."
OTHER_CONFIGS=$(find /www/server/nginx/conf/vhost/ -name "*.conf" ! -name "hello1984.net.conf" -exec grep -l "listen.*443" {} \; 2>/dev/null)

if [ -n "$OTHER_CONFIGS" ]; then
    echo "⚠️  发现其他443端口配置："
    echo "$OTHER_CONFIGS"
    echo ""
    echo "建议：移除这些配置中的default_server或禁用它们"
else
    echo "✅ 没有其他443端口配置"
fi

# 测试配置
echo ""
echo "4. 测试Nginx配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx配置测试通过"
    echo ""
    echo "5. 重新加载Nginx..."
    /etc/init.d/nginx reload
    echo "✅ Nginx已重新加载"
else
    echo "❌ Nginx配置测试失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ 配置已更新"
echo "=========================================="
echo ""
echo "请等待几分钟后再次测试SSL"
echo "访问: https://www.ssllabs.com/ssltest/analyze.html?d=hello1984.net"
echo ""



