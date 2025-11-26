#!/bin/bash

echo "=== 修复 ChunkLoadError ==="
echo ""

cd /var/www/maclock

echo "1. 停止PM2进程..."
pm2 stop maclock || true
pm2 delete maclock || true

echo ""
echo "2. 清理所有构建文件和缓存..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache 2>/dev/null || true

echo ""
echo "3. 检查.next目录是否已删除..."
if [ -d ".next" ]; then
    echo "警告：.next目录仍然存在，强制删除..."
    sudo rm -rf .next
fi

echo ""
echo "4. 重新构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！请检查错误信息。"
    exit 1
fi

echo ""
echo "5. 验证构建文件..."
if [ ! -d ".next" ]; then
    echo "❌ .next目录不存在，构建失败！"
    exit 1
fi

echo "✅ 构建文件已生成"

echo ""
echo "6. 检查admin/login页面chunk文件..."
if [ -f ".next/static/chunks/app/admin/login/page-*.js" ] || find .next/static/chunks -name "*admin*login*" -type f | grep -q .; then
    echo "✅ admin/login chunk文件存在"
else
    echo "⚠️  警告：未找到admin/login chunk文件"
fi

echo ""
echo "7. 启动PM2进程..."
pm2 start npm --name "maclock" -- start
pm2 save

echo ""
echo "8. 等待服务启动..."
sleep 5

echo ""
echo "9. 检查PM2状态..."
pm2 list

echo ""
echo "10. 检查端口3000..."
netstat -tlnp | grep 3000 || ss -tlnp | grep 3000

echo ""
echo "11. 查看PM2日志（最后20行）..."
pm2 logs maclock --lines 20 --nostream

echo ""
echo "=== 修复完成 ==="
echo ""
echo "请清除浏览器缓存并重新测试："
echo "1. 按 Ctrl+Shift+Delete 清除缓存"
echo "2. 或使用无痕模式（Ctrl+Shift+N）"
echo "3. 访问: http://38.175.195.104:3000/admin/login"





