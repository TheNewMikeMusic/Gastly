import { prisma } from './prisma'

export interface SalesAnalytics {
  totalOrders: number
  totalRevenue: number
  paidOrders: number
  pendingOrders: number
  cancelledOrders: number
  averageOrderValue: number
  ordersByStatus: Record<string, number>
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>
  topCoupons: Array<{ code: string; usageCount: number; totalDiscount: number }>
}

export async function getSalesAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<SalesAnalytics> {
  const where: any = {}
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  const orders = await prisma.order.findMany({
    where,
  })

  const totalOrders = orders.length
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0)
  const paidOrders = orders.filter((o) => o.status === 'paid').length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length
  const averageOrderValue =
    paidOrders > 0 ? totalRevenue / paidOrders : 0

  // 按状态统计
  const ordersByStatus: Record<string, number> = {}
  orders.forEach((order) => {
    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1
  })

  // 按月统计收入和订单数
  const revenueByMonthMap = new Map<string, { revenue: number; orders: number }>()
  orders
    .filter((o) => o.status === 'paid')
    .forEach((order) => {
      const month = new Date(order.createdAt).toISOString().slice(0, 7) // YYYY-MM
      const existing = revenueByMonthMap.get(month) || { revenue: 0, orders: 0 }
      revenueByMonthMap.set(month, {
        revenue: existing.revenue + order.amount,
        orders: existing.orders + 1,
      })
    })

  const revenueByMonth = Array.from(revenueByMonthMap.entries())
    .map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  // 优惠券使用统计
  const couponUsage = new Map<
    string,
    { usageCount: number; totalDiscount: number }
  >()
  orders
    .filter((o) => o.couponCode && o.discountAmount)
    .forEach((order) => {
      const code = order.couponCode!
      const existing = couponUsage.get(code) || {
        usageCount: 0,
        totalDiscount: 0,
      }
      couponUsage.set(code, {
        usageCount: existing.usageCount + 1,
        totalDiscount: existing.totalDiscount + (order.discountAmount || 0),
      })
    })

  const topCoupons = Array.from(couponUsage.entries())
    .map(([code, data]) => ({
      code,
      usageCount: data.usageCount,
      totalDiscount: data.totalDiscount,
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10)

  return {
    totalOrders,
    totalRevenue,
    paidOrders,
    pendingOrders,
    cancelledOrders,
    averageOrderValue,
    ordersByStatus,
    revenueByMonth,
    topCoupons,
  }
}

