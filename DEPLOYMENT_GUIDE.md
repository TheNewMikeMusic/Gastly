# 🚀 生产环境部署指南

## 部署前准备

### 1. 环境变量配置

确保 `.env.local` 文件包含以下所有必要的环境变量：

#### 必需配置
- ✅ `NEXT_PUBLIC_URL` - 生产环境 URL（例如：`http://38.175.195.104:3000`）
- ✅ `STRIPE_SECRET_KEY` - Stripe 密钥
- ✅ `NEXT_PUBLIC_STRIPE_PRICE_ID` - Stripe 价格 ID
- ✅ `STRIPE_WEBHOOK_SECRET` - Stripe Webhook 签名密钥
- ✅ `DATABASE_URL` - PostgreSQL 数据库连接字符串

#### 可选配置
- ⚠️ `FOURPX_API_KEY` - 4px API 密钥（物流跟踪）
- ⚠️ `FOURPX_API_SECRET` - 4px API 密钥
- ⚠️ `FOURPX_CUSTOMER_CODE` - 4px 客户代码
- ⚠️ `ADMIN_EMAIL` - 管理员邮箱（后台管理）
- ⚠️ `ADMIN_PASSWORD` - 管理员密码

### 2. 服务器要求

- Node.js 18+
- PostgreSQL 数据库
- PM2 进程管理器
- 足够的磁盘空间（至少 2GB）

## 部署步骤

### 方法 1: 使用自动化部署脚本（推荐）

```bash
# 1. 确保本地代码已提交
git add .
git commit -m "准备部署"

# 2. 运行部署脚本
./deploy-production.sh
```

部署脚本会自动：
1. ✅ 检查本地构建
2. ✅ 验证环境变量
3. ✅ 上传文件到服务器
4. ✅ 在服务器上安装依赖
5. ✅ 运行数据库迁移
6. ✅ 构建项目
7. ✅ 重启服务
8. ✅ 健康检查

### 方法 2: 手动部署

#### 步骤 1: 本地构建测试

```bash
cd /Users/mikexu/Desktop/Maclock
npm run build
```

确保构建成功，没有错误。

#### 步骤 2: 上传文件到服务器

```bash
# 使用 rsync 同步文件
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.env.local' \
    ./ root@38.175.195.104:/var/www/maclock/
```

#### 步骤 3: 在服务器上执行部署

```bash
ssh root@38.175.195.104

cd /var/www/maclock

# 安装依赖
npm ci --production=false

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# 构建项目
npm run build

# 重启服务
pm2 restart maclock
```

## 部署后验证

### 1. 运行验证脚本

```bash
# 在服务器上运行
cd /var/www/maclock
npx ts-node scripts/verify-deployment.ts
```

### 2. 手动检查清单

#### ✅ 支付功能
- [ ] 访问 `/checkout` 页面，填写表单
- [ ] 使用 Stripe 测试卡完成支付
- [ ] 检查订单是否在数据库中创建
- [ ] 检查订单状态是否正确更新为 `paid`
- [ ] 检查库存是否正确扣减
- [ ] 检查确认邮件是否发送（如果配置了邮件服务）

#### ✅ Stripe Webhook
- [ ] 在 Stripe Dashboard 中检查 Webhook 事件
- [ ] 确认 `checkout.session.completed` 事件被正确处理
- [ ] 检查服务器日志确认 Webhook 处理成功

#### ✅ 4px 物流跟踪
- [ ] 在后台管理页面为订单添加物流单号
- [ ] 访问订单跟踪页面 `/account/track/[orderId]`
- [ ] 确认物流跟踪信息正确显示
- [ ] 测试物流状态更新功能

#### ✅ 后台管理
- [ ] 访问 `/admin` 页面
- [ ] 确认可以查看所有订单
- [ ] 确认可以查看订单详情
- [ ] 确认可以更新订单状态
- [ ] 确认可以添加物流单号
- [ ] 确认可以查看统计数据

#### ✅ 多用户数据隔离
- [ ] 使用不同账号登录
- [ ] 确认每个用户只能看到自己的订单
- [ ] 确认订单跟踪页面只显示当前用户的订单
- [ ] 确认后台管理可以看到所有用户的订单

#### ✅ 订单状态更新
- [ ] 测试"继续支付"功能
- [ ] 确认支付完成后订单状态自动更新
- [ ] 确认 success 页面的 fallback 机制正常工作

## 常见问题排查

### 问题 1: 支付完成后订单状态未更新

**原因**: Webhook 未正确处理或 success 页面 fallback 未触发

**解决方案**:
1. 检查 Stripe Webhook 配置是否正确
2. 检查服务器日志确认 Webhook 事件
3. 运行更新脚本：`npx ts-node scripts/update-paid-orders.ts`

### 问题 2: 4px 物流跟踪不工作

**原因**: 4px API 密钥未配置或配置错误

**解决方案**:
1. 检查环境变量 `FOURPX_API_KEY` 和 `FOURPX_API_SECRET`
2. 确认 4px 客户代码正确
3. 检查服务器日志确认 API 调用

### 问题 3: 后台管理无法访问

**原因**: 管理员认证配置错误

**解决方案**:
1. 检查 `lib/admin-auth.ts` 中的认证逻辑
2. 确认管理员邮箱和密码正确
3. 检查会话配置

### 问题 4: 数据库连接失败

**原因**: 数据库连接字符串错误或数据库未运行

**解决方案**:
1. 检查 `DATABASE_URL` 环境变量
2. 确认数据库服务正在运行
3. 测试数据库连接：`npx prisma db pull`

## 监控和维护

### 查看日志

```bash
# 查看 PM2 日志
ssh root@38.175.195.104
pm2 logs maclock

# 查看最近的错误
pm2 logs maclock --err --lines 50
```

### 重启服务

```bash
ssh root@38.175.195.104
pm2 restart maclock
```

### 更新代码

```bash
# 本地更新代码后，重新运行部署脚本
./deploy-production.sh
```

### 数据库备份

```bash
# 定期备份数据库
pg_dump -h 38.175.195.104 -U maclock maclock > backup_$(date +%Y%m%d).sql
```

## 性能优化建议

1. **启用 Next.js 缓存**: 确保 `.next` 目录正确构建
2. **数据库索引**: 确保常用查询字段有索引
3. **CDN 配置**: 考虑使用 CDN 加速静态资源
4. **监控设置**: 设置监控告警，及时发现问题

## 安全建议

1. ✅ 使用 HTTPS（生产环境）
2. ✅ 定期更新依赖包
3. ✅ 保护敏感环境变量
4. ✅ 限制管理员访问 IP
5. ✅ 定期备份数据库

## 支持

如有问题，请检查：
- 服务器日志：`pm2 logs maclock`
- 数据库连接：`npx prisma db pull`
- Stripe Dashboard：检查 Webhook 事件
- 4px Dashboard：检查 API 调用记录


