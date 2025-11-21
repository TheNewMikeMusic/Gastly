# 快速设置指南

## 1. 安装依赖

```bash
npm install
```

## 2. 配置环境变量

创建 `.env.local` 文件并填入以下变量：

```env
NEXT_PUBLIC_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
DATABASE_URL=postgresql://user:password@localhost:5432/maclock
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 3. 设置数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev
```

## 4. 启动开发服务器

```bash
npm run dev
```

## 5. 访问应用

打开 [http://localhost:3000](http://localhost:3000)

## 注意事项

- 确保 `/Public` 目录中包含所有产品图片
- 图片文件名应匹配 `lib/images.ts` 中定义的前缀
- 支持的图片格式：`.webp`, `.png`, `.jpg`, `.jpeg`, `.avif`
- 如果图片缺失，系统会自动显示占位符

## 功能检查清单

- [ ] 首页 Hero 区域正常显示
- [ ] Features Grid 卡片动画流畅
- [ ] Buy Now 按钮可以跳转到 Stripe Checkout
- [ ] 登录功能正常
- [ ] Dashboard 可以查看订单和消息
- [ ] 移动端响应式布局正常
- [ ] 图片加载正常（检查控制台是否有警告）

## 生产部署前检查

1. 更新环境变量为生产环境值
2. 运行 `npm run build` 确保构建成功
3. 检查 Lighthouse 评分（目标：≥90）
4. 测试支付流程（使用 Stripe 测试卡）
5. 验证所有页面可访问
6. 检查移动端体验

