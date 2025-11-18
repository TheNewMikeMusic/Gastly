# Stripe 快速设置指南

## 🚀 快速开始（3 步）

### 步骤 1：获取 Stripe API 密钥

1. 访问 https://dashboard.stripe.com 并登录
2. 点击 **Developers** → **API keys**
3. 在 **Test mode** 下，复制 **Secret key**（以 `sk_test_` 开头）

### 步骤 2：创建产品和价格

1. 在 Stripe Dashboard 中，点击 **Products**
2. 点击 **Add product**
3. 填写产品信息：
   - Name: `Maclock`
   - Price: 输入价格（如 `99.00`）
   - Currency: `USD`
   - Billing: `One time`
4. 点击 **Save product**
5. 复制 **Price ID**（以 `price_` 开头）

### 步骤 3：配置环境变量

**方法 A：使用设置脚本（推荐）**

```powershell
.\setup-stripe.ps1
```

然后按照提示输入您的 Secret Key 和 Price ID。

**方法 B：手动编辑 `.env.local`**

打开 `.env.local` 文件，更新以下两行：

```env
STRIPE_SECRET_KEY=sk_test_你的实际密钥
NEXT_PUBLIC_STRIPE_PRICE_ID=price_你的实际价格ID
```

## ✅ 验证配置

运行以下命令检查配置：

```powershell
Get-Content .env.local | Select-String "STRIPE"
```

应该看到：
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
```

## 🧪 测试支付

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问结账页面**：
   http://localhost:3000/checkout

3. **填写物流信息并点击"继续支付"**

4. **使用测试卡号**：
   - 卡号：`4242 4242 4242 4242`
   - 过期日期：任意未来日期（如 `12/34`）
   - CVC：任意 3 位数字（如 `123`）
   - 邮编：任意 5 位数字（如 `12345`）

5. **完成支付测试**

## 📋 测试卡号列表

| 卡号 | 用途 |
|------|------|
| `4242 4242 4242 4242` | ✅ 成功支付 |
| `4000 0000 0000 0002` | ❌ 卡被拒绝 |
| `4000 0000 0000 9995` | 🔐 需要 3D Secure |

## 🔍 常见问题

**Q: 在哪里查看支付记录？**
A: Stripe Dashboard → Payments

**Q: 测试支付会扣款吗？**
A: 不会，测试模式下的支付都是模拟的

**Q: 如何切换到生产环境？**
A: 在 Stripe Dashboard 切换到 Live mode，使用 Live 密钥更新环境变量

**Q: 支持哪些支付方式？**
A: 当前支持信用卡。可在 Stripe Dashboard 中启用其他支付方式

## 📚 更多信息

详细设置指南请查看：`STRIPE_SETUP.md`

Stripe 官方文档：https://stripe.com/docs

