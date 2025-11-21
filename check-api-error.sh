#!/bin/bash

echo "========================================="
echo "检查API错误详情"
echo "========================================="

APP_DIR="/var/www/maclock"

cd "$APP_DIR" || { echo "错误: 无法进入应用目录"; exit 1; }

# 1. 检查PM2日志
echo "1. 检查PM2最近错误日志..."
pm2 logs maclock --lines 50 --nostream --err | tail -n 30
echo ""

# 2. 检查Next.js构建日志
echo "2. 检查构建错误..."
if [ -f ".next/trace" ]; then
    echo "找到trace文件，显示最后20行："
    tail -n 20 .next/trace
else
    echo "未找到trace文件"
fi
echo ""

# 3. 测试API并显示详细错误
echo "3. 测试API并显示详细响应..."
API_RESPONSE=$(curl -v "http://localhost:3000/api/inventory/check?productId=maclock-default&quantity=1" 2>&1)
echo "$API_RESPONSE"
echo ""

# 4. 检查API文件内容
echo "4. 检查API文件内容（前30行）..."
if [ -f "app/api/inventory/check/route.ts" ]; then
    head -n 30 app/api/inventory/check/route.ts
else
    echo "✗ API文件不存在！"
fi
echo ""

# 5. 检查数据库连接
echo "5. 检查环境变量..."
if [ -f ".env.local" ]; then
    echo "DATABASE_URL存在: $(grep -q DATABASE_URL .env.local && echo '是' || echo '否')"
    echo "NEXT_PUBLIC_URL: $(grep NEXT_PUBLIC_URL .env.local | head -n 1)"
else
    echo "✗ .env.local文件不存在"
fi
echo ""

# 6. 检查Node进程
echo "6. 检查Node进程..."
ps aux | grep -E "node|next" | grep -v grep | head -n 5
echo ""

echo "========================================="
echo "诊断完成"
echo "========================================="


