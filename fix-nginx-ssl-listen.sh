#!/bin/bash

CONFIG_FILE="/www/server/nginx/conf/vhost/hello1984.net.conf"

echo "=========================================="
echo "修复Nginx SSL监听问题"
echo "=========================================="
echo ""

echo "1. 备份当前配置..."
cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"

echo ""
echo "2. 检查当前443配置..."
grep -A 2 "listen.*443" "$CONFIG_FILE"

echo ""
echo "3. 修复配置 - 确保443端口正确配置..."

# 读取配置文件
CONFIG_CONTENT=$(cat "$CONFIG_FILE")

# 检查是否有http2在listen后面（语法可能有问题）
if echo "$CONFIG_CONTENT" | grep -q "listen 443 ssl http2"; then
    echo "发现 http2 在 listen 行，可能需要调整..."
    # 宝塔的Nginx可能不支持这种语法，需要分开
    sed -i 's/listen 443 ssl http2 default_server;/listen 443 ssl default_server;\n    http2 on;/g' "$CONFIG_FILE"
    sed -i 's/listen \[::\]:443 ssl http2 default_server;/listen [::]:443 ssl default_server;\n    http2 on;/g' "$CONFIG_FILE"
    echo "✅ 已修复http2配置"
fi

echo ""
echo "4. 检查修复后的配置..."
grep -A 3 "listen.*443" "$CONFIG_FILE"

echo ""
echo "5. 测试配置..."
/www/server/nginx/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "✅ 配置测试通过"
    echo ""
    echo "6. 重新加载Nginx..."
    /etc/init.d/nginx reload
    sleep 2
    
    echo ""
    echo "7. 检查443端口..."
    netstat -tlnp 2>/dev/null | grep 443 || ss -tlnp 2>/dev/null | grep 443
    
    if netstat -tlnp 2>/dev/null | grep -q 443 || ss -tlnp 2>/dev/null | grep -q 443; then
        echo "✅ 443端口已监听"
    else
        echo "⚠️  443端口仍未监听，尝试完全重启..."
        /etc/init.d/nginx stop
        sleep 2
        /etc/init.d/nginx start
        sleep 3
        netstat -tlnp 2>/dev/null | grep 443 || ss -tlnp 2>/dev/null | grep 443
    fi
else
    echo "❌ 配置测试失败"
    echo "恢复备份..."
    cp "$CONFIG_FILE.backup."* "$CONFIG_FILE" 2>/dev/null
    exit 1
fi

echo ""
echo "=========================================="
echo "完成"
echo "=========================================="



