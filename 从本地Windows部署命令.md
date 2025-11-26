# 从本地 Windows 部署到服务器

## 服务器信息
- **目标服务器 IP**: 38.175.195.104
- **用户名**: root
- **密码**: 0iHSn3CpCpDmlkub

## 在 Windows WSL 或 Git Bash 中执行

### 步骤 1: 准备文件（如果 deploy-temp 不存在）

```bash
# 进入项目目录
cd /mnt/c/Users/apple/Documents/Maclock

# 创建部署目录
mkdir -p deploy-temp

# 复制文件（排除不需要的）
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
    ./ deploy-temp/
```

### 步骤 2: 上传文件到服务器

```bash
# 上传所有文件
sshpass -p '0iHSn3CpCpDmlkub' scp -r -o StrictHostKeyChecking=no deploy-temp/* root@38.175.195.104:/var/www/maclock/

# 上传部署脚本
sshpass -p '0iHSn3CpCpDmlkub' scp -o StrictHostKeyChecking=no deploy-complete.sh root@38.175.195.104:/var/www/maclock/
```

### 步骤 3: 执行部署

```bash
sshpass -p '0iHSn3CpCpDmlkub' ssh -o StrictHostKeyChecking=no root@38.175.195.104 'cd /var/www/maclock && chmod +x deploy-complete.sh && npm install && ./deploy-complete.sh'
```

## 一键部署命令（复制粘贴执行）

```bash
cd /mnt/c/Users/apple/Documents/Maclock && \
mkdir -p deploy-temp && \
rsync -av --progress --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude 'deploy-temp' --exclude 'Maclock' --exclude '.env.local' --exclude '.env' --exclude '*.log' --exclude '.DS_Store' --exclude 'tsconfig.tsbuildinfo' ./ deploy-temp/ && \
sshpass -p '0iHSn3CpCpDmlkub' scp -r -o StrictHostKeyChecking=no deploy-temp/* root@38.175.195.104:/var/www/maclock/ && \
sshpass -p '0iHSn3CpCpDmlkub' scp -o StrictHostKeyChecking=no deploy-complete.sh root@38.175.195.104:/var/www/maclock/ && \
sshpass -p '0iHSn3CpCpDmlkub' ssh -o StrictHostKeyChecking=no root@38.175.195.104 'cd /var/www/maclock && chmod +x deploy-complete.sh && npm install && ./deploy-complete.sh'
```

## 如果 deploy-temp 已存在（直接上传）

```bash
cd /mnt/c/Users/apple/Documents/Maclock && \
sshpass -p '0iHSn3CpCpDmlkub' scp -r -o StrictHostKeyChecking=no deploy-temp/* root@38.175.195.104:/var/www/maclock/ && \
sshpass -p '0iHSn3CpCpDmlkub' scp -o StrictHostKeyChecking=no deploy-complete.sh root@38.175.195.104:/var/www/maclock/ && \
sshpass -p '0iHSn3CpCpDmlkub' ssh -o StrictHostKeyChecking=no root@38.175.195.104 'cd /var/www/maclock && chmod +x deploy-complete.sh && npm install && ./deploy-complete.sh'
```

## 使用 tar 压缩上传（更快，适合大文件）

```bash
cd /mnt/c/Users/apple/Documents/Maclock && \
tar -czf deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='deploy-temp' \
    --exclude='Maclock' \
    --exclude='.env.local' \
    --exclude='.env' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='tsconfig.tsbuildinfo' \
    . && \
sshpass -p '0iHSn3CpCpDmlkub' scp -o StrictHostKeyChecking=no deploy.tar.gz root@38.175.195.104:/var/www/maclock/ && \
sshpass -p '0iHSn3CpCpDmlkub' scp -o StrictHostKeyChecking=no deploy-complete.sh root@38.175.195.104:/var/www/maclock/ && \
sshpass -p '0iHSn3CpCpDmlkub' ssh -o StrictHostKeyChecking=no root@38.175.195.104 'cd /var/www/maclock && tar -xzf deploy.tar.gz && rm deploy.tar.gz && chmod +x deploy-complete.sh && npm install && ./deploy-complete.sh' && \
rm deploy.tar.gz
```

