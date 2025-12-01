# 上线前检查清单

## 🗄️ 数据库检查

### 1. 数据库连接
- [ ] 确认生产环境 DATABASE_URL 正确配置
- [ ] 测试数据库连接是否正常
- [ ] 确认数据库服务正在运行

### 2. 数据库迁移
- [ ] 运行 `npx prisma migrate deploy` 确保所有迁移已应用
- [ ] 运行 `npx prisma generate` 重新生成 Prisma Client
- [ ] 验证所有表结构正确

### 3. 数据库表检查
- [ ] Order 表存在且字段完整
- [ ] Product 表存在且有默认产品
- [ ] Coupon 表存在
- [ ] SavedAddress 表存在
- [ ] 其他表（Wishlist, Newsletter, Waitlist, Thread, Message）存在

### 4. 订单功能测试
- [ ] 可以创建订单记录
- [ ] 订单信息（收货地址、联系方式）可以正确保存
- [ ] Stripe session ID 可以正确关联
- [ ] 优惠券信息可以正确保存
- [ ] 库存预留功能正常

## 🔐 环境变量检查

### 必需的环境变量
- [ ] `DATABASE_URL` - 数据库连接字符串
- [ ] `STRIPE_SECRET_KEY` - Stripe 密钥
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID` - Stripe 价格 ID
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe Webhook 密钥
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk 公钥
- [ ] `CLERK_SECRET_KEY` - Clerk 密钥
- [ ] `NEXT_PUBLIC_URL` - 生产环境 URL

### 可选的环境变量
- [ ] `FOURPX_API_KEY` - 4PX API 密钥（物流）
- [ ] `RESEND_API_KEY` - Resend API 密钥（邮件）
- [ ] `EMAIL_SERVICE` - 邮件服务配置

## 💳 Stripe 配置检查

- [ ] Stripe 账户已激活
- [ ] 生产环境 API 密钥已配置
- [ ] Webhook 端点已配置并测试
- [ ] Price ID 正确且为生产环境价格
- [ ] 支付流程测试通过

## 📦 订单流程检查

### 下单流程
1. [ ] 用户填写收货信息
2. [ ] 库存检查正常
3. [ ] 优惠券验证正常
4. [ ] 订单记录创建成功
5. [ ] Stripe Checkout Session 创建成功
6. [ ] 用户完成支付

### 支付完成流程
1. [ ] Stripe Webhook 接收支付成功事件
2. [ ] 订单状态更新为 'paid'
3. [ ] 库存扣减正常
4. [ ] 确认邮件发送成功

### 后台管理
1. [ ] 管理员可以查看订单列表
2. [ ] 订单详情显示完整
3. [ ] 可以更新订单状态
4. [ ] 可以创建物流跟踪

## 🚀 部署检查

- [ ] 代码已推送到生产分支
- [ ] 构建成功无错误
- [ ] 环境变量已配置
- [ ] 数据库迁移已应用
- [ ] 服务器重启成功
- [ ] 应用正常运行

## 🧪 测试清单

### 功能测试
- [ ] 用户可以注册/登录
- [ ] 用户可以浏览产品
- [ ] 用户可以添加到购物车/直接购买
- [ ] 用户可以填写收货信息
- [ ] 用户可以完成支付
- [ ] 支付成功后订单显示在账户页面
- [ ] 管理员可以查看订单

### 错误处理
- [ ] 库存不足时显示错误
- [ ] 支付失败时订单状态正确
- [ ] 网络错误时有适当提示
- [ ] 数据库错误有日志记录

## 📝 上线后监控

- [ ] 设置错误监控（如 Sentry）
- [ ] 设置日志收集
- [ ] 监控数据库性能
- [ ] 监控 Stripe Webhook 接收情况
- [ ] 监控订单创建成功率

## 🔧 紧急回滚计划

- [ ] 准备回滚脚本
- [ ] 备份数据库
- [ ] 记录当前版本号
- [ ] 准备回滚通知

---

**检查完成后，运行以下命令验证数据库：**

```bash
# 在服务器上运行
cd /var/www/maclock
npx ts-node scripts/check-database-production.ts
```


