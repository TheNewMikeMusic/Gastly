#!/bin/bash
# 修复网络访问问题

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}检查网络访问配置...${NC}"
echo ""

# 1. 检查端口监听
echo -e "${YELLOW}[1] 检查端口 3000 是否监听...${NC}"
if netstat -tulpn | grep -q ":3000"; then
    echo -e "${GREEN}✓ 端口 3000 正在监听${NC}"
    netstat -tulpn | grep ":3000"
else
    echo -e "${RED}✗ 端口 3000 未监听${NC}"
fi
echo ""

# 2. 检查防火墙状态
echo -e "${YELLOW}[2] 检查防火墙状态...${NC}"
if command -v ufw > /dev/null; then
    ufw status
    if ufw status | grep -q "3000"; then
        echo -e "${GREEN}✓ 端口 3000 已在防火墙规则中${NC}"
    else
        echo -e "${YELLOW}⚠ 端口 3000 未在防火墙规则中，正在添加...${NC}"
        ufw allow 3000/tcp
        ufw reload
    fi
else
    echo -e "${YELLOW}⚠ ufw 未安装，检查 iptables...${NC}"
    if iptables -L -n | grep -q "3000"; then
        echo -e "${GREEN}✓ 端口 3000 已在 iptables 规则中${NC}"
    else
        echo -e "${YELLOW}⚠ 添加 iptables 规则...${NC}"
        iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
        iptables-save > /etc/iptables/rules.v4 2>/dev/null || echo "注意: 需要手动保存 iptables 规则"
    fi
fi
echo ""

# 3. 检查 Next.js 绑定地址
echo -e "${YELLOW}[3] 检查 Next.js 绑定地址...${NC}"
echo -e "${YELLOW}Next.js 默认只绑定 localhost，需要绑定到 0.0.0.0${NC}"
echo ""

# 4. 重启服务以绑定到 0.0.0.0
echo -e "${YELLOW}[4] 重启服务并绑定到 0.0.0.0...${NC}"
cd /var/www/maclock

# 修改 package.json 的 start 命令
if ! grep -q "HOSTNAME=0.0.0.0" package.json; then
    echo -e "${YELLOW}更新启动命令以绑定到所有网络接口...${NC}"
    # 备份 package.json
    cp package.json package.json.bak
    
    # 修改 start 命令
    sed -i 's/"start": "next start"/"start": "HOSTNAME=0.0.0.0 next start"/' package.json || {
        # 如果 sed 失败，使用 node 修改
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts.start = 'HOSTNAME=0.0.0.0 next start';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
        "
    }
fi

# 重启服务
pm2 restart maclock

echo ""
echo -e "${GREEN}等待服务启动...${NC}"
sleep 3

# 5. 再次检查端口
echo -e "${YELLOW}[5] 再次检查端口监听...${NC}"
if netstat -tulpn | grep -q ":3000.*0.0.0.0"; then
    echo -e "${GREEN}✓ 端口已绑定到 0.0.0.0:3000${NC}"
    netstat -tulpn | grep ":3000"
else
    echo -e "${YELLOW}检查监听状态...${NC}"
    netstat -tulpn | grep ":3000" || ss -tulpn | grep ":3000"
fi
echo ""

# 6. 测试本地访问
echo -e "${YELLOW}[6] 测试本地访问...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ 本地访问正常${NC}"
else
    echo -e "${RED}✗ 本地访问失败${NC}"
fi
echo ""

# 7. 检查服务器提供商的安全组（提示）
echo -e "${YELLOW}[7] 重要提示:${NC}"
echo -e "${YELLOW}如果仍然无法访问，请检查：${NC}"
echo "  1. 服务器提供商的安全组/防火墙规则（如阿里云、腾讯云等）"
echo "  2. 确保端口 3000 已在安全组中开放"
echo "  3. 检查服务器是否在 NAT 后面"
echo ""

echo -e "${GREEN}========================================"
echo -e "网络配置检查完成"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}如果问题仍然存在，请检查：${NC}"
echo "  1. 服务器提供商的安全组设置"
echo "  2. 云服务器的网络 ACL 规则"
echo "  3. 服务器是否在私有网络中"
echo ""


