# Clerk 生产环境切换指南

## 当前状态

✅ **当前使用测试环境 Clerk 密钥**
- Publishable Key: `pk_test_Y2xlYXItYm9uZWZpc2gtNTcuY2xlcmsuYWNjb3VudHMuZGV2JA`
- Secret Key: `sk_test_aWhsAeYbuwRnZr2zSUoQMJzr92THReYzAZ64SHuLaG`
- 使用默认域名：`*.clerk.accounts.dev`
- ✅ 无需自定义域名配置，可以正常使用

## 切换到生产环境的步骤

### 1. 等待域名配置完成

域名负责人需要完成以下配置：

1. **DNS CNAME 记录**
   - 在域名注册商（如 Cloudflare、Namecheap 等）添加：
   - **Type**: CNAME
   - **Name**: `clerk`
   - **Value**: [Clerk Dashboard 提供的 CNAME 目标]
   - **TTL**: 3600（或自动）

2. **SSL 证书**
   - Clerk 会自动生成 SSL 证书
   - 等待 DNS 传播后，SSL 证书会自动生成（通常几分钟）

3. **验证配置**
   - 访问 `https://clerk.hello1984.net` 应该可以正常访问
   - 或者使用 `curl https://clerk.hello1984.net` 测试

### 2. 使用脚本切换

当 DNS 和 SSL 配置完成后，运行切换脚本：

```bash
# 设置服务器密码
export SERVER_PASSWORD='your_server_password'

# 运行切换脚本
./scripts/switch-to-production-clerk.sh
```

脚本会：
1. ✅ 备份当前配置
2. ✅ 更新为生产环境 Clerk 密钥
3. ✅ 重新构建应用
4. ✅ 重启 PM2 服务

### 3. 手动切换（可选）

如果不想使用脚本，可以手动更新：

```bash
# SSH 到服务器
ssh root@38.175.195.104

# 进入项目目录
cd /var/www/maclock

# 备份配置
cp .env.local .env.local.backup

# 更新 Clerk 密钥（请替换为您的实际密钥）
sed -i 's|^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY|' .env.local
sed -i 's|^CLERK_SECRET_KEY=.*|CLERK_SECRET_KEY=YOUR_SECRET_KEY|' .env.local

# 重新构建
rm -rf .next
npm run build

# 重启服务
pm2 restart maclock
```

## 生产环境密钥

- **Publishable Key**: `YOUR_PUBLISHABLE_KEY` (请从 Clerk Dashboard 获取)
- **Secret Key**: `YOUR_SECRET_KEY` (请从 Clerk Dashboard 获取)
- **自定义域名**: `clerk.hello1984.net`

## 验证切换成功

切换后，访问以下地址测试：

- https://hello1984.net/sign-in
- https://hello1984.net/sign-up

检查浏览器控制台：
- ✅ 应该看到 Clerk 从 `clerk.hello1984.net` 加载资源
- ✅ 不应该有 `ERR_CONNECTION_CLOSED` 错误
- ✅ 登录/注册功能应该正常工作

## 注意事项

⚠️ **重要提示**：
- 切换前必须确保 DNS 和 SSL 已正确配置
- 如果 DNS 未配置，会出现 `ERR_CONNECTION_CLOSED` 错误
- 如果 SSL 未生成，会出现 SSL 证书错误
- 建议在 DNS 配置完成后等待 10-15 分钟再切换

## 回退方案

如果切换后出现问题，可以快速回退到测试环境：

```bash
# 恢复备份的配置
ssh root@38.175.195.104
cd /var/www/maclock
cp .env.local.backup.YYYYMMDD_HHMMSS .env.local

# 重新构建并重启
rm -rf .next
npm run build
pm2 restart maclock
```

或者使用测试环境的密钥：

```bash
sed -i 's|^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlYXItYm9uZWZpc2gtNTcuY2xlcmsuYWNjb3VudHMuZGV2JA|' .env.local
sed -i 's|^CLERK_SECRET_KEY=.*|CLERK_SECRET_KEY=sk_test_aWhsAeYbuwRnZr2zSUoQMJzr92THReYzAZ64SHuLaG|' .env.local
```

