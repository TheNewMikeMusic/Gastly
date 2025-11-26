#!/bin/bash

echo "========================================="
echo "完整HTTPS修复脚本"
echo "========================================="

APP_DIR="/var/www/maclock"
ENV_FILE="$APP_DIR/.env.local"
IP_ADDRESS="38.175.195.104"

cd "$APP_DIR" || { echo "错误: 无法进入应用目录"; exit 1; }

# 1. 更新.env.local中的NEXT_PUBLIC_URL为HTTPS
echo "1. 更新.env.local中的NEXT_PUBLIC_URL为HTTPS..."
if [ -f "$ENV_FILE" ]; then
    # 备份原文件
    cp "$ENV_FILE" "${ENV_FILE}.bak.$(date +%Y%m%d%H%M%S)"
    
    # 更新NEXT_PUBLIC_URL
    if grep -q "NEXT_PUBLIC_URL=" "$ENV_FILE"; then
        # 替换所有HTTP为HTTPS
        sed -i 's|NEXT_PUBLIC_URL=http://|NEXT_PUBLIC_URL=https://|g' "$ENV_FILE"
        sed -i "s|NEXT_PUBLIC_URL=https://.*:3000|NEXT_PUBLIC_URL=https://$IP_ADDRESS|g" "$ENV_FILE"
        sed -i "s|NEXT_PUBLIC_URL=https://$IP_ADDRESS:3000|NEXT_PUBLIC_URL=https://$IP_ADDRESS|g" "$ENV_FILE"
        echo "✓ .env.local已更新为HTTPS"
    else
        echo "NEXT_PUBLIC_URL=https://$IP_ADDRESS" >> "$ENV_FILE"
        echo "✓ 已添加NEXT_PUBLIC_URL到.env.local"
    fi
    
    # 显示更新后的值
    echo "当前NEXT_PUBLIC_URL值:"
    grep "NEXT_PUBLIC_URL=" "$ENV_FILE" || echo "未找到NEXT_PUBLIC_URL"
else
    echo "✗ .env.local文件不存在，创建新文件..."
    echo "NEXT_PUBLIC_URL=https://$IP_ADDRESS" > "$ENV_FILE"
    echo "✓ 已创建.env.local文件"
fi

# 2. 停止PM2进程
echo ""
echo "2. 停止PM2进程..."
pm2 stop maclock &> /dev/null || true
pm2 delete maclock &> /dev/null || true
sleep 2
echo "✓ PM2进程已停止"

# 3. 清理旧的构建文件（可选，如果需要完全重建）
echo ""
echo "3. 检查构建文件..."
if [ ! -d ".next" ]; then
    echo "构建文件不存在，需要重新构建..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✓ 项目构建成功"
    else
        echo "✗ 项目构建失败"
        exit 1
    fi
else
    echo "✓ 构建文件存在，跳过构建"
fi

# 4. 启动PM2进程
echo ""
echo "4. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save
sleep 3
echo "✓ PM2进程已启动"

# 5. 检查应用状态
echo ""
echo "5. 检查应用状态..."
pm2 status maclock
echo ""

# 6. 测试HTTPS连接
echo "6. 测试HTTPS连接..."
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost/api/inventory/check?productId=maclock-default | grep -q "200\|404\|500"; then
    echo "✓ HTTPS连接正常（返回200/404/500都是正常的）"
else
    echo "⚠ HTTPS连接可能有问题，请检查"
fi

echo ""
echo "========================================="
echo "修复完成！"
echo ""
echo "重要提示："
echo "1. 请通过 HTTPS 访问: https://$IP_ADDRESS"
echo "2. 不要使用 HTTP: http://$IP_ADDRESS:3000"
echo "3. 首次访问HTTPS时，浏览器会显示安全警告（自签名证书），请手动接受"
echo "4. iOS设备需要信任证书：设置 → 通用 → 关于本机 → 证书信任设置"
echo "========================================="





