# Stripe Webhook 配置指南

## 快速开始

### 1. 在Stripe Dashboard创建Webhook

1. 访问 https://dashboard.stripe.com/webhooks
2. 点击 **Add endpoint**
3. 设置URL: `https://yourdomain.com/api/webhooks/stripe`
4. 选择事件:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_failed`
   - ✅ `payment_intent.succeeded`
5. 复制 **Signing secret** (以 `whsec_` 开头)

### 2. 配置环境变量

在 `.env.local` 中添加：

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

### 3. 本地开发测试

使用Stripe CLI转发webhook到本地：

```bash
# 安装Stripe CLI (如果未安装)
# macOS: brew install stripe/stripe-cli/stripe
# Windows: 下载 https://github.com/stripe/stripe-cli/releases

# 登录
stripe login

# 转发webhook
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

CLI会显示一个签名密钥，将其添加到 `.env.local`

### 4. 测试配置

运行测试脚本：

```bash
npm run test:webhook
```

或手动测试：
- 使用测试卡号 `4242 4242 4242 4242` 完成一个支付
- 在Stripe Dashboard查看webhook事件日志
- 检查订单状态是否更新为 `paid`

## 详细文档

完整配置指南请参考: `STRIPE_WEBHOOK_CONFIG.md`

## 功能说明

配置完成后，webhook会自动：
- ✅ 更新订单状态为 `paid`
- ✅ 发送确认邮件
- ✅ 减少库存
- ✅ 更新优惠券使用次数
- ✅ 处理支付失败事件

## 安全

- Webhook验证Stripe签名确保安全性
- 所有操作都是幂等的
- 订单更新在事务中执行

