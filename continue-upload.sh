#!/bin/bash
# 继续上传文件到服务器（使用 scp）

set +e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# 服务器配置
SERVER_IP="38.175.195.104"
USERNAME="root"
PASSWORD="0iHSn3CpCpDmlkub"
SERVER_PATH="/var/www/maclock"
DEPLOY_DIR="deploy-temp"

echo -e "${CYAN}========================================"
echo -e "继续上传文件到服务器"
echo -e "========================================${NC}"
echo ""

# 检查部署目录是否存在
if [ ! -d "$DEPLOY_DIR" ]; then
    echo -e "${RED}错误: 部署目录不存在${NC}"
    echo -e "${YELLOW}请先运行: bash deploy-with-sshpass.sh${NC}"
    exit 1
fi

# 上传文件到服务器
echo -e "${YELLOW}正在上传文件到服务器...${NC}"
echo -e "${YELLOW}这可能需要几分钟时间，请耐心等待...${NC}"
echo ""

# 使用 scp 上传
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "$DEPLOY_DIR"/* "${USERNAME}@${SERVER_IP}:${SERVER_PATH}/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 文件上传完成${NC}"
    echo ""
    
    # 上传部署脚本
    if [ -f "deploy-complete.sh" ]; then
        echo -e "${YELLOW}上传部署脚本...${NC}"
        sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "deploy-complete.sh" "${USERNAME}@${SERVER_IP}:${SERVER_PATH}/"
    fi
    
    echo ""
    echo -e "${YELLOW}步骤 5: 在服务器上执行部署...${NC}"
    
    # 执行部署命令
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "${USERNAME}@${SERVER_IP}" << EOF
        cd ${SERVER_PATH}
        chmod +x deploy-complete.sh 2>/dev/null || true
        chmod +x quick-deploy.sh 2>/dev/null || true
        
        # 安装依赖（如果需要）
        if [ ! -d "node_modules" ]; then
            echo "安装依赖..."
            npm install
        else
            echo "更新依赖..."
            npm install
        fi
        
        # 执行部署脚本
        if [ -f "deploy-complete.sh" ]; then
            ./deploy-complete.sh
        elif [ -f "quick-deploy.sh" ]; then
            ./quick-deploy.sh
        else
            echo "未找到部署脚本，执行基本部署..."
            rm -rf .next
            npm run build
            pm2 restart maclock || pm2 start npm --name maclock -- start
        fi
EOF
    
    echo ""
    echo -e "${GREEN}========================================"
    echo -e "部署完成！"
    echo -e "========================================${NC}"
    echo ""
    echo -e "${CYAN}服务器信息:${NC}"
    echo -e "  IP: ${SERVER_IP}"
    echo -e "  路径: ${SERVER_PATH}"
    echo ""
    echo -e "${YELLOW}检查服务状态:${NC}"
    echo -e "  sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER_IP} 'pm2 status'"
    echo ""
else
    echo -e "${RED}✗ 文件上传失败${NC}"
    exit 1
fi

