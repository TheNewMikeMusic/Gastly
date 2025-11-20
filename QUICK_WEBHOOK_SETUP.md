# Stripe Webhook 快速配置指南

## 🚀 快速开始（3步完成）

### 步骤1: 在Stripe Dashboard创建Webhook

1. **访问**: https://dashboard.stripe.com/webhooks
2. **点击**: "Add endpoint" 按钮
3. **填写**:
   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
     - 生产环境: 替换 `yourdomain.com` 为您的实际域名
     - 本地开发: 使用Stripe CLI（见步骤2）
   - **Description**: "Maclock Order Webhook" (可选)
4. **选择事件** (点击 "Select events"):
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_failed`
   - ✅ `payment_intent.succeeded` (可选，备用)
5. **点击**: "Add endpoint"
6. **复制签名密钥**:
   - 在webhook详情页找到 "Signing secret"
   - 点击 "Reveal" 显示密钥
   - 复制密钥（以 `whsec_` 开头）

### 步骤2: 配置环境变量

打开 `.env.local` 文件，添加：

```env
STRIPE_WEBHOOK_SECRET=whsec_你刚才复制的密钥
```

### 步骤3: 验证配置

运行测试脚本：

```bash
npm run test:webhook
```

如果看到 ✅ 标记，说明配置成功！

## 🧪 本地开发测试

如果您需要在本地测试webhook（开发环境）：

### 方法1: 使用Stripe CLI（推荐）

1. **安装Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows: 下载 https://github.com/stripe/stripe-cli/releases
   # Linux: 参考 https://stripe.com/docs/stripe-cli
   ```

2. **登录**:
   ```bash
   stripe login
   ```

3. **转发webhook到本地**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   
   这会显示一个签名密钥，例如：
   ```
   > Ready! Your webhook signing secret is whsec_xxxxx
   ```

4. **添加到环境变量**:
   将CLI显示的密钥添加到 `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

5. **测试**:
   在另一个终端触发测试事件：
   ```bash
   stripe trigger checkout.session.completed
   ```

### 方法2: 使用ngrok（备选）

如果需要从Stripe Dashboard直接发送到本地：

1. 安装ngrok: https://ngrok.com/download
2. 启动本地服务器: `npm run dev`
3. 创建隧道: `ngrok http 3000`
4. 使用ngrok提供的HTTPS URL在Stripe Dashboard创建webhook

## ✅ 验证Webhook工作正常

1. **完成一个测试支付**:
   - 访问您的网站
   - 使用测试卡号: `4242 4242 4242 4242`
   - 任意未来日期和CVC
   - 完成支付

2. **检查结果**:
   - 在Stripe Dashboard → Webhooks → 您的endpoint
   - 查看 "Recent deliveries" 部分
   - 应该看到 `checkout.session.completed` 事件（绿色表示成功）
   - 检查数据库，订单状态应为 `paid`
   - 检查库存是否已减少

## 🔍 故障排查

### Webhook未收到事件？

1. **检查URL可访问性**:
   ```bash
   curl https://yourdomain.com/api/webhooks/stripe
   ```
   应该返回错误（因为没有签名），但不应该404

2. **检查Stripe Dashboard**:
   - Webhooks → 您的endpoint → Recent deliveries
   - 查看失败的事件详情

3. **检查服务器日志**:
   - 查看是否有错误信息
   - 检查webhook处理逻辑

### 签名验证失败？

- 确保 `STRIPE_WEBHOOK_SECRET` 正确配置
- 确保使用的是正确的密钥（测试环境用测试密钥，生产环境用生产密钥）
- 检查环境变量是否正确加载

### 订单状态未更新？

- 检查webhook事件是否成功处理
- 查看服务器日志中的错误
- 验证订单记录是否存在

## 📚 更多信息

- 详细配置指南: `STRIPE_WEBHOOK_CONFIG.md`
- Webhook处理代码: `app/api/webhooks/stripe/route.ts`
- Webhook逻辑: `lib/stripe-webhook.ts`

## 🎯 配置检查清单

- [ ] 在Stripe Dashboard创建了webhook endpoint
- [ ] 选择了正确的事件（checkout.session.completed等）
- [ ] 复制了签名密钥
- [ ] 添加了 `STRIPE_WEBHOOK_SECRET` 到 `.env.local`
- [ ] 运行了 `npm run test:webhook` 验证配置
- [ ] 测试了实际支付流程
- [ ] 验证了订单状态自动更新

完成以上步骤后，您的webhook就配置好了！🎉

