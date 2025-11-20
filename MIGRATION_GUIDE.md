# 数据库迁移指南

## 更新说明

本次更新为 Order 模型添加了物流信息字段。您需要运行数据库迁移来更新数据库结构。

## 迁移步骤

### 1. 生成迁移文件

运行以下命令生成 Prisma 迁移文件：

```bash
npx prisma migrate dev --name add_shipping_fields
```

这将：
- 创建一个新的迁移文件
- 更新数据库结构
- 重新生成 Prisma Client

### 2. 应用迁移（生产环境）

如果您在生产环境中，使用以下命令：

```bash
npx prisma migrate deploy
```

### 3. 验证迁移

迁移完成后，您可以验证 Order 模型是否包含新的物流信息字段：

```bash
npx prisma studio
```

在 Prisma Studio 中查看 Order 表，应该能看到以下新字段：
- shippingName
- shippingPhone
- shippingEmail
- shippingAddress
- shippingCity
- shippingState
- shippingZip
- shippingCountry

## 新增字段说明

所有物流信息字段都是可选的（nullable），这意味着：
- 现有订单不会受到影响
- 新订单可以逐步填写物流信息
- 字段可以为空，直到用户填写完整信息

## 回滚（如果需要）

如果需要回滚此迁移，可以：

1. 找到迁移文件（通常在 `prisma/migrations` 目录）
2. 手动删除迁移文件
3. 或者创建一个新的迁移来移除这些字段

## 注意事项

- 确保在运行迁移前备份数据库
- 迁移会自动处理现有数据，不会丢失任何信息
- 所有新字段都是可选的，不会影响现有功能



