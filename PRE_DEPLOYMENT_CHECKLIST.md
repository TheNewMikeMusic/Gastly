# ✅ 部署前检查清单

## 🔐 环境变量配置

### 必需配置
- [ ] `NEXT_PUBLIC_URL` - 生产环境 URL（例如：`http://38.175.195.104:3000`）
- [ ] `STRIPE_SECRET_KEY` - Stripe 密钥（例如：`sk_test_51SXa9vKq6uXmKI6k...`）
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID` - Stripe 价格 ID（例如：`price_1SZBB1Kq6uXmKI6k2rTHlnBj`）
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe Webhook 签名密钥（例如：`whsec_...`）
- [ ] `DATABASE_URL` - PostgreSQL 数据库连接字符串（例如：`postgresql://maclock:maclock123@38.175.195.104:5432/maclock`）

### 可选配置（但建议配置）
- [ ] `FOURPX_API_KEY` - 4px API 密钥（物流跟踪功能）
- [ ] `FOURPX_API_SECRET` - 4px API 密钥
- [ ] `FOURPX_CUSTOMER_CODE` - 4px 客户代码
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk 公钥（用户认证）
- [ ] `CLERK_SECRET_KEY` - Clerk 密钥

## 💳 支付功能检查

### Stripe 配置
- [ ] Stripe 密钥已正确配置
- [ ] Stripe Price ID 已正确配置
- [ ] Stripe Webhook 已配置并指向：`http://38.175.195.104:3000/api/webhooks/stripe`
- [ ] Webhook 事件已启用：
  - `checkout.session.completed`
  - `checkout.session.async_payment_failed`
  - `payment_intent.succeeded`

### 支付流程测试
- [ ] 访问 `/checkout` 页面可以正常打开
- [ ] 填写配送信息表单验证正常
- [ ] 点击"Pay Now"可以跳转到 Stripe Checkout
- [ ] 使用测试卡 `4242 4242 4242 4242` 可以完成支付
- [ ] 支付完成后跳转到 `/success` 页面
- [ ] 订单在数据库中正确创建
- [ ] 订单状态正确更新为 `paid`
- [ ] 库存正确扣减
- [ ] 确认邮件发送（如果配置了邮件服务）

### 支付状态更新
- [ ] Webhook 正确处理支付完成事件
- [ ] Success 页面的 fallback 机制正常工作
- [ ] "继续支付"功能正常（不需要重新输入地址）
- [ ] 支付完成后订单状态自动更新

## 📦 4px 物流跟踪功能检查

### 4px API 配置
- [ ] `FOURPX_API_KEY` 已配置
- [ ] `FOURPX_API_SECRET` 已配置
- [ ] `FOURPX_CUSTOMER_CODE` 已配置（如果使用）

### 物流跟踪功能测试
- [ ] 后台管理可以添加物流单号
- [ ] 物流单号可以正确保存到数据库
- [ ] 订单跟踪页面 `/account/track/[orderId]` 可以正常访问
- [ ] 物流跟踪信息正确显示
- [ ] 物流状态正确更新
- [ ] 物流事件时间线正确显示
- [ ] 如果 4px API 未配置，使用模拟数据正常显示

### 4px 订单创建（可选）
- [ ] 后台管理可以创建 4px 订单
- [ ] 4px 订单创建成功返回跟踪号
- [ ] 跟踪号自动保存到订单

## 🔧 后台管理功能检查

### 管理员认证
- [ ] 访问 `/admin` 需要登录
- [ ] 管理员账号：`Alex`
- [ ] 管理员密码：`13572468a`
- [ ] 登录后可以访问后台管理页面

### 订单管理
- [ ] 可以查看所有订单列表
- [ ] 订单列表分页正常
- [ ] 可以按状态筛选订单
- [ ] 可以查看订单详情
- [ ] 可以更新订单状态
- [ ] 可以添加/更新物流单号
- [ ] 可以创建 4px 订单

### 统计数据
- [ ] 订单统计数据正确显示
- [ ] 销售额统计正确
- [ ] 订单状态分布正确

## 👥 多用户数据隔离检查

### 用户认证
- [ ] Clerk 认证正常（如果配置）
- [ ] 用户登录后可以访问自己的订单
- [ ] 用户无法访问其他用户的订单

### 订单数据隔离
- [ ] 每个用户只能看到自己的订单
- [ ] 订单跟踪页面只显示当前用户的订单
- [ ] 后台管理可以看到所有用户的订单
- [ ] 订单数据按 `userId` 正确隔离

### 订单创建
- [ ] 不同用户下单数据正确保存
- [ ] 订单 `userId` 正确关联
- [ ] 临时用户 ID（无 Clerk 时）正确生成

## 🗄️ 数据库检查

### 数据库连接
- [ ] 数据库连接字符串正确
- [ ] 数据库服务正在运行
- [ ] Prisma Client 已生成
- [ ] 数据库迁移已运行

### 数据完整性
- [ ] 订单表结构正确
- [ ] 订单字段完整（配送信息、物流信息等）
- [ ] 索引已创建（`userId` 索引）
- [ ] 外键约束正确

## 🚀 部署检查

### 代码准备
- [ ] 所有代码已提交到 Git
- [ ] 本地构建成功（`npm run build`）
- [ ] 没有构建错误或警告
- [ ] 所有依赖已安装

### 服务器准备
- [ ] 服务器可以 SSH 连接
- [ ] 服务器已安装 Node.js 18+
- [ ] 服务器已安装 PM2
- [ ] 服务器已安装 PostgreSQL
- [ ] 服务器有足够的磁盘空间

### 部署脚本
- [ ] `deploy-production.sh` 脚本已创建
- [ ] 脚本有执行权限（`chmod +x`）
- [ ] 服务器路径正确（`/var/www/maclock`）
- [ ] SSH 密钥已配置（或使用密码）

## 📋 部署后验证

### 基本功能
- [ ] 网站可以正常访问
- [ ] 首页正常显示
- [ ] 导航菜单正常
- [ ] 所有页面可以正常访问

### 关键功能
- [ ] 支付功能正常
- [ ] 订单创建正常
- [ ] 订单状态更新正常
- [ ] 物流跟踪正常
- [ ] 后台管理正常
- [ ] 用户认证正常

### 性能检查
- [ ] 页面加载速度正常
- [ ] API 响应时间正常
- [ ] 数据库查询性能正常
- [ ] 没有内存泄漏

## 🐛 常见问题排查

### 支付问题
- 检查 Stripe Webhook 配置
- 检查服务器日志：`pm2 logs maclock`
- 运行更新脚本：`npx ts-node scripts/update-paid-orders.ts`

### 物流跟踪问题
- 检查 4px API 密钥配置
- 检查服务器日志确认 API 调用
- 确认物流单号格式正确

### 后台管理问题
- 检查管理员认证配置
- 检查会话配置
- 清除浏览器 Cookie 重新登录

### 数据库问题
- 检查数据库连接字符串
- 确认数据库服务运行
- 运行数据库迁移：`npx prisma migrate deploy`

## ✅ 最终确认

部署前请确认：
- [ ] 所有环境变量已正确配置
- [ ] 所有功能已测试通过
- [ ] 数据库已备份（如果需要）
- [ ] 部署脚本已准备好
- [ ] 服务器已准备好

**部署命令：**
```bash
./deploy-production.sh
```

**部署后验证：**
```bash
ssh root@38.175.195.104
cd /var/www/maclock
npx ts-node scripts/verify-deployment.ts
```


