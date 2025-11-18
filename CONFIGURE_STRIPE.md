# 配置 Stripe - 简单步骤

## 快速配置（2 分钟）

### 步骤 1：获取 Stripe 密钥

1. **打开浏览器访问**：https://dashboard.stripe.com/test/apikeys
   - 如果没有账户，先注册（免费）

2. **复制 Secret key**：
   - 找到 "Secret key" 下的 `sk_test_...` 
   - 点击 "Reveal test key" 显示完整密钥
   - 复制整个密钥（以 `sk_test_` 开头）

### 步骤 2：创建产品和价格

1. **访问产品页面**：https://dashboard.stripe.com/test/products

2. **点击 "Add product"**

3. **填写产品信息**：
   ```
   Name: Maclock
   Description: (可选)
   ```

4. **设置价格**：
   ```
   Price: 99.00
   Currency: USD
   Billing: One time
   ```

5. **点击 "Save product"**

6. **复制 Price ID**：
   - 产品创建后，您会看到一个 Price ID
   - 格式：`price_1xxxxxxxxxxxxx`
   - 复制这个 ID

### 步骤 3：更新配置文件

**打开 `.env.local` 文件**，找到这两行并替换：

```env
STRIPE_SECRET_KEY=sk_test_粘贴您的密钥
NEXT_PUBLIC_STRIPE_PRICE_ID=price_粘贴您的价格ID
```

**示例**：
```env
STRIPE_SECRET_KEY=sk_test_51AbCdEf1234567890...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1AbCdEf1234567890...
```

### 步骤 4：验证配置

运行以下命令检查：

```powershell
Get-Content .env.local | Select-String "STRIPE"
```

应该看到您刚才输入的密钥和价格 ID。

### 步骤 5：测试

1. **重启开发服务器**（如果正在运行）：
   ```bash
   npm run dev
   ```

2. **访问结账页面**：
   http://localhost:3000/checkout

3. **使用测试卡号支付**：
   - 卡号：`4242 4242 4242 4242`
   - 过期日期：`12/34`
   - CVC：`123`
   - 邮编：`12345`

## 常见问题

**Q: 找不到 .env.local 文件？**
A: 在项目根目录创建它，或复制 `env.example` 为 `.env.local`

**Q: 密钥格式不对？**
A: Secret key 必须以 `sk_test_` 开头，Price ID 必须以 `price_` 开头

**Q: 如何查看支付记录？**
A: 访问 https://dashboard.stripe.com/test/payments

**Q: 测试会扣款吗？**
A: 不会，测试模式完全免费

## 需要帮助？

如果遇到问题，请检查：
1. `.env.local` 文件是否存在
2. 密钥格式是否正确
3. 开发服务器是否重启
4. 浏览器控制台是否有错误信息

