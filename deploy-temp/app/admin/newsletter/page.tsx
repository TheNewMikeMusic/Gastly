import { redirect } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { getAllSubscribers } from '@/lib/newsletter'
import { AdminNewsletterManagement } from '@/components/AdminNewsletterManagement'
import Link from 'next/link'

export default async function AdminNewsletterPage() {
  const isAdmin = await requireAdmin()
  
  if (!isAdmin) {
    redirect('/admin/login')
  }

  const subscribers = await getAllSubscribers(false) // 获取所有订阅者，包括已退订的

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white page-content pb-20 px-4 sm:px-6 lg:px-8 safe-area-bottom">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Newsletter管理
              </h1>
              <p className="text-lg text-gray-700">
                管理Newsletter订阅者
              </p>
            </div>
            <a
              href="/admin/logout"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors inline-block"
            >
              退出登录
            </a>
          </div>

          {/* 导航标签 */}
          <div className="mb-6 flex gap-2 border-b border-gray-200">
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-gray-900"
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

          <AdminNewsletterManagement subscribers={subscribers} />
        </div>
      </div>
    </>
  )
}

