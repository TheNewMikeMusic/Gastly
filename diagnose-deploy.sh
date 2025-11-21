#!/bin/bash
# 诊断部署问题

echo "========================================"
echo "诊断部署问题"
echo "========================================"
echo ""

echo "1. 检查当前进程..."
ps aux | grep -E "(apt|deploy|node|npm)" | grep -v grep
echo ""

echo "2. 检查网络连接..."
ping -c 2 deb.nodesource.com > /dev/null 2>&1 && echo "✓ 可以访问 NodeSource" || echo "✗ 无法访问 NodeSource"
ping -c 2 get.docker.com > /dev/null 2>&1 && echo "✓ 可以访问 Docker" || echo "✗ 无法访问 Docker"
echo ""

echo "3. 检查已安装的软件..."
command -v node > /dev/null && echo "✓ Node.js: $(node -v)" || echo "✗ Node.js 未安装"
command -v npm > /dev/null && echo "✓ npm: $(npm -v)" || echo "✗ npm 未安装"
command -v pm2 > /dev/null && echo "✓ PM2: $(pm2 -v)" || echo "✗ PM2 未安装"
command -v docker > /dev/null && echo "✓ Docker: $(docker --version)" || echo "✗ Docker 未安装"
command -v docker-compose > /dev/null && echo "✓ Docker Compose: $(docker-compose --version)" || echo "✗ Docker Compose 未安装"
echo ""

echo "4. 检查项目目录..."
cd /var/www/maclock && echo "✓ 项目目录存在" || echo "✗ 项目目录不存在"
ls -la | head -10
echo ""

echo "5. 检查 apt-get 状态..."
if pgrep -x apt-get > /dev/null; then
    echo "⚠ apt-get 正在运行中，请等待..."
else
    echo "✓ apt-get 未运行"
fi
echo ""

echo "诊断完成！"



