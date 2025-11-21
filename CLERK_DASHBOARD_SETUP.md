# Clerk Dashboard 配置指南

## 解决 401 Unauthorized 错误

当看到 `401 (Unauthorized)` 错误时，通常是因为你的域名/IP地址没有在 Clerk Dashboard 中配置为允许的来源。

## 步骤 1: 登录 Clerk Dashboard

1. 访问 [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. 使用你的 Clerk 账号登录
3. 选择你的应用（Application）

## 步骤 2: 找到 API Keys 设置

1. 在左侧菜单中找到 **"API Keys"** 或 **"Configure"**
2. 点击进入设置页面

## 步骤 3: 配置 Allowed Origins（允许的来源）

### 方法 A: 在 Frontend API 设置中

1. 找到 **"Frontend API"** 或 **"Allowed Origins"** 部分
2. 点击 **"Add Origin"** 或 **"Add Domain"**
3. 添加以下域名（根据你的实际情况选择）：

```
http://38.175.195.104:3000
http://38.175.195.104
```

如果使用 HTTPS：
```
https://38.175.195.104:3000
https://38.175.195.104
```

### 方法 B: 在 Path-based Routing 设置中

1. 找到 **"Path-based Routing"** 设置
2. 确保以下路径已配置：
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

## 步骤 4: 检查环境变量

确保你的服务器上的 `.env.local` 文件包含正确的 Clerk 密钥：

```bash
# 在服务器上运行
cd /var/www/maclock
cat .env.local | grep CLERK
```

应该看到类似：
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

## 步骤 5: 验证配置

1. 保存 Clerk Dashboard 中的设置
2. 等待几秒钟让配置生效
3. 清除浏览器缓存（Ctrl+Shift+Delete）
4. 重新访问 Sign In 页面

## 常见问题

### Q: 找不到 "Allowed Origins" 设置？

A: 在较新版本的 Clerk Dashboard 中，这个设置可能在：
- **Settings** → **Domains**
- **Configure** → **Frontend API**
- **Settings** → **API Keys** → **Frontend API**

### Q: 添加了域名但仍然 401？

A: 检查以下几点：
1. 确保域名格式正确（包含协议 `http://` 或 `https://`）
2. 如果使用端口，确保包含端口号（如 `:3000`）
3. 等待几分钟让配置生效
4. 清除浏览器缓存并重新加载

### Q: 开发环境 vs 生产环境

A: Clerk 有两个环境：
- **Development**: 使用 `pk_test_` 开头的密钥
- **Production**: 使用 `pk_live_` 开头的密钥

确保在对应的环境中配置域名。

## 快速检查清单

- [ ] 已登录 Clerk Dashboard
- [ ] 已找到并打开应用设置
- [ ] 已添加 `http://38.175.195.104:3000` 到允许的来源
- [ ] 已检查环境变量是否正确
- [ ] 已保存设置并等待生效
- [ ] 已清除浏览器缓存
- [ ] 已重新测试 Sign In 页面

## 如果仍然有问题

如果配置后仍然出现 401 错误，请检查：

1. **浏览器控制台**：查看是否有其他错误信息
2. **网络请求**：在 Network 标签页中查看 Clerk API 请求的详细信息
3. **Clerk 日志**：在 Clerk Dashboard 中查看应用日志
4. **环境变量**：确认服务器上的 `.env.local` 文件包含正确的密钥

## 参考链接

- [Clerk 文档 - Allowed Origins](https://clerk.com/docs/references/backend-api/overview#allowed-origins)
- [Clerk 文档 - Frontend API](https://clerk.com/docs/references/frontend-api/overview)
- [Clerk 文档 - 部署指南](https://clerk.com/docs/deployments/overview)


