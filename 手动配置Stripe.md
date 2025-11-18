# 手动配置 Stripe（最简单的方法）

## 快速步骤

### 1. 获取 Stripe Secret Key

1. 打开浏览器访问：**https://dashboard.stripe.com/test/apikeys**
2. 如果没有账户，先注册（免费）
3. 找到 "Secret key" 部分
4. 点击 "Reveal test key" 显示完整密钥
5. 复制整个密钥（以 `sk_test_` 开头）

### 2. 创建产品和价格

1. 访问：**https://dashboard.stripe.com/test/products**
2. 点击右上角 "Add product"
3. 填写：
   - **Name**: `Maclock`
   - **Price**: `99.00`（或您想要的价格）
   - **Currency**: `USD`
   - **Billing**: `One time`
4. 点击 "Save product"
5. 复制 **Price ID**（以 `price_` 开头）

### 3. 编辑配置文件

打开项目根目录下的 **`.env.local`** 文件，找到这两行：

```env
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PRICE_ID=
```

替换为您的实际值：

```env
STRIPE_SECRET_KEY=sk_test_您的实际密钥
NEXT_PUBLIC_STRIPE_PRICE_ID=price_您的实际价格ID
```

**示例**：
```env
STRIPE_SECRET_KEY=sk_test_51AbCdEf1234567890GhIjKlMnOpQrStUvWxYz
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1AbCdEf1234567890GhIjK
```

### 4. 保存文件

保存 `.env.local` 文件

### 5. 验证配置

运行以下命令检查：

```powershell
Get-Content .env.local | Select-String "STRIPE"
```

应该看到您刚才输入的密钥和价格 ID。

### 6. 测试

1. 重启开发服务器：
   ```bash
   npm run dev
   ```

2. 访问：http://localhost:3000/checkout

3. 填写物流信息

4. 使用测试卡号支付：
   - **卡号**: `4242 4242 4242 4242`
   - **过期日期**: `12/34`
   - **CVC**: `123`
   - **邮编**: `12345`

## 需要帮助？

- 查看详细指南：`STRIPE_SETUP.md`
- 查看快速指南：`QUICK_STRIPE_SETUP.md`
- Stripe 官方文档：https://stripe.com/docs

