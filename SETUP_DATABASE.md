# 数据库设置指南

## 快速开始

### 方法一：使用 Prisma Migrate（推荐）

1. **配置数据库连接**

   编辑 `.env.local` 文件，设置您的数据库连接：

   ```env
   DATABASE_URL=postgresql://用户名:密码@localhost:5432/数据库名
   ```

   示例：
   ```env
   DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/maclock
   ```

2. **运行迁移**

   ```bash
   npx prisma migrate dev --name add_shipping_fields
   ```

   这将：
   - 创建迁移文件
   - 应用更改到数据库
   - 重新生成 Prisma Client

### 方法二：手动执行 SQL（如果 Prisma Migrate 不可用）

1. **连接到您的 PostgreSQL 数据库**

2. **执行迁移脚本**

   运行 `prisma/migrations/manual_add_shipping_fields.sql` 文件中的 SQL 语句

   或者直接在数据库客户端中执行：

   ```sql
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingName" TEXT;
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingPhone" TEXT;
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingEmail" TEXT;
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingAddress" TEXT;
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingCity" TEXT;
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingState" TEXT;
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingZip" TEXT;
   ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingCountry" TEXT;
   ```

3. **重新生成 Prisma Client**

   ```bash
   npx prisma generate
   ```

## 验证迁移

迁移完成后，可以使用以下方式验证：

### 使用 Prisma Studio

```bash
npx prisma studio
```

在浏览器中打开 Prisma Studio，查看 Order 表应该包含新的物流信息字段。

### 使用 SQL 查询

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND column_name LIKE 'shipping%';
```

应该返回 8 个字段：
- shippingName
- shippingPhone
- shippingEmail
- shippingAddress
- shippingCity
- shippingState
- shippingZip
- shippingCountry

## 注意事项

- ✅ 所有新字段都是可选的（nullable），不会影响现有数据
- ✅ 现有订单不会受到影响
- ✅ 迁移是安全的，可以随时执行
- ⚠️ 建议在生产环境执行前先备份数据库

## 故障排除

### 问题：找不到 DATABASE_URL

**解决方案**：确保 `.env.local` 文件存在并包含正确的 `DATABASE_URL` 配置。

### 问题：迁移失败

**解决方案**：
1. 检查数据库连接是否正常
2. 确保数据库用户有足够的权限
3. 查看错误信息，可能需要手动执行 SQL

### 问题：字段已存在

**解决方案**：如果字段已经存在，迁移会跳过（使用了 `IF NOT EXISTS`），这是正常的。

## 下一步

迁移完成后，您可以：
1. 启动开发服务器：`npm run dev`
2. 访问结账页面：`http://localhost:3000/checkout`
3. 测试物流信息填写功能



