# 重要提示：图片目录

Next.js 默认从 `public`（小写）目录提供静态文件。

当前项目使用 `Public`（大写）目录存储图片。有两种解决方案：

## 方案 1：重命名目录（推荐）

将 `Public` 目录重命名为 `public`：

```bash
mv Public public
```

然后更新 `lib/images.ts` 中的路径：

```typescript
src: `/public/${prefix}${preferredExtensions[0]}`
```

## 方案 2：使用 Next.js 配置

在 `next.config.js` 中添加静态文件服务配置（不推荐，因为 Next.js 标准做法是使用 `public` 目录）。

## 当前状态

图片路径配置在 `lib/images.ts` 中，当前使用 `/Public/` 路径。如果重命名目录为 `public`，需要更新该文件中的路径。

