# Clerk 配置修复指南

## 问题症状
- "Checking availability" 卡住
- 502 Bad Gateway
- 谷歌登录不好用
- Clerk 无限重定向循环

## 已修复的问题

### 1. 库存检查超时
- ✅ 添加了 5 秒超时处理
- ✅ StockStatus 组件添加了请求超时和错误处理
- ✅ API 路由添加了超时保护

### 2. Middleware 修复
- ✅ 修复了 Clerk 保护逻辑，避免无限重定向
- ✅ API 路由不再被 Clerk 保护
- ✅ 添加了错误处理

### 3. PM2 配置修复
- ✅ 修复了工作目录配置

## Clerk 配置检查清单

### 1. 检查 Clerk Dashboard 配置

访问 https://dashboard.clerk.com 并检查：

#### A. API Keys
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 必须匹配 Dashboard 中的 Publishable Key
- ✅ `CLERK_SECRET_KEY` 必须匹配 Dashboard 中的 Secret Key
- ⚠️ 确保两个密钥来自同一个 Clerk 应用实例

#### B. Allowed Origins（允许来源）
在 Clerk Dashboard → Settings → Domains 中添加：
- ✅ `http://38.175.195.104:3000`
- ✅ `https://38.175.195.104`（如果使用 HTTPS）
- ✅ `http://localhost:3000`（开发环境）

#### C. OAuth 配置（Google 登录）
在 Clerk Dashboard → User & Authentication → Social Connections：
- ✅ 启用 Google OAuth
- ✅ 配置 Google OAuth Client ID 和 Secret
- ✅ 添加回调 URL：
  - `http://38.175.195.104:3000/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`（开发环境）

#### D. Redirect URLs
在 Clerk Dashboard → Settings → Paths：
- ✅ Sign-in URL: `/sign-in`
- ✅ Sign-up URL: `/sign-in`
- ✅ After sign-in URL: `/`
- ✅ After sign-up URL: `/`

### 2. 服务器环境变量检查

确保服务器上的 `.env.local` 包含：

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. 常见问题排查

#### 问题 1: 无限重定向循环
**原因**: Clerk 密钥不匹配或允许来源未配置

**解决方案**:
1. 检查服务器上的 Clerk 密钥是否与 Dashboard 一致
2. 在 Clerk Dashboard 中添加服务器域名到允许来源
3. 清除浏览器 Cookie 和缓存

#### 问题 2: Google 登录不工作
**原因**: OAuth 回调 URL 未配置或 Google OAuth 未启用

**解决方案**:
1. 在 Clerk Dashboard 中启用 Google OAuth
2. 配置 Google OAuth Client ID 和 Secret
3. 添加正确的回调 URL

#### 问题 3: 502 Bad Gateway
**原因**: 服务崩溃或超时

**解决方案**:
1. 检查 PM2 状态: `pm2 status`
2. 查看日志: `pm2 logs maclock`
3. 重启服务: `pm2 restart maclock`

## 验证步骤

1. **检查服务状态**
   ```bash
   ssh root@38.175.195.104
   pm2 status
   pm2 logs maclock --lines 50
   ```

2. **测试网站访问**
   - 访问 http://38.175.195.104:3000
   - 确认首页正常加载
   - 确认"Checking availability"不再卡住

3. **测试登录功能**
   - 访问 http://38.175.195.104:3000/sign-in
   - 尝试使用 Google 登录
   - 检查是否成功登录

4. **检查库存状态**
   - 访问首页
   - 确认库存状态正确显示（不再卡在"Checking availability"）

## 如果问题仍然存在

1. **检查服务器日志**
   ```bash
   ssh root@38.175.195.104
   pm2 logs maclock --lines 100
   ```

2. **检查 Clerk Dashboard**
   - 查看 Events 页面，检查是否有错误事件
   - 确认 API Keys 正确
   - 确认允许来源已添加

3. **临时禁用 Clerk**
   如果 Clerk 配置有问题，可以临时禁用：
   - 在服务器 `.env.local` 中注释掉 Clerk 密钥
   - 重启服务
   - 网站将使用基础认证（不需要登录即可下单）


