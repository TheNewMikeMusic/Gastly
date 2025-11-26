#!/bin/bash

echo "========================================="
echo "重启Next.js应用以应用API修复"
echo "========================================="

cd /var/www/maclock || { echo "错误: 无法进入应用目录"; exit 1; }

# 停止PM2进程
echo "1. 停止PM2进程..."
pm2 stop maclock &> /dev/null || true
pm2 delete maclock &> /dev/null || true
echo "✓ PM2进程已停止"

# 重新构建（如果需要）
echo "2. 检查是否需要重新构建..."
if [ -d ".next" ]; then
    echo "✓ 构建文件存在，跳过构建"
else
    echo "构建文件不存在，正在构建..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✓ 项目构建成功"
    else
        echo "✗ 项目构建失败"
        exit 1
    fi
fi

# 启动PM2进程
echo "3. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save
echo "✓ PM2进程已启动"

echo "========================================="
echo "应用重启完成！"
echo "========================================="





