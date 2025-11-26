# 修复 Clerk 401 错误 - 详细步骤

## 问题确认
- ✅ Clerk 密钥格式正确（用户已确认）
- ❌ 401 Unauthorized 错误
- ❌ PC端 Sign In 页面显示空白

## 根本原因
401 错误通常是因为你的域名/IP地址没有在 Clerk Dashboard 中配置为"允许的来源"。

## 解决方案：配置 Clerk Dashboard

### 方法 1: 通过 Web 界面配置（推荐）

#### 步骤 1: 登录 Clerk Dashboard
1. 访问：https://dashboard.clerk.com/
2. 登录你的账号

#### 步骤 2: 找到你的应用
1. 在应用列表中，找到你的应用
2. 从错误信息中可以看到你的 Clerk 实例是：`clear-bonefish-57.clerk.accounts.dev`
3. 找到对应的应用并点击进入

#### 步骤 3: 查找配置位置
根据 Clerk Dashboard 的不同版本，设置可能在以下位置之一：

**位置 A: Settings → Domains**
1. 点击左侧菜单的 **"Settings"**
2. 向下滚动找到 **"Domains"** 或 **"Allowed Domains"**
3. 点击 **"Add Domain"** 或 **"Add Origin"**

**位置 B: Configure → Paths**
1. 点击左侧菜单的 **"Configure"**
2. 找到 **"Paths"** 或 **"Routing"**
3. 查看是否有 **"Allowed Origins"** 或 **"Frontend API"** 设置

**位置 C: 直接搜索**
1. 在 Dashboard 顶部使用搜索功能
2. 搜索：`allowed origins`、`domains`、`frontend API`

#### 步骤 4: 添加你的 IP 地址
在找到的设置页面中，添加以下内容：

```
http://38.175.195.104:3000
http://38.175.195.104
```

**重要提示：**
- 必须包含协议（`http://` 或 `https://`）
- 如果使用端口，必须包含端口号（`:3000`）
- 可以添加多个条目

#### 步骤 5: 保存并等待
1. 点击 **"Save"** 或 **"Update"** 保存设置
2. 等待 1-2 分钟让配置生效
3. 清除浏览器缓存（Ctrl+Shift+Delete）
4. 重新访问 Sign In 页面

### 方法 2: 如果找不到设置（使用 Clerk API）

如果 Dashboard 界面找不到设置，可以使用 Clerk API：

```bash
# 在服务器上运行
curl -X PATCH https://api.clerk.com/v1/instance \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "allowed_origins": [
      "http://38.175.195.104:3000",
      "http://38.175.195.104"
    ]
  }'
```

**注意：** 需要替换 `YOUR_SECRET_KEY` 为你的 `CLERK_SECRET_KEY`

### 方法 3: 检查环境变量中的 URL 配置

确保以下环境变量正确设置：

```bash
cd /var/www/maclock
cat .env.local | grep -E "CLERK|URL"
```

应该看到：
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_URL=http://38.175.195.104:3000
```

如果没有 `NEXT_PUBLIC_URL`，添加它：
```bash
echo "NEXT_PUBLIC_URL=http://38.175.195.104:3000" >> .env.local
```

### 方法 4: 临时解决方案 - 使用 localhost

如果无法配置 IP 地址，可以临时使用 localhost：

1. 在 Clerk Dashboard 中添加：`http://localhost:3000`
2. 使用 SSH 隧道访问：
   ```bash
   ssh -L 3000:localhost:3000 root@38.175.195.104
   ```
3. 在本地浏览器访问：`http://localhost:3000`

## 验证配置是否生效

配置完成后，检查：

1. **浏览器控制台**：401 错误应该消失
2. **Network 标签页**：Clerk API 请求应该返回 200 状态码
3. **Sign In 页面**：应该正常显示登录表单

## 如果仍然有问题

请提供以下信息：
1. Clerk Dashboard 中左侧菜单的所有选项
2. Settings 页面显示的内容
3. 浏览器控制台的完整错误信息
4. Network 标签页中 Clerk API 请求的详细信息

## 快速检查清单

- [ ] 已登录 Clerk Dashboard
- [ ] 已找到应用设置页面
- [ ] 已添加 `http://38.175.195.104:3000` 到允许的来源
- [ ] 已保存设置
- [ ] 已等待 1-2 分钟
- [ ] 已清除浏览器缓存
- [ ] 已重新测试 Sign In 页面





