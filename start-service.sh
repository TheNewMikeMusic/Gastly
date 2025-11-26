#!/bin/bash
# 启动应用服务

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}启动应用服务...${NC}"
echo ""

# 停止现有服务（如果存在）
if pm2 list | grep -q "maclock"; then
    echo -e "${YELLOW}停止现有服务...${NC}"
    pm2 stop maclock || true
    pm2 delete maclock || true
fi

# 启动服务
echo -e "${YELLOW}启动 PM2 服务...${NC}"
pm2 start npm --name maclock -- start
pm2 save || true

# 设置开机自启
pm2 startup systemd -u root --hp /root || true

echo ""
echo -e "${GREEN}========================================"
echo -e "服务启动完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${GREEN}服务状态:${NC}"
pm2 list
echo ""
echo -e "${GREEN}常用命令:${NC}"
echo "  查看日志: pm2 logs maclock"
echo "  实时日志: pm2 logs maclock --lines 50"
echo "  重启服务: pm2 restart maclock"
echo "  停止服务: pm2 stop maclock"
echo "  查看状态: pm2 status"
echo ""
echo -e "${YELLOW}应用访问地址:${NC}"
echo "  http://38.175.195.104:3000"
echo ""
echo -e "${YELLOW}注意:${NC}"
echo "  1. 确保防火墙已开放端口 3000"
echo "  2. 如需使用域名，请配置 Nginx 反向代理"
echo "  3. 记得更新 .env.local 中的 API 密钥"
echo ""






