#!/bin/bash
# 快速部署脚本 - 一键部署 Maclock 到服务器

set -e

echo "========================================"
echo "Maclock 快速部署脚本"
echo "========================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 执行完整部署
if [ -f "deploy-complete.sh" ]; then
    chmod +x deploy-complete.sh
    ./deploy-complete.sh
else
    echo "错误: 未找到 deploy-complete.sh"
    echo "请确保所有部署文件都已上传到服务器"
    exit 1
fi






