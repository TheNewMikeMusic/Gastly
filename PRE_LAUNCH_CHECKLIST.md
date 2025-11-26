# 上线前检查清单

本文档提供了详细的上线前检查步骤，请逐项完成。

## 📋 快速检查命令

```bash
# 运行自动化检查
node scripts/pre-launch-check.js

# 构建检查
npm run build

# 类型检查
npx tsc --noEmit

# 代码检查
npm run lint

# 安全审计
npm audit

# 数据库迁移状态
npx prisma migrate status

# 生成 Prisma Client
npx prisma generate
```

---

## 1. 环境变量配置 ✅

### 必需环境变量（生产环境）

在服务器上验证以下环境变量：

```bash
# 检查环境变量是否存在
echo $NEXT_PUBLIC_URL
echo $STRIPE_SECRET_KEY | cut -c1-10  # 只显示前10个字符
echo $CLERK_PUBLISHABLE_KEY | cut -c1-10
```

**检查项:**
- [ ] `NEXT_PUBLIC_URL` 必须是 HTTPS（如 `https://yourdomain.com`）
- [ ] `STRIPE_SECRET_KEY` 必须以 `sk_live_` 开头（不是 `sk_test_`）
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID` 是生产价格 ID
- [ ] `STRIPE_WEBHOOK_SECRET` 已配置（`whsec_` 开头）
- [ ] `DATABASE_URL` 是生产数据库连接字符串
- [ ] `CLERK_PUBLISHABLE_KEY` 必须以 `pk_live_` 开头（不是 `pk_test_`）
- [ ] `CLERK_SECRET_KEY` 必须以 `sk_live_` 开头（不是 `sk_test_`）
- [ ] `ADMIN_SESSION_SECRET` 已更改默认值

**验证命令:**
```bash
# 在服务器上运行
node -e "console.log('URL:', process.env.NEXT_PUBLIC_URL?.startsWith('https://') ? '✓ HTTPS' : '✗ Not HTTPS')"
node -e "console.log('Stripe:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? '✓ Live key' : '✗ Test key')"
node -e "console.log('Clerk:', process.env.CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_') ? '✓ Live key' : '✗ Test key')"
```

---

## 2. 数据库配置 ✅

### Prisma 配置

```bash
# 1. 生成 Prisma Client
npx prisma generate

# 2. 检查迁移状态
npx prisma migrate status

# 3. 如果有未应用的迁移，应用它们
npx prisma migrate deploy
```

**检查项:**
- [ ] Prisma Client 已生成（`node_modules/.prisma/client` 存在）
- [ ] 所有迁移已应用到生产数据库
- [ ] 数据库连接测试成功
- [ ] 数据库备份策略已配置

**测试数据库连接:**
```bash
# 使用 Prisma Studio 测试（仅开发环境）
npx prisma studio

# 或使用 psql 直接连接
psql $DATABASE_URL -c "SELECT 1"
```

---

## 3. API 配置检查 ✅

### Stripe 配置

**在 Stripe Dashboard 中验证:**
- [ ] 账户已切换到生产模式（Live mode）
- [ ] Webhook 端点已配置: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Webhook 签名密钥已复制到环境变量
- [ ] 价格 ID 是生产价格（不是测试价格）
- [ ] 测试支付流程（使用真实卡或 Stripe 测试卡）

**测试 Stripe Checkout:**
```bash
# 使用 curl 测试 checkout API（需要认证）
curl -X POST https://yourdomain.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'
```

### Clerk 配置

**在 Clerk Dashboard 中验证:**
- [ ] 应用已切换到生产模式
- [ ] 允许的域名已添加（如 `yourdomain.com`）
- [ ] API 密钥是生产密钥（`pk_live_` 和 `sk_live_`）
- [ ] 测试用户注册和登录流程

### 4PX 物流配置（如果使用）

- [ ] API 密钥已配置
- [ ] `FOURPX_SANDBOX=false`（生产环境）
- [ ] 测试物流跟踪功能

---

## 4. 安全性检查 ✅

### 认证和授权

**检查文件:**
- [ ] `middleware.ts` - 路由保护配置正确
- [ ] `/admin/*` 路由需要管理员认证
- [ ] API 路由有适当的认证检查

**验证命令:**
```bash
# 检查 middleware.ts 中的路由保护
grep -n "protect\|isPublicRoute\|isAdminRoute" middleware.ts
```

### Webhook 安全

**检查项:**
- [ ] Stripe Webhook 签名验证在生产环境强制启用 ✅
- [ ] Webhook 路由正确处理错误

**验证代码:**
```typescript
// app/api/webhooks/stripe/route.ts
// 应该包含:
if (process.env.NODE_ENV === 'production' && !webhookSecret) {
  return error // ✅ 已实现
}
```

### HTTP 安全头

**检查 `next.config.js`:**
- [ ] `X-Content-Type-Options: nosniff` ✅
- [ ] `X-Frame-Options: DENY` ✅
- [ ] `X-XSS-Protection: 1; mode=block` ✅
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` ✅

---

## 5. 构建和部署检查 ✅

### 构建验证

```bash
# 1. 清理之前的构建
rm -rf .next

# 2. 安装依赖
npm ci  # 或 npm install

# 3. 构建项目
npm run build

# 4. 检查构建输出
ls -la .next/
```

**检查项:**
- [ ] 构建成功，无错误
- [ ] 构建输出中没有警告
- [ ] `.next` 目录已生成
- [ ] 静态文件已生成

### 类型检查

```bash
# TypeScript 类型检查
npx tsc --noEmit
```

**检查项:**
- [ ] 无类型错误
- [ ] 无类型警告（如果配置了严格模式）

### 代码质量

```bash
# ESLint 检查
npm run lint

# 安全审计
npm audit
npm audit fix  # 修复可自动修复的漏洞
```

**检查项:**
- [ ] ESLint 无错误
- [ ] 无严重安全漏洞
- [ ] 依赖版本稳定

---

## 6. 代码质量检查 ✅

### 错误处理

**检查所有 API 路由:**
- [ ] 所有路由都有 try-catch
- [ ] 错误响应格式统一
- [ ] 错误日志已记录

**检查文件列表:**
```bash
find app/api -name "route.ts" -exec grep -l "try\|catch" {} \;
```

### 控制台输出

**已优化:**
- ✅ Webhook 路由中的 `console.log` 已改为 `console.error`
- ⚠️ 其他 `console.warn` 和 `console.error` 保留用于错误追踪

**建议:**
- 考虑集成 Sentry 或其他日志服务
- 在生产环境条件化控制台输出

---

## 7. 性能优化检查 ✅

### 图片优化

**检查 `next.config.js`:**
- [ ] 图片格式配置（AVIF, WebP）✅
- [ ] 设备尺寸配置 ✅
- [ ] 图片尺寸配置 ✅

### 代码分割

**检查动态导入:**
```bash
grep -r "import(" app/ components/
```

### 缓存策略

**检查 `next.config.js` 中的缓存配置:**
- [ ] 静态资源缓存 ✅
- [ ] API 响应缓存（如果适用）

---

## 8. 功能测试检查 ⚠️

### 核心功能测试

**首页:**
- [ ] 页面加载正常
- [ ] Hero 区域显示正常
- [ ] 图片加载正常
- [ ] 动画流畅

**产品展示:**
- [ ] Features Grid 显示正常
- [ ] 图片画廊功能正常
- [ ] 响应式布局正常

**购买流程:**
- [ ] Buy Now 按钮可点击
- [ ] 跳转到 Stripe Checkout
- [ ] 支付成功回调正常
- [ ] 订单创建成功

**用户认证:**
- [ ] 用户注册流程正常
- [ ] 用户登录流程正常
- [ ] 会话保持正常

**订单管理:**
- [ ] Dashboard 可访问
- [ ] 订单列表显示正常
- [ ] 订单详情显示正常

**消息系统:**
- [ ] 消息发送正常
- [ ] 消息接收正常
- [ ] 消息列表显示正常

### 支付流程测试

**使用 Stripe 测试卡:**
- 卡号: `4242 4242 4242 4242`
- 过期日期: 任何未来日期
- CVC: 任何3位数字

**测试步骤:**
1. [ ] 创建 Checkout Session
2. [ ] 完成支付
3. [ ] 验证 Webhook 事件处理
4. [ ] 检查订单状态更新
5. [ ] 验证成功页面显示

### 管理员功能测试

- [ ] 管理员登录
- [ ] 订单管理
- [ ] 库存管理
- [ ] 优惠券管理
- [ ] 消息管理

---

## 9. 移动端和响应式检查 ⚠️

### 移动端测试

**使用浏览器开发者工具:**
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad (768px)

**检查项:**
- [ ] 布局正常
- [ ] 触摸交互正常
- [ ] 图片加载正常
- [ ] 性能良好

---

## 10. SEO 和可访问性 ⚠️

### SEO 检查

**使用工具:**
- Google Search Console
- Lighthouse SEO 审计

**检查项:**
- [ ] Meta 标签配置
- [ ] Open Graph 标签
- [ ] 结构化数据（如果适用）
- [ ] 站点地图（如果适用）

### 可访问性检查

**使用工具:**
- Lighthouse Accessibility 审计
- WAVE 浏览器扩展

**检查项:**
- [ ] 键盘导航正常
- [ ] 屏幕阅读器兼容
- [ ] 颜色对比度符合 WCAG
- [ ] 图片有 alt 文本

---

## 11. 监控和日志 ⚠️

### 错误监控

**建议集成:**
- [ ] Sentry（错误追踪）
- [ ] LogRocket（会话回放）
- [ ] 或其他监控服务

### 性能监控

**建议配置:**
- [ ] Google Analytics
- [ ] Vercel Analytics（如果使用 Vercel）
- [ ] 自定义性能监控

### 日志收集

**配置:**
- [ ] 应用日志收集
- [ ] 错误日志告警
- [ ] 性能指标监控

---

## 12. 文档完整性 ✅

**检查文档:**
- [ ] `README.md` 包含生产部署说明
- [ ] `SETUP.md` 包含设置步骤
- [ ] `env.example` 包含所有环境变量
- [ ] 部署文档完整

---

## 13. 回滚计划 ⚠️

### 准备回滚

- [ ] 数据库备份脚本
- [ ] 代码回滚脚本
- [ ] 回滚检查清单
- [ ] 回滚测试（在测试环境）

---

## 14. 最终验证 ⚠️

### 生产环境测试

**上线后立即检查:**
- [ ] 应用启动正常
- [ ] 所有页面可访问
- [ ] 数据库连接正常
- [ ] API 响应正常
- [ ] 支付流程正常
- [ ] 用户认证正常

### 性能指标

**使用 Lighthouse:**
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90

**检查命令:**
```bash
# 使用 Lighthouse CLI
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

---

## ✅ 检查完成

完成所有检查项后，项目可以安全上线。

**最后提醒:**
1. 确保所有环境变量是生产环境值
2. 确保数据库已备份
3. 确保监控已配置
4. 准备好回滚计划

---

## 📞 支持

如有问题，请参考:
- `PRE_LAUNCH_CHECK_REPORT.md` - 详细检查报告
- `scripts/pre-launch-check.js` - 自动化检查脚本

