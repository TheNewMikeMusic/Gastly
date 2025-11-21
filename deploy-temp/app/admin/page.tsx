import { redirect } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { AdminOrdersList } from '@/components/AdminOrdersList'
import { AdminAnalytics } from '@/components/AdminAnalytics'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Link from 'next/link'

async function getAllOrders(page: number = 1, pageSize: number = 20) {
  try {
    const skip = (page - 1) * pageSize
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          userId: true,
          amount: true,
          currency: true,
          status: true,
          stripeSessionId: true,
          couponCode: true,
          discountAmount: true,
          shippingName: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddress: true,
          shippingCity: true,
          shippingState: true,
          shippingZip: true,
          shippingCountry: true,
          trackingNumber: true,
          trackingCarrier: true,
          trackingStatus: true,
          trackingEta: true,
          trackingLastSyncedAt: true,
          trackingEvents: true,
          trackingMeta: true,
          refundedAt: true,
          refundAmount: true,
          refundReason: true,
          emailSent: true,
          confirmationEmailSent: true,
          shippingEmailSent: true,
          createdAt: true,
          updatedAt: true,
          reservedAt: true,
        },
      }),
      prisma.order.count(),
    ])

    return {
      orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  } catch (error) {
    console.error('Failed to load orders', error)
    return {
      orders: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    }
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const isAdmin = await requireAdmin()
  
  if (!isAdmin) {
    redirect('/admin/login')
  }

  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 20
  const ordersData = await getAllOrders(page, pageSize)

  return (
    <>
      <Navigation />
      <ErrorBoundary>
        <div className="min-h-screen bg-white page-content pb-20 px-4 sm:px-6 lg:px-8 safe-area-bottom">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                  管理员后台
                </h1>
                <p className="text-lg text-gray-700">
                  订单管理和发货系统
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="/admin/logout"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors inline-block"
                >
                  退出登录
                </a>
              </div>
            </div>

            {/* 导航标签 */}
            <div className="mb-6 flex gap-2 border-b border-gray-200">
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-gray-900"
              >
                订单管理
              </Link>
              <Link
                href="/admin/analytics"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                数据分析
              </Link>
              <Link
                href="/admin/coupons"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                优惠券管理
              </Link>
              <Link
                href="/admin/inventory"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                库存管理
              </Link>
              <Link
                href="/admin/newsletter"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Newsletter
              </Link>
              <a
                href="/api/admin/orders/export?format=csv"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                导出订单
              </a>
            </div>

            <AdminOrdersList 
              orders={ordersData.orders} 
              pagination={{
                currentPage: ordersData.page,
                totalPages: ordersData.totalPages,
                totalItems: ordersData.total,
                itemsPerPage: ordersData.pageSize,
              }}
            />
          </div>
        </div>
      </ErrorBoundary>
    </>
  )
}

