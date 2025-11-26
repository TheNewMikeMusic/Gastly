# 价格更新总结

## 更新内容

将全局价格从 **$299** 更新为：
- **原价**: $199
- **前100台特价**: $99

## 更新的文件

### 1. 价格显示组件
- ✅ `components/ProductPrice.tsx` - 新建统一价格组件
  - 支持三种变体：`hero`, `card`, `inline`
  - 显示原价和前100台特价
  - 显示"First 100 Units Special"标签和节省金额

### 2. Hero 部分
- ✅ `components/Hero.tsx` - 使用新的价格组件
  - 显示 $99（前100台特价）
  - 显示 $199（原价，删除线）
  - 显示"First 100 Units Special"标签

### 3. Trust Strip
- ✅ `components/TrustStrip.tsx` - 更新价格文本
  - "From $299" → "First 100 Units $99"

### 4. Checkout 页面
- ✅ `app/checkout/page.tsx` - 更新价格显示
  - 默认价格：$99（前100台特价）
  - 订单摘要中显示原价和特价
  - 显示"First 100 Units Special"标签

### 5. Pricing 页面
- ✅ `app/pricing/page.tsx` - 更新价格显示
  - 主价格：$99（前100台特价）
  - 显示 $199（原价，删除线）
  - 显示"First 100 Units Special"标签

### 6. 配置和默认值
- ✅ `env.example` - 更新默认价格
  - `NEXT_PUBLIC_PRODUCT_PRICE=9900` (前100台特价 $99)
- ✅ `lib/inventory.ts` - 更新默认价格
  - 默认价格：$99（前100台特价）
- ✅ `scripts/seed-default-product.ts` - 更新种子数据价格

## 价格显示效果

### Hero 部分
```
$99 USD
$199 (删除线)
[First 100 Units Special] Save $100
```

### Checkout 页面
```
Subtotal: $99.00 $199.00 (删除线)
[First 100 Units Special] Save $100.00
```

### Pricing 页面
```
$99
$199 (删除线)
[First 100 Units Special]
One-time payment
```

## 注意事项

1. **Stripe 价格 ID**: 需要在 Stripe Dashboard 中创建 $99 的价格，并更新 `NEXT_PUBLIC_STRIPE_PRICE_ID` 环境变量
2. **数据库**: 如果已有产品记录，需要更新数据库中的价格字段
3. **订单历史**: 已存在的订单价格不会改变（保持历史记录）

## 测试建议

- [ ] 验证 Hero 部分价格显示正确
- [ ] 验证 Checkout 页面价格计算正确
- [ ] 验证 Pricing 页面价格显示正确
- [ ] 验证 Stripe Checkout 使用正确的价格 ID
- [ ] 测试购买流程，确认最终支付金额为 $99

---

**更新时间**: $(date)
**状态**: ✅ 已完成

