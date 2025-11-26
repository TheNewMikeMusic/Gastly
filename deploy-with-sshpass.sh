#!/bin/bash
# 使用 sshpass 部署 Maclock 到服务器

# 不使用 set -e，以便更好地处理错误
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

echo -e "${CYAN}========================================"
echo -e "Maclock 项目部署脚本 (使用 sshpass)"
echo -e "========================================${NC}"
echo ""

# 检查 sshpass 是否安装
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}错误: sshpass 未安装${NC}"
    echo -e "${YELLOW}请先安装 sshpass:${NC}"
    echo "  Ubuntu/Debian: sudo apt-get install sshpass"
    echo "  macOS: brew install hudochenkov/sshpass/sshpass"
    echo "  Windows (Git Bash): 请使用 WSL 或安装 sshpass"
    exit 1
fi

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 请在项目根目录执行此脚本${NC}"
    exit 1
fi

# 创建临时部署目录
echo -e "${YELLOW}步骤 1: 准备部署文件...${NC}"
DEPLOY_DIR="deploy-temp"
if [ -d "$DEPLOY_DIR" ]; then
    rm -rf "$DEPLOY_DIR"
fi
mkdir -p "$DEPLOY_DIR"

# 复制必要的文件（排除不需要的文件）
echo -e "${YELLOW}复制项目文件...${NC}"

# 使用 find 和 cp 来复制文件（不依赖 rsync）
if command -v rsync &> /dev/null; then
    rsync -av --progress \
        --exclude 'node_modules' \
        --exclude '.next' \
        --exclude '.git' \
        --exclude 'deploy-temp' \
        --exclude 'Maclock' \
        --exclude '.env.local' \
        --exclude '.env' \
        --exclude '*.log' \
        --exclude '.DS_Store' \
        --exclude 'tsconfig.tsbuildinfo' \
        ./ "$DEPLOY_DIR/"
else
    # 使用 find + cp 作为备选方案
    echo -e "${YELLOW}使用 find + cp 复制文件...${NC}"
    find . -type f \
        ! -path "*/node_modules/*" \
        ! -path "*/.next/*" \
        ! -path "*/.git/*" \
        ! -path "*/deploy-temp/*" \
        ! -path "*/Maclock/*" \
        ! -name ".env.local" \
        ! -name ".env" \
        ! -name "*.log" \
        ! -name ".DS_Store" \
        ! -name "tsconfig.tsbuildinfo" \
        -exec sh -c 'mkdir -p "$(dirname "$2")" && cp "$1" "$2"' _ {} "$DEPLOY_DIR/{}" \;
fi

echo -e "${GREEN}✓ 文件准备完成${NC}"
echo ""

# 测试 SSH 连接
echo -e "${YELLOW}步骤 2: 测试服务器连接...${NC}"
if sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${USERNAME}@${SERVER_IP}" "echo '连接成功'" 2>/dev/null; then
    echo -e "${GREEN}✓ 服务器连接成功${NC}"
else
    echo -e "${RED}✗ 无法连接到服务器${NC}"
    exit 1
fi
echo ""

# 创建服务器目录
echo -e "${YELLOW}步骤 3: 创建服务器目录...${NC}"
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "${USERNAME}@${SERVER_IP}" "mkdir -p ${SERVER_PATH}"
echo -e "${GREEN}✓ 目录创建完成${NC}"
echo ""

# 上传文件到服务器
echo -e "${YELLOW}步骤 4: 上传文件到服务器...${NC}"
echo -e "${YELLOW}这可能需要几分钟时间，请耐心等待...${NC}"

# 检查服务器端是否安装了 rsync
USE_RSYNC=false
if command -v rsync &> /dev/null; then
    if sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 "${USERNAME}@${SERVER_IP}" "command -v rsync" &>/dev/null; then
        USE_RSYNC=true
        echo -e "${YELLOW}使用 rsync 上传（更快）...${NC}"
    else
        echo -e "${YELLOW}服务器未安装 rsync，使用 scp 上传...${NC}"
    fi
else
    echo -e "${YELLOW}本地未安装 rsync，使用 scp 上传...${NC}"
fi

# 上传文件
if [ "$USE_RSYNC" = true ]; then
    if sshpass -p "$PASSWORD" rsync -avz --progress \
        -e "ssh -o StrictHostKeyChecking=no" \
        "$DEPLOY_DIR/" "${USERNAME}@${SERVER_IP}:${SERVER_PATH}/" 2>&1; then
        echo -e "${GREEN}✓ 文件上传完成 (rsync)${NC}"
    else
        echo -e "${YELLOW}rsync 上传失败，改用 scp...${NC}"
        sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "$DEPLOY_DIR"/* "${USERNAME}@${SERVER_IP}:${SERVER_PATH}/"
        echo -e "${GREEN}✓ 文件上传完成 (scp)${NC}"
    fi
else
    # 使用 scp 上传
    sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "$DEPLOY_DIR"/* "${USERNAME}@${SERVER_IP}:${SERVER_PATH}/"
    echo -e "${GREEN}✓ 文件上传完成 (scp)${NC}"
fi

echo ""

# 清理临时目录
rm -rf "$DEPLOY_DIR"

# 在服务器上执行部署
echo -e "${YELLOW}步骤 5: 在服务器上执行部署...${NC}"

# 创建或更新部署脚本
DEPLOY_SCRIPT="deploy-complete.sh"
if [ -f "$DEPLOY_SCRIPT" ]; then
    echo -e "${YELLOW}上传部署脚本...${NC}"
    sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "$DEPLOY_SCRIPT" "${USERNAME}@${SERVER_IP}:${SERVER_PATH}/"
fi

# 执行部署命令
echo -e "${YELLOW}执行部署命令...${NC}"
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

