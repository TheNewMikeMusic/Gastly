# Stripe 支付设置指南

## 快速开始

### 步骤 1：创建 Stripe 账户

1. 访问 [Stripe 官网](https://stripe.com)
2. 点击 "Sign up" 创建账户
3. 填写必要信息完成注册

### 步骤 2：获取 API 密钥

1. 登录 Stripe Dashboard：https://dashboard.stripe.com
2. 点击右上角的 "Developers" → "API keys"
3. 您会看到两对密钥：
   - **Test mode keys**（测试模式）- 用于开发测试
   - **Live mode keys**（生产模式）- 用于正式环境

#### 测试模式密钥（推荐先使用）
- **Secret key**: `sk_test_...` （以 `sk_test_` 开头）
- **Publishable key**: `pk_test_...` （以 `pk_test_` 开头）

⚠️ **重要**：Secret key 是敏感信息，不要分享给任何人！

### 步骤 3：创建产品和价格

1. 在 Stripe Dashboard 中，点击左侧菜单 "Products"
2. 点击 "Add product" 按钮
3. 填写产品信息：
   - **Name**: Maclock（或您的产品名称）
   - **Description**: 可选的产品描述
4. 在 "Pricing" 部分：
   - **Pricing model**: Standard pricing
   - **Price**: 输入价格（例如：99.00）
   - **Currency**: USD（或您需要的货币）
   - **Billing period**: One time
5. 点击 "Save product"
6. 创建后，您会看到一个 **Price ID**，格式类似：`price_xxxxxxxxxxxxx`
   - 这个 Price ID 就是您需要的 `NEXT_PUBLIC_STRIPE_PRICE_ID`

### 步骤 4：配置环境变量

更新 `.env.local` 文件，添加以下配置：

```env
# Stripe 配置
STRIPE_SECRET_KEY=sk_test_你的实际密钥
NEXT_PUBLIC_STRIPE_PRICE_ID=price_你的实际价格ID
```

⚠️ **注意**：
- `STRIPE_SECRET_KEY` 不要加引号
- `NEXT_PUBLIC_STRIPE_PRICE_ID` 是公开的，可以放在前端代码中

## 测试支付

### Stripe 测试卡号

在测试模式下，您可以使用以下测试卡号：

| 卡号 | 用途 |
|------|------|
| `4242 4242 4242 4242` | 成功支付 |
| `4000 0000 0000 0002` | 卡被拒绝 |
| `4000 0000 0000 9995` | 需要 3D Secure 验证 |

**其他测试信息**：
- **过期日期**: 任何未来的日期（如 12/34）
- **CVC**: 任意 3 位数字（如 123）
- **邮编**: 任意 5 位数字（如 12345）

### 测试流程

1. 启动开发服务器：`npm run dev`
2. 访问结账页面：`http://localhost:3000/checkout`
3. 填写物流信息
4. 点击"继续支付"
5. 在 Stripe Checkout 页面使用测试卡号完成支付

## 生产环境设置

当您准备上线时：

1. **切换到 Live mode**
   - 在 Stripe Dashboard 右上角切换模式
   - 获取 Live mode 的 Secret key

2. **更新环境变量**
   ```env
   STRIPE_SECRET_KEY=sk_live_你的生产密钥
   ```

3. **创建生产环境的产品和价格**
   - 在 Live mode 下创建产品
   - 获取生产环境的 Price ID

4. **配置 Webhook**（可选但推荐）
   - 用于接收支付成功/失败的通知
   - 在 Dashboard → Developers → Webhooks 中配置

## 常见问题

### Q: 如何查看支付记录？
A: 在 Stripe Dashboard → Payments 中查看所有支付记录

### Q: 测试支付会真的扣款吗？
A: 不会。测试模式下的所有支付都是模拟的，不会产生真实费用

### Q: 如何退款？
A: 在 Stripe Dashboard → Payments 中找到订单，点击 "Refund" 按钮

### Q: 支持哪些支付方式？
A: 当前配置支持信用卡支付。可以在 Stripe Dashboard 中启用其他支付方式（如支付宝、微信支付等）

### Q: 如何更改货币？
A: 在创建价格时选择不同的货币，或创建多个价格支持多币种

## 安全提示

1. ✅ **永远不要**将 Secret key 提交到 Git 仓库
2. ✅ **永远不要**在前端代码中使用 Secret key
3. ✅ 使用 `.env.local` 文件存储密钥（已在 `.gitignore` 中）
4. ✅ 定期轮换 API 密钥
5. ✅ 在生产环境使用 Live mode 密钥

## 下一步

配置完成后：
1. 重启开发服务器以加载新的环境变量
2. 测试支付流程
3. 查看 Stripe Dashboard 确认支付记录

如有问题，请参考 [Stripe 官方文档](https://stripe.com/docs)



