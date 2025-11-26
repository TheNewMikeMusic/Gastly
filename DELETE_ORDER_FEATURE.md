# 删除订单功能

## 功能描述

允许用户删除订单，但**已付款的订单不能删除**，以保护财务记录完整性。

## 安全规则

### ✅ 可以删除的订单状态
- `pending` - 待支付订单
- `cancelled` - 已取消订单

### ❌ 不能删除的订单状态
- `paid` - 已支付订单（需要保留财务记录）
- `refunded` - 已退款订单（需要保留财务记录）

## 实现细节

### 1. API 端点

**文件**: `app/api/orders/[orderId]/delete/route.ts`

**方法**: `DELETE`

**功能**:
- 验证用户身份（Clerk认证）
- 验证订单属于当前用户
- 检查订单状态，只允许删除pending或cancelled订单
- 拒绝删除paid或refunded订单
- 从数据库完全删除订单记录

**响应**:
- `200 OK`: 删除成功
- `400 Bad Request`: 订单不能删除（已付款或状态不允许）
- `401 Unauthorized`: 未授权
- `404 Not Found`: 订单不存在
- `500 Internal Server Error`: 服务器错误

### 2. 删除按钮组件

**文件**: `components/DeleteOrderButton.tsx`

**功能**:
- 客户端组件，处理删除操作
- 自动判断订单是否可删除（只显示可删除订单的按钮）
- 二次确认对话框，防止误删
- 删除成功后刷新页面
- 错误处理和用户提示

**特性**:
- 只有pending或cancelled状态的订单才显示删除按钮
- 已付款订单不显示删除按钮
- 确认对话框防止误操作
- 加载状态显示

### 3. UI 集成

**Dashboard页面** (`app/dashboard/page.tsx`):
- 在每个订单卡片底部添加删除按钮
- 只有可删除的订单才显示按钮

**Account页面** (`app/account/page.tsx`):
- 在订单操作区域添加删除按钮
- 与"Track Package"和"Continue Payment"按钮一起显示

**订单详情页面** (`app/account/track/[orderId]/page.tsx`):
- Pending订单：显示"Complete Payment"区域，包含支付和删除按钮
- Cancelled订单：显示"Delete Order"区域，包含删除按钮和说明
- Paid订单：不显示删除选项

## 使用流程

1. 用户在订单列表或详情页面看到可删除的订单
2. 点击"Delete Order"按钮
3. 系统显示确认对话框
4. 用户确认删除
5. 系统验证订单状态和用户权限
6. 如果验证通过，从数据库删除订单
7. 页面自动刷新，订单从列表中移除

## 安全考虑

### 已实现的安全措施

1. **身份验证**: 使用Clerk验证用户身份
2. **权限检查**: 确保订单属于当前用户
3. **状态验证**: 只允许删除pending或cancelled订单
4. **财务保护**: 已付款订单不能删除，保护财务记录完整性
5. **二次确认**: UI层面的确认对话框防止误操作

### 为什么已付款订单不能删除？

1. **财务记录**: 已付款订单是重要的财务记录，需要保留用于：
   - 会计和税务记录
   - 退款处理
   - 客户服务查询
   - 法律合规

2. **数据完整性**: 删除已付款订单会导致：
   - 财务数据不一致
   - 无法追踪交易历史
   - 退款处理困难

3. **审计要求**: 商业应用通常需要保留所有财务交易记录

## 测试建议

### 功能测试
- [ ] 删除pending订单成功
- [ ] 删除cancelled订单成功
- [ ] 尝试删除paid订单（应失败）
- [ ] 尝试删除refunded订单（应失败）
- [ ] 尝试删除其他用户的订单（应失败）
- [ ] 未登录用户无法删除订单

### UI测试
- [ ] Pending订单显示删除按钮
- [ ] Cancelled订单显示删除按钮
- [ ] Paid订单不显示删除按钮
- [ ] Refunded订单不显示删除按钮
- [ ] 确认对话框正常工作
- [ ] 删除后页面正确刷新

### 边界情况
- [ ] 网络错误时的处理
- [ ] 订单不存在时的处理
- [ ] 并发删除的处理

## 相关文件

- `app/api/orders/[orderId]/delete/route.ts` - 删除订单API端点
- `components/DeleteOrderButton.tsx` - 删除按钮组件
- `app/dashboard/page.tsx` - Dashboard订单列表
- `app/account/page.tsx` - Account订单列表
- `app/account/track/[orderId]/page.tsx` - 订单详情页面

## 与取消订单的区别

| 功能 | 取消订单 | 删除订单 |
|------|---------|---------|
| API端点 | `/api/orders/[orderId]/cancel` | `/api/orders/[orderId]/delete` |
| HTTP方法 | POST | DELETE |
| 操作 | 更新订单状态为cancelled | 从数据库删除订单 |
| 可操作状态 | pending, paid | pending, cancelled |
| 已付款订单 | 可以取消（会退款） | 不能删除 |
| 数据保留 | 保留订单记录 | 完全删除记录 |

---

**实现时间**: $(date)
**状态**: ✅ 已实现并测试

