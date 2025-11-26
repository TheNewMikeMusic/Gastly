#!/bin/bash
# 检查宝塔面板Nginx配置

echo "=========================================="
echo "检查宝塔面板Nginx配置"
echo "=========================================="
echo ""

echo "1. 检查Nginx主配置目录:"
if [ -d "/www/server/nginx/conf" ]; then
    echo "✓ 找到宝塔Nginx配置目录"
    ls -la /www/server/nginx/conf/ | head -10
else
    echo "✗ 未找到宝塔Nginx配置目录"
fi
echo ""

echo "2. 检查站点配置目录:"
if [ -d "/www/server/panel/vhost/nginx" ]; then
    echo "✓ 找到站点配置目录"
    ls -la /www/server/panel/vhost/nginx/
else
    echo "✗ 未找到站点配置目录"
fi
echo ""

echo "3. 检查Nginx主配置文件:"
if [ -f "/www/server/nginx/conf/nginx.conf" ]; then
    echo "✓ 找到主配置文件"
    grep -E "include.*vhost|server_name" /www/server/nginx/conf/nginx.conf | head -5
else
    echo "✗ 未找到主配置文件"
fi
echo ""

echo "4. 检查当前监听端口:"
netstat -tuln | grep -E "(80|443|3000)" || echo "未找到相关端口"
echo ""

echo "5. 检查Nginx进程:"
ps aux | grep nginx | grep -v grep || echo "未找到Nginx进程"
echo ""

echo "6. 检查宝塔面板版本:"
if [ -f "/www/server/panel/BT-Panel" ]; then
    echo "✓ 检测到宝塔面板"
    cat /www/server/panel/class/common.py | grep "version" | head -1 || echo "无法获取版本"
else
    echo "✗ 未检测到宝塔面板"
fi
echo ""





