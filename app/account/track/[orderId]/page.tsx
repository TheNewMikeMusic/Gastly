import { Navigation } from '@/components/Navigation'
import { TrackingStatusBadge } from '@/components/TrackingStatusBadge'
import { TrackingTimeline } from '@/components/TrackingTimeline'
import { RetryPaymentButton } from '@/components/RetryPaymentButton'
import { DeleteOrderButton } from '@/components/DeleteOrderButton'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getTrackingSnapshotForOrder } from '@/lib/tracking'

interface TrackingPageProps {
  params: { orderId: string }
  searchParams: { refresh?: string }
}

export default async function AccountTrackingPage({ params, searchParams }: TrackingPageProps) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // 确保用户只能访问自己的订单
  const order = await prisma.order.findFirst({
    where: { 
      id: params.orderId,
      userId: userId, // 关键：只查询属于当前用户的订单
    },
  })

  if (!order) {
    notFound()
  }

  const tracking = await getTrackingSnapshotForOrder(order, {
    force: searchParams?.refresh === '1',
  })

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white page-content pb-16 px-4 sm:px-6 lg:px-8 safe-area-bottom">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* 页面头部 */}
          <div className="space-y-3">
            <Link
              href="/account"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to My Orders
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Package Tracking
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time tracking information for your order
              </p>
            </div>
          </div>

          {/* 订单概览卡片 */}
          <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {order.currency.toUpperCase()} {(order.amount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status === 'paid' ? 'Paid' : order.status === 'pending' ? 'Pending' : order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {tracking ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Shipping Status</p>
                      <TrackingStatusBadge status={tracking.status} label={tracking.statusLabel} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                      <p className="text-lg font-semibold text-gray-900 font-mono break-all">
                        {tracking.trackingNumber}
                      </p>
                      {tracking.fallback && (
                        <p className="text-xs text-gray-500 mt-1">Using sample data</p>
                      )}
                    </div>
                    {tracking.eta && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                        <p className="text-base font-medium text-gray-900">
                          {formatDateTime(tracking.eta)}
                        </p>
                      </div>
                    )}
                    {tracking.lastSyncedAt && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(tracking.lastSyncedAt)}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-2">No tracking information available yet</p>
                    <p className="text-sm text-gray-500">
                      Your order is being prepared for shipment
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 收货地址信息 */}
          {(order.shippingName ||
            order.shippingAddress ||
            order.shippingCity ||
            order.shippingZip) && (
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Shipping Address</h2>
              <div className="space-y-2 text-gray-700">
                {order.shippingName && (
                  <p className="text-base font-medium text-gray-900">{order.shippingName}</p>
                )}
                {order.shippingPhone && (
                  <p className="text-sm text-gray-600">{order.shippingPhone}</p>
                )}
                {(order.shippingAddress ||
                  order.shippingCity ||
                  order.shippingState ||
                  order.shippingZip) && (
                  <p className="text-sm text-gray-600">
                    {[
                      order.shippingAddress,
                      order.shippingCity,
                      order.shippingState,
                      order.shippingZip,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                    {order.shippingCountry && `, ${order.shippingCountry}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 物流轨迹详情 */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tracking Timeline</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed shipping updates from 4PX
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/account/track/${order.id}?refresh=1`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  prefetch={false}
                >
                  Refresh Tracking
                </Link>
                {tracking?.trackingNumber && (
                  <a
                    href={`https://track.4px.com/?trackingNumber=${tracking.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-950 transition-colors"
                  >
                    View on 4PX →
                  </a>
                )}
              </div>
            </div>

            {tracking ? (
              <TrackingTimeline events={tracking.events} />
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-600 mb-2">No tracking information available</p>
                <p className="text-sm text-gray-500">
                  Tracking details will appear here once your order is shipped
                </p>
              </div>
            )}
          </div>

          {/* 继续支付按钮（如果是pending状态） */}
          {order.status === 'pending' && (
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Complete Payment</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your order is pending payment. Click the button below to complete your payment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <RetryPaymentButton orderId={order.id} />
                <DeleteOrderButton orderId={order.id} orderStatus={order.status} />
              </div>
            </div>
          )}

          {/* 删除订单按钮（如果是cancelled状态） */}
          {order.status === 'cancelled' && (
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Delete Order</h2>
              <p className="text-sm text-gray-600 mb-4">
                This order has been cancelled. You can delete it to remove it from your order history.
              </p>
              <DeleteOrderButton orderId={order.id} orderStatus={order.status} />
            </div>
          )}

          {/* 发票下载 */}
          {order.status === 'paid' && (
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Invoice</h2>
              <p className="text-sm text-gray-600 mb-4">
                Download your invoice for this order.
              </p>
              <a
                href={`/api/orders/${order.id}/invoice`}
                target="_blank"
                className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-colors"
              >
                Download Invoice
              </a>
            </div>
          )}

          {/* 帮助信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800 mb-4">
              If you have questions about your shipment or need assistance, please contact our support team.
            </p>
            <Link
              href="/contact"
              className="inline-block px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
