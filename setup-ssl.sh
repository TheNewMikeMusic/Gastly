#!/bin/bash
set -e

DOMAIN="hello1984.net"
EMAIL="admin@hello1984.net"  # 请修改为您的邮箱地址

echo "=========================================="
echo "配置SSL证书: $DOMAIN"
echo "=========================================="
echo ""

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 sudo 运行此脚本"
    exit 1
fi

# 检测系统类型
if [ -f /etc/redhat-release ]; then
    OS="centos"
elif [ -f /etc/debian_version ]; then
    OS="debian"
else
    OS="unknown"
fi

echo "检测到系统: $OS"
echo ""

# 安装certbot（如果未安装）
echo "📦 检查certbot..."
if ! command -v certbot &> /dev/null; then
    echo "安装certbot..."
    if [ "$OS" = "centos" ]; then
        yum install -y epel-release
        yum install -y certbot
    elif [ "$OS" = "debian" ]; then
        apt-get update
        DEBIAN_FRONTEND=noninteractive apt-get install -y certbot
    else
        echo "⚠️  无法自动检测系统类型，请手动安装certbot"
        exit 1
    fi
else
    echo "certbot已安装: $(certbot --version)"
fi

echo "✅ certbot准备就绪"
echo ""

# 确保Nginx配置目录存在
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# 检查Nginx配置
echo "🧪 测试当前Nginx配置..."
nginx -t

echo ""
echo "🔐 获取SSL证书..."
echo "提示: 如果这是第一次运行，certbot会询问您的邮箱地址"
echo ""

# 使用certbot standalone模式获取证书（不修改nginx配置）
echo "使用standalone模式获取证书..."
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL证书获取成功！"
    echo ""
    
    # 测试Nginx配置
    echo "🧪 测试更新后的Nginx配置..."
    nginx -t
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx配置测试通过"
        echo ""
        echo "🔄 重启Nginx服务..."
        systemctl reload nginx
        echo "✅ Nginx已重新加载"
    else
        echo "❌ Nginx配置测试失败"
        exit 1
    fi
    
    echo ""
    echo "=========================================="
    echo "✅ SSL证书配置完成！"
    echo "=========================================="
    echo ""
    echo "域名: $DOMAIN"
    echo "HTTPS: https://$DOMAIN"
    echo ""
    echo "证书位置:"
    echo "  证书: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
    echo "  私钥: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
    echo ""
    echo "证书自动续期:"
    echo "  certbot会自动续期证书（每90天）"
    echo "  测试续期: certbot renew --dry-run"
    echo ""
else
    echo ""
    echo "❌ SSL证书获取失败"
    echo "请检查："
    echo "1. 域名DNS是否正确解析到此服务器"
    echo "2. 防火墙是否开放80和443端口"
    echo "3. 域名是否可以正常访问（HTTP）"
    exit 1
fi

