# Clerk 登录问题修复指南

## 问题症状
- 502 Bad Gateway
- Clerk sign in 按钮没反应
- Google 登录按钮没反应
- Header overflow 错误

## 已修复的问题

### 1. 防火墙端口
- ✅ 已开放端口 3000

### 2. Clerk 配置
- ✅ 修复了 ClerkProvider domain 配置
- ✅ 修复了 SignIn 组件的重定向配置

### 3. 服务状态
- ✅ Next.js 服务正常运行在端口 3000
- ⚠️ Nginx 服务失败（不影响直接访问）

## Clerk Dashboard 配置步骤

### 1. 添加允许来源（Allowed Origins）

访问 https://dashboard.clerk.com → 你的应用 → Settings → Domains

添加以下域名/IP：
- `http://38.175.195.104:3000`
- `http://hello1984.net`（如果配置了域名）
- `http://localhost:3000`（开发环境）

### 2. 配置 OAuth（Google 登录）

访问 https://dashboard.clerk.com → 你的应用 → User & Authentication → Social Connections

1. 启用 Google OAuth
2. 配置 Google OAuth Client ID 和 Secret（从 Google Cloud Console 获取）
3. 添加授权回调 URL：
   - `http://38.175.195.104:3000/api/auth/callback`
   - `http://hello1984.net/api/auth/callback`（如果配置了域名）

### 3. 检查 API Keys

确保服务器上的环境变量与 Clerk Dashboard 中的一致：
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = Dashboard 中的 Publishable Key
- `CLERK_SECRET_KEY` = Dashboard 中的 Secret Key

### 4. 配置路径（Paths）

访问 https://dashboard.clerk.com → 你的应用 → Settings → Paths

确保以下路径正确：
- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-in`
- After sign-in URL: `/`
- After sign-up URL: `/`

## 访问地址

### 直接访问（推荐）
```
http://38.175.195.104:3000
```

### 如果配置了域名
```
http://hello1984.net
```

## 故障排查

### 问题 1: 502 Bad Gateway
**原因**: Nginx 配置问题或服务未启动

**解决方案**:
1. 直接访问 `http://38.175.195.104:3000`（绕过 Nginx）
2. 检查 PM2 状态: `pm2 status`
3. 查看日志: `pm2 logs maclock`

### 问题 2: Clerk sign in 按钮没反应
**原因**: Clerk JavaScript 未加载或配置错误

**解决方案**:
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页的错误信息
3. 检查 Network 标签页，确认 Clerk JS 是否加载
4. 确认 Clerk Dashboard 中的允许来源已添加当前访问地址

### 问题 3: Google 登录没反应
**原因**: OAuth 未配置或回调 URL 错误

**解决方案**:
1. 在 Clerk Dashboard 中启用 Google OAuth
2. 配置 Google OAuth Client ID 和 Secret
3. 添加正确的回调 URL
4. 在 Google Cloud Console 中添加授权回调 URL

### 问题 4: Header overflow 错误
**原因**: Clerk 代理配置问题

**解决方案**:
1. 在 Clerk Dashboard 中添加正确的域名/IP 到允许来源
2. 确保 `NEXT_PUBLIC_URL` 环境变量正确
3. 清除浏览器缓存和 Cookie

## 验证步骤

1. **访问网站**
   ```
   http://38.175.195.104:3000
   ```

2. **测试登录页面**
   ```
   http://38.175.195.104:3000/sign-in
   ```

3. **检查浏览器控制台**
   - 打开开发者工具（F12）
   - 查看 Console 是否有错误
   - 查看 Network 标签页，确认请求是否成功

4. **测试登录功能**
   - 点击 "Sign in" 按钮
   - 尝试使用 Google 登录
   - 检查是否成功跳转

## 如果问题仍然存在

1. **检查服务器日志**
   ```bash
   ssh root@38.175.195.104
   pm2 logs maclock --lines 100
   ```

2. **检查 Clerk Dashboard Events**
   - 访问 https://dashboard.clerk.com
   - 查看 Events 页面，检查是否有错误事件

3. **临时禁用 Clerk**
   - 如果 Clerk 配置有问题，可以临时禁用：
   - 在服务器 `.env.local` 中注释掉 Clerk 密钥
   - 重启服务
   - 网站将使用基础认证（不需要登录即可下单）

## 联系支持

如果以上步骤都无法解决问题，请提供：
1. 浏览器控制台的错误信息
2. 服务器日志（`pm2 logs maclock`）
3. Clerk Dashboard Events 中的错误事件


