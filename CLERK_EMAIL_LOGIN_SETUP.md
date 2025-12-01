# Clerk 邮箱登录配置指南

## 问题
- "Don't have an account? Sign up" 按钮点击无反应
- 需要支持邮箱登录，让没有 Google 账号的用户也能购买

## 解决方案

### 1. 在 Clerk Dashboard 中启用邮箱登录

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com)
2. 选择你的应用
3. 进入 **User & Authentication** > **Email, Phone, Username**
4. 确保 **Email address** 已启用
5. 在 **Email verification** 中，选择验证方式（推荐使用 "Email code"）
6. 保存设置

### 2. 检查代码配置

代码已经配置好了：
- ✅ SignIn 组件已配置 `signUpUrl="/sign-up"`
- ✅ SignUp 组件已配置 `signInUrl="/sign-in"`
- ✅ ClerkProvider 已正确配置

### 3. 如果 Sign up 链接仍然不工作

可能的原因：
1. Clerk Dashboard 中未启用邮箱登录
2. 浏览器缓存问题 - 清除缓存并刷新
3. Clerk 配置问题 - 检查环境变量

### 4. 验证步骤

1. 访问 https://hello1984.net/sign-in
2. 应该能看到：
   - 邮箱输入框（Email address）
   - 密码输入框（Password）
   - Google 登录按钮（如果已启用）
   - "Don't have an account? Sign up" 链接

3. 点击 "Sign up" 链接应该跳转到 https://hello1984.net/sign-up

4. 在注册页面应该能看到：
   - 邮箱输入框
   - 密码输入框
   - 确认密码输入框
   - "Already have an account? Sign in" 链接

### 5. 如果问题仍然存在

检查：
- Clerk Dashboard 中的认证方式设置
- 浏览器控制台是否有错误
- 网络请求是否正常

