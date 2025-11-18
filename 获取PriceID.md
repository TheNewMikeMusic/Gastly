# 如何获取正确的 Stripe Price ID

## ⚠️ 重要提示

您当前配置的是 **Product ID** (`prod_...`)，但需要的是 **Price ID** (`price_...`)

## 快速获取 Price ID

### 方法 1：从现有产品获取

1. 访问：https://dashboard.stripe.com/test/products
2. 点击您创建的产品（Product ID: `prod_TRX54CbHFQyboc`）
3. 在产品详情页面，找到 **"Pricing"** 部分
4. 您会看到一个 **Price ID**，格式：`price_1xxxxxxxxxxxxx`
5. 复制这个 Price ID

### 方法 2：如果产品没有价格，添加价格

1. 在产品详情页面，点击 **"Add another price"** 或 **"Pricing"** 标签
2. 设置价格：
   - **Amount**: 输入价格（如 `99.00`）
   - **Currency**: `USD`
   - **Billing**: `One time`
3. 点击 **"Add price"**
4. 保存后，复制新创建的 **Price ID**（以 `price_` 开头）

## 更新配置

获取 Price ID 后，更新 `.env.local` 文件：

```env
NEXT_PUBLIC_STRIPE_PRICE_ID=price_您的实际价格ID
```

**示例**：
```env
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1AbCdEf1234567890GhIjK
```

## 验证

运行以下命令检查：

```powershell
Get-Content .env.local | Select-String "PRICE_ID"
```

应该看到以 `price_` 开头的值。

## 区别说明

- **Product ID** (`prod_...`): 产品标识符，用于管理产品
- **Price ID** (`price_...`): 价格标识符，用于创建支付会话 ⭐ **需要这个**

