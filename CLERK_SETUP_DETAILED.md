# Clerk Dashboard 详细配置指南

## 方法 1: 通过 Clerk Dashboard Web 界面

### 步骤 1: 登录并找到应用
1. 访问 https://dashboard.clerk.com/
2. 登录你的账号
3. 在应用列表中选择你的应用（Application）

### 步骤 2: 查找设置的不同位置

#### 位置 A: Settings → Domains
1. 点击左侧菜单的 **"Settings"**
2. 找到 **"Domains"** 或 **"Allowed Domains"** 选项
3. 点击 **"Add Domain"** 或 **"Add Origin"**
4. 输入：`http://38.175.195.104:3000`

#### 位置 B: Configure → Paths
1. 点击左侧菜单的 **"Configure"**
2. 找到 **"Paths"** 或 **"Routing"** 选项
3. 检查以下设置：
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

#### 位置 C: Settings → API Keys
1. 点击左侧菜单的 **"Settings"**
2. 找到 **"API Keys"** 选项
3. 查看 **"Frontend API"** 部分
4. 查找 **"Allowed Origins"** 或 **"CORS Origins"**

#### 位置 D: 直接在搜索框搜索
1. 在 Dashboard 顶部找到搜索框
2. 搜索关键词：`allowed origins`、`domains`、`frontend API`、`CORS`

### 步骤 3: 如果仍然找不到

可能的原因：
- Clerk Dashboard 界面已更新，设置位置改变
- 你的 Clerk 账号类型可能不支持某些设置
- 可能需要使用 Clerk CLI 或 API 来配置

## 方法 2: 使用环境变量检查（临时解决方案）

如果找不到 Dashboard 设置，我们可以先检查环境变量是否正确：

```bash
# 在服务器上运行
cd /var/www/maclock
cat .env.local | grep CLERK
```

确保看到：
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 方法 3: 检查 Clerk 实例配置

### 检查你的 Clerk 实例 URL
从错误信息中可以看到你的 Clerk 实例是：
`https://clear-bonefish-57.clerk.accounts.dev`

这意味着：
- 你的 Clerk 应用 ID 可能包含 `clear-bonefish-57`
- 在 Dashboard 中查找这个应用

### 检查应用状态
1. 在 Dashboard 中查看应用列表
2. 找到名称或 ID 包含 `clear-bonefish-57` 的应用
3. 点击进入应用详情

## 方法 4: 使用 Clerk CLI（高级）

如果 Web 界面找不到设置，可以使用 Clerk CLI：

```bash
# 安装 Clerk CLI
npm install -g @clerk/clerk-cli

# 登录
clerk login

# 查看应用列表
clerk apps list

# 查看应用配置
clerk apps show <your-app-id>
```

## 方法 5: 检查是否是 IP 地址问题

Clerk 可能不支持直接使用 IP 地址。如果是这样，你需要：

### 选项 A: 使用域名
1. 为你的服务器配置一个域名（如 `maclock.example.com`）
2. 在 Clerk Dashboard 中添加域名
3. 更新环境变量中的 URL

### 选项 B: 使用 localhost 开发
如果是开发环境，可以：
1. 在 Clerk Dashboard 中添加 `http://localhost:3000`
2. 使用 SSH 隧道访问服务器：
   ```bash
   ssh -L 3000:localhost:3000 root@38.175.195.104
   ```
3. 然后通过 `http://localhost:3000` 访问

## 方法 6: 联系 Clerk 支持

如果以上方法都不行：
1. 访问 https://clerk.com/support
2. 或发送邮件到 support@clerk.com
3. 说明你的问题：无法在 Dashboard 中找到 "Allowed Origins" 设置

## 临时解决方案：禁用 Clerk 验证（仅用于测试）

如果急需测试其他功能，可以临时禁用 Clerk：

```typescript
// app/layout.tsx
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// 临时禁用 Clerk（仅用于测试）
if (!publishableKey || publishableKey === 'pk_test_dummy') {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

## 快速检查清单

请告诉我：
1. ✅ 你能登录 Clerk Dashboard 吗？
2. ✅ 你能看到你的应用列表吗？
3. ✅ 左侧菜单有哪些选项？（请列出）
4. ✅ 你能看到 "Settings" 或 "Configure" 菜单吗？
5. ✅ 你的 Clerk 应用名称或 ID 是什么？

根据你的回答，我可以提供更具体的指导。


