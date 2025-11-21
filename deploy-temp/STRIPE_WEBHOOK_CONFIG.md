# Stripe Webhook 配置完整指南

## 概述

Stripe Webhook是确保订单状态可靠更新的关键组件。当用户完成支付时，Stripe会向我们的服务器发送webhook事件，自动更新订单状态、发送邮件和减少库存。

## 配置步骤

### 步骤1: 在Stripe Dashboard创建Webhook Endpoint

1. **登录Stripe Dashboard**
   - 访问 https://dashboard.stripe.com
   - 使用您的Stripe账户登录

2. **进入Webhooks设置**
   - 点击左侧菜单的 **Developers** → **Webhooks**
   - 点击右上角的 **Add endpoint** 按钮

3. **配置Endpoint URL**
   - **Endpoint URL**: 
     - 生产环境: `https://yourdomain.com/api/webhooks/stripe`
     - 开发环境: 使用Stripe CLI转发（见步骤2）
   - 例如: `https://maclock.hello1984.com/api/webhooks/stripe`

4. **选择要监听的事件**
   点击 **Select events** 或 **Select events to listen to**，选择以下事件：
   - ✅ `checkout.session.completed` - 支付成功
   - ✅ `checkout.session.async_payment_failed` - 异步支付失败
   - ✅ `payment_intent.succeeded` - 支付意图成功（备用）

5. **创建Endpoint**
   - 点击 **Add endpoint** 完成创建

6. **复制Signing Secret**
   - 创建后，点击webhook endpoint进入详情页
   - 找到 **Signing secret** 部分
   - 点击 **Reveal** 显示密钥
   - 复制密钥（以 `whsec_` 开头）

### 步骤2: 配置环境变量

1. **打开 `.env.local` 文件**
   ```bash
   # 如果文件不存在，从 env.example 复制
   cp env.example .env.local
   ```

2. **添加Webhook Secret**
   在 `.env.local` 文件中添加：
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
   ```
   
   将 `whsec_your_webhook_signing_secret_here` 替换为您从Stripe Dashboard复制的实际密钥。

3. **验证其他Stripe配置**
   确保以下环境变量已正确配置：
   ```env
   STRIPE_SECRET_KEY=sk_test_你的Stripe密钥
   NEXT_PUBLIC_STRIPE_PRICE_ID=price_你的价格ID
   ```

### 步骤3: 本地开发测试（使用Stripe CLI）

如果您需要在本地开发环境中测试webhook：

1. **安装Stripe CLI**
   - macOS: `brew install stripe/stripe-cli/stripe`
   - Windows: 下载 https://github.com/stripe/stripe-cli/releases
   - Linux: 参考 https://stripe.com/docs/stripe-cli

2. **登录Stripe CLI**
   ```bash
   stripe login
   ```
   这会打开浏览器进行身份验证

3. **转发Webhook到本地**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   
   Stripe CLI会显示一个webhook签名密钥，格式类似：
   ```
   > Ready! Your webhook signing secret is whsec_xxxxx
   ```

4. **使用CLI提供的密钥**
   将CLI显示的密钥添加到 `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # 使用CLI显示的密钥
   ```

5. **触发测试事件**
   在另一个终端窗口：
   ```bash
   stripe trigger checkout.session.completed
   ```

### 步骤4: 验证配置

1. **检查Webhook端点可访问性**
   - 确保您的服务器可以从互联网访问
   - 生产环境URL应该是HTTPS
   - 测试: `curl https://yourdomain.com/api/webhooks/stripe` 应该返回错误（因为没有签名），但不应该404

2. **测试Webhook**
   - 在Stripe Dashboard的Webhook详情页
   - 点击 **Send test webhook**
   - 选择 `checkout.session.completed` 事件
   - 检查服务器日志确认收到事件

3. **查看Webhook日志**
   - 在Stripe Dashboard的Webhook详情页
   - 查看 **Recent deliveries** 部分
   - 绿色表示成功，红色表示失败
   - 点击失败的请求查看错误详情

## 生产环境部署检查清单

- [ ] Webhook endpoint URL已配置为生产域名
- [ ] `STRIPE_WEBHOOK_SECRET` 已添加到生产环境变量
- [ ] 使用生产环境的Stripe密钥（`sk_live_` 开头）
- [ ] Webhook endpoint使用HTTPS
- [ ] 已测试webhook事件正常接收和处理
- [ ] 服务器日志监控已设置

## 故障排查

### 问题1: Webhook签名验证失败

**错误**: `Webhook signature verification failed`

**解决方案**:
- 检查 `STRIPE_WEBHOOK_SECRET` 是否正确配置
- 确保使用的是正确的签名密钥（测试环境用测试密钥，生产环境用生产密钥）
- 检查环境变量是否正确加载

### 问题2: Webhook未收到事件

**可能原因**:
- Webhook URL无法从互联网访问
- 防火墙阻止了Stripe的请求
- URL配置错误

**解决方案**:
- 使用 `curl` 测试URL可访问性
- 检查服务器防火墙设置
- 验证URL拼写正确

### 问题3: 订单状态未更新

**可能原因**:
- Webhook处理逻辑有错误
- 数据库连接问题
- 订单不存在

**解决方案**:
- 查看服务器日志
- 检查Stripe Dashboard中的webhook事件详情
- 验证订单记录是否存在

### 问题4: 开发环境无法接收Webhook

**解决方案**:
- 使用Stripe CLI转发webhook到本地
- 或使用ngrok等工具创建公网隧道
- 确保使用CLI提供的签名密钥

## 安全注意事项

1. **保护签名密钥**
   - 永远不要将 `STRIPE_WEBHOOK_SECRET` 提交到代码仓库
   - 使用环境变量存储密钥
   - 定期轮换密钥（在Stripe Dashboard中重新生成）

2. **验证签名**
   - 代码已实现签名验证
   - 生产环境必须配置 `STRIPE_WEBHOOK_SECRET`
   - 开发环境可以跳过验证（仅用于测试）

3. **HTTPS要求**
   - 生产环境必须使用HTTPS
   - Stripe不会向HTTP端点发送webhook

## 测试Webhook的完整流程

1. **创建测试订单**
   - 访问您的网站
   - 完成一个测试支付（使用Stripe测试卡号）
   - 卡号: `4242 4242 4242 4242`
   - 任意未来日期和CVC

2. **检查Webhook事件**
   - 在Stripe Dashboard → Webhooks → 您的endpoint
   - 查看 **Recent deliveries**
   - 应该看到 `checkout.session.completed` 事件

3. **验证订单状态**
   - 检查数据库中的订单状态应为 `paid`
   - 确认库存已减少
   - 确认确认邮件已发送（如果配置了邮件服务）

## 相关文件

- `app/api/webhooks/stripe/route.ts` - Webhook处理端点
- `lib/stripe-webhook.ts` - Webhook事件处理逻辑
- `WEBHOOK_SETUP.md` - 简要配置指南
- `env.example` - 环境变量示例

## 需要帮助？

如果遇到问题：
1. 查看Stripe Dashboard中的webhook事件日志
2. 检查服务器日志中的错误信息
3. 参考Stripe官方文档: https://stripe.com/docs/webhooks

