# Maclock 项目部署指南

## 服务器信息
- **IP地址**: 38.175.195.104
- **用户名**: root
- **密码**: 0iHSn3CpCpDmlkub

## 快速部署步骤

### 方法一：使用自动化脚本（推荐）

#### 1. 在本地准备部署文件

在 Windows PowerShell 中执行：

```powershell
.\deploy.ps1
```

这将：
- 创建临时部署目录
- 排除不必要的文件（node_modules, .next, .git 等）
- 准备上传文件

#### 2. 上传文件到服务器

**选项 A: 使用 WinSCP 或 FileZilla**
1. 连接到 `sftp://root@38.175.195.104`
2. 密码: `0iHSn3CpCpDmlkub`
3. 上传 `deploy-temp` 文件夹中的所有内容到 `/var/www/maclock/`

**选项 B: 使用 PowerShell SCP**
```powershell
scp -r deploy-temp/* root@38.175.195.104:/var/www/maclock/
```

**选项 C: 使用 Git（如果服务器已配置 Git）**
```bash
# 在服务器上执行
cd /var/www
git clone <your-repo-url> maclock
cd maclock
```

#### 3. SSH 连接到服务器并执行部署

```bash
ssh root@38.175.195.104
# 输入密码: 0iHSn3CpCpDmlkub
```

在服务器上执行：

```bash
cd /var/www/maclock
chmod +x deploy-complete.sh
./deploy-complete.sh
```

### 方法二：手动部署

#### 1. 连接到服务器

```bash
ssh root@38.175.195.104
```

#### 2. 安装系统依赖

```bash
# 更新系统
apt-get update

# 安装 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 Docker 和 Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### 3. 创建项目目录并上传文件

```bash
mkdir -p /var/www/maclock
cd /var/www/maclock
# 然后上传项目文件（使用 scp, sftp 或 git）
```

#### 4. 配置环境变量

```bash
cd /var/www/maclock
nano .env.local
```

添加以下环境变量：

```env
NODE_ENV=production
NEXT_PUBLIC_URL=http://38.175.195.104

# 数据库配置（使用 Docker Compose 中的 PostgreSQL）
DATABASE_URL=postgresql://maclock:maclock123@localhost:5432/maclock

# Stripe 配置
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

# Clerk 配置
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# 其他配置
RESEND_API_KEY=re_...
```

#### 5. 启动数据库

```bash
cd /var/www/maclock
docker-compose up -d
```

等待数据库就绪：

```bash
docker-compose exec postgres pg_isready -U maclock
```

#### 6. 安装依赖并构建

```bash
cd /var/www/maclock
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

#### 7. 启动应用

```bash
# 使用 PM2 启动
pm2 start npm --name maclock -- start
pm2 save
pm2 startup systemd -u root --hp /root
```

### 配置 Nginx 反向代理（可选但推荐）

#### 1. 安装 Nginx

```bash
apt-get install -y nginx
```

#### 2. 创建配置文件

```bash
nano /etc/nginx/sites-available/maclock
```

复制 `nginx.conf.example` 的内容到该文件。

#### 3. 启用站点

```bash
ln -s /etc/nginx/sites-available/maclock /etc/nginx/sites-enabled/
nginx -t  # 测试配置
systemctl restart nginx
```

#### 4. 配置防火墙

```bash
# 允许 HTTP 和 HTTPS
ufw allow 80/tcp
ufw allow 443/tcp
# 如果直接访问 3000 端口
ufw allow 3000/tcp
```

## 部署后检查

### 1. 检查服务状态

```bash
# PM2 状态
pm2 status
pm2 logs maclock

# Docker 容器状态
docker-compose ps

# Nginx 状态
systemctl status nginx
```

### 2. 检查应用是否运行

```bash
curl http://localhost:3000
```

### 3. 查看日志

```bash
# PM2 日志
pm2 logs maclock

# Nginx 日志
tail -f /var/log/nginx/maclock-access.log
tail -f /var/log/nginx/maclock-error.log

# Docker 日志
docker-compose logs postgres
```

## 常用维护命令

### 重启应用

```bash
pm2 restart maclock
```

### 更新代码

```bash
cd /var/www/maclock
# 拉取最新代码或上传新文件
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart maclock
```

### 查看资源使用

```bash
pm2 monit
htop
```

### 备份数据库

```bash
docker-compose exec postgres pg_dump -U maclock maclock > backup_$(date +%Y%m%d).sql
```

## 故障排除

### 应用无法启动

1. 检查环境变量是否正确配置
2. 检查数据库是否运行：`docker-compose ps`
3. 查看 PM2 日志：`pm2 logs maclock`
4. 检查端口是否被占用：`netstat -tulpn | grep 3000`

### 数据库连接失败

1. 检查数据库容器状态：`docker-compose ps`
2. 检查 DATABASE_URL 环境变量
3. 测试连接：`docker-compose exec postgres psql -U maclock -d maclock`

### 构建失败

1. 检查 Node.js 版本：`node -v`（需要 18+）
2. 清理缓存：`rm -rf node_modules .next`
3. 重新安装：`npm install`

## 安全建议

1. **更改默认密码**：部署后立即更改 root 密码
2. **配置防火墙**：只开放必要的端口
3. **使用 HTTPS**：配置 SSL 证书（Let's Encrypt）
4. **定期更新**：保持系统和依赖包更新
5. **备份数据**：定期备份数据库
6. **监控日志**：定期检查应用和系统日志

## 支持

如有问题，请检查：
- PM2 日志：`pm2 logs maclock`
- Next.js 构建日志
- 数据库连接状态
- 环境变量配置

