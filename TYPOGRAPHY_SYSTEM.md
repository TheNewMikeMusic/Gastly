# 字体系统说明

## 概述

全站使用苹果风格的字体系统，确保视觉一致性和专业感。

## 字体栈

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif;
```

这个字体栈会：
- 在 macOS/iOS 上使用 SF Pro
- 在其他系统上使用系统默认的无衬线字体
- 确保在所有平台上都有良好的显示效果

## 字体大小系统

### Apple 风格工具类

我们提供了以下工具类，自动处理字体大小、行高和字间距：

- `.text-apple-display` - 超大标题（Hero 标题）
  - 字体大小：`clamp(2.5rem, 8vw, 4.5rem)`
  - 行高：1.1
  - 字间距：-0.022em
  - 字重：600 (semibold)

- `.text-apple-headline` - 大标题
  - 字体大小：`clamp(1.875rem, 5vw, 3rem)`
  - 行高：1.2
  - 字间距：-0.022em
  - 字重：600 (semibold)

- `.text-apple-title` - 标题
  - 字体大小：`clamp(1.25rem, 3vw, 1.875rem)`
  - 行高：1.4
  - 字间距：-0.02em
  - 字重：600 (semibold)

- `.text-apple-body` - 正文
  - 字体大小：`clamp(1rem, 2vw, 1.125rem)`
  - 行高：1.5
  - 字间距：-0.011em
  - 字重：400 (normal)

- `.text-apple-caption` - 说明文字
  - 字体大小：`clamp(0.875rem, 2vw, 1rem)`
  - 行高：1.429
  - 字间距：-0.011em
  - 字重：400 (normal)

- `.text-apple-footnote` - 脚注
  - 字体大小：`clamp(0.75rem, 1.5vw, 0.875rem)`
  - 行高：1.333
  - 字间距：-0.01em
  - 字重：400 (normal)

### Tailwind 默认字体大小

所有 Tailwind 的字体大小类（`text-xs`, `text-sm`, `text-base`, 等）都已配置为苹果风格，包括：
- 合适的行高
- 负字间距（-0.011em 到 -0.022em）
- 默认字重 400

## 字重系统

- `font-light` - 300
- `font-normal` - 400（默认）
- `font-medium` - 500
- `font-semibold` - 600（推荐用于标题）
- `font-bold` - 700

## 字间距系统

- `tracking-tighter` - -0.05em
- `tracking-tight` - -0.025em
- `tracking-normal` - -0.011em（默认）
- `tracking-wide` - 0.025em
- `tracking-wider` - 0.05em
- `tracking-widest` - 0.1em

## 使用建议

### 标题
```tsx
<h1 className="text-apple-display font-semibold">大标题</h1>
<h2 className="text-apple-headline font-semibold">中标题</h2>
<h3 className="text-apple-title font-semibold">小标题</h3>
```

### 正文
```tsx
<p className="text-apple-body">正文内容</p>
<p className="text-apple-caption">说明文字</p>
```

### 按钮
```tsx
<button className="text-apple-body font-semibold">按钮文字</button>
```

## 已更新的组件

- ✅ `components/Hero.tsx` - 使用 `text-apple-display` 和 `text-apple-body`
- ✅ `components/ProductPrice.tsx` - 使用苹果风格字体工具类
- ✅ `components/StockStatus.tsx` - 使用 `text-apple-caption`
- ✅ `components/TrustStrip.tsx` - 使用 `text-apple-title` 和 `text-apple-body`
- ✅ `app/globals.css` - 定义全局字体和工具类
- ✅ `tailwind.config.ts` - 配置字体系统和默认值

## 注意事项

1. **优先使用工具类**：使用 `.text-apple-*` 工具类而不是手动设置字体大小
2. **保持一致性**：全站使用相同的字体系统
3. **响应式设计**：所有工具类都使用 `clamp()` 确保在不同屏幕尺寸下都有良好显示
4. **字重选择**：标题使用 `font-semibold` (600)，正文使用 `font-normal` (400)

---

**更新时间**: 2025-01-XX
**状态**: ✅ 已完成

