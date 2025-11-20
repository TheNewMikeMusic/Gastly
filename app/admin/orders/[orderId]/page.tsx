import { redirect } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { OrderDetail } from '@/components/OrderDetail'

async function getOrder(orderId: string) {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
    })
  } catch (error) {
    console.error('Failed to load order', error)
    return null
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string }
}) {
  const isAdmin = await requireAdmin()
  
  if (!isAdmin) {
    redirect('/admin/login')
  }

  const order = await getOrder(params.orderId)

  if (!order) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-gray-600 mb-4">订单不存在</p>
              <a
                href="/admin"
                className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-950 transition-colors"
              >
                返回订单列表
              </a>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <a
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
            >
              ← 返回订单列表
            </a>
          </div>
          <OrderDetail order={order} />
        </div>
      </div>
    </>
  )
}

