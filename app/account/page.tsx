import { Navigation } from '@/components/Navigation'
import { SellerReviews } from '@/components/SellerReviews'
import { TrackingStatusBadge } from '@/components/TrackingStatusBadge'
import { SavedAddresses } from '@/components/SavedAddresses'
import { CancelOrderButton } from '@/components/CancelOrderButton'
import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { enrichOrdersWithTracking } from '@/lib/tracking'

type OrderWithShipping = Awaited<ReturnType<typeof prisma.order.findMany>>[0] & {
  shippingName?: string | null
}

type OrderWithTracking = Awaited<ReturnType<typeof enrichOrdersWithTracking>>[number]

async function getOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // 增加显示数量
    })
  } catch (error) {
    console.error('Failed to load orders', error)
    return []
  }
}

export default async function AccountPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const orders = await getOrders(userId)
  const ordersWithTracking: OrderWithTracking[] = await enrichOrdersWithTracking(orders)

  // 统计信息
  const totalOrders = orders.length
  const paidOrders = orders.filter((o) => o.status === 'paid').length
  const shippedOrders = ordersWithTracking.filter((o) => o.status === 'paid' && o.trackingSnapshot?.trackingNumber).length
  const deliveredOrders = ordersWithTracking.filter((o) => o.trackingSnapshot?.status === 'delivered').length

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">My Orders</h1>
            <p className="text-lg text-gray-700">
              View and track all your orders and shipping information.
            </p>
          </header>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Orders" value={totalOrders} />
            <StatCard label="Paid Orders" value={paidOrders} />
            <StatCard label="Shipped" value={shippedOrders} />
            <StatCard label="Delivered" value={deliveredOrders} />
          </div>

          {/* 账户信息 */}
          <section className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Account Information</h2>
            <dl className="grid gap-6 sm:grid-cols-2">
              <InfoField label="Full Name" value={user?.fullName || 'Not set'} />
              <InfoField
                label="Email Address"
                value={user?.emailAddresses[0]?.emailAddress || 'Not set'}
              />
              {user?.phoneNumbers[0]?.phoneNumber && (
                <InfoField label="Phone Number" value={user.phoneNumbers[0].phoneNumber} />
              )}
              <InfoField
                label="Account Created"
                value={
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'
                }
              />
            </dl>
          </section>

          {/* 订单列表 */}
          <section className="glass rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Order History</h2>
                <p className="text-sm text-gray-600">All your orders with shipping and tracking information.</p>
              </div>
            </div>

            {ordersWithTracking.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No orders yet.</p>
                <Link
                  href="/checkout"
                  className="inline-block px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-950 shadow-deep transition-all duration-200 ease-apple-standard"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersWithTracking.map((order) => {
                  const shipping = order as OrderWithShipping
                  const tracking = order.trackingSnapshot
                  const lastEvent =
                    tracking && tracking.events.length > 0
                      ? tracking.events[tracking.events.length - 1]
                      : null

                  return (
                    <div
                      key={order.id}
                      className="border border-black/10 rounded-xl p-5 transition-all hover:border-gray-900/20 hover:shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="font-semibold text-gray-900">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status === 'paid'
                                ? 'Paid'
                                : order.status === 'pending'
                                ? 'Pending'
                                : order.status}
                            </span>
                            {tracking && (
                              <TrackingStatusBadge
                                status={tracking.status}
                                label={tracking.statusLabel}
                              />
                            )}
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {order.currency.toUpperCase()} {(order.amount / 100).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Ordered on{' '}
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:items-end">
                          {tracking && tracking.trackingNumber && (
                            <Link
                              href={`/account/track/${order.id}`}
                              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-950 transition-colors text-center"
                            >
                              Track Package
                            </Link>
                          )}
                          {order.status === 'paid' && !tracking?.trackingNumber && (
                            <span className="text-sm text-gray-500">Preparing for shipment</span>
                          )}
                          {order.status === 'paid' && (
                            <CancelOrderButton orderId={order.id} />
                          )}
                        </div>
                      </div>

                      {/* 收货地址信息 */}
                      {(shipping.shippingName ||
                        shipping.shippingAddress ||
                        shipping.shippingCity ||
                        shipping.shippingState ||
                        shipping.shippingZip) && (
                        <div className="border-t border-black/10 pt-4">
                          <h3 className="text-sm font-semibold mb-2 text-gray-900">
                            Shipping Address
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            {shipping.shippingName && (
                              <div>
                                <span className="text-gray-500">Recipient: </span>
                                <span className="text-gray-900 font-medium">{shipping.shippingName}</span>
                              </div>
                            )}
                            {shipping.shippingPhone && (
                              <div>
                                <span className="text-gray-500">Phone: </span>
                                <span className="text-gray-900 font-medium">{shipping.shippingPhone}</span>
                              </div>
                            )}
                            {(shipping.shippingAddress ||
                              shipping.shippingCity ||
                              shipping.shippingState ||
                              shipping.shippingZip) && (
                              <div>
                                <span className="text-gray-500">Address: </span>
                                <span className="text-gray-900 font-medium">
                                  {[
                                    shipping.shippingAddress,
                                    shipping.shippingCity,
                                    shipping.shippingState,
                                    shipping.shippingZip,
                                  ]
                                    .filter(Boolean)
                                    .join(', ')}
                                  {shipping.shippingCountry && `, ${shipping.shippingCountry}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 物流跟踪信息 */}
                      {tracking && tracking.trackingNumber && (
                        <div className="border-t border-black/10 pt-4 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold mb-1 text-gray-900">4PX Tracking</p>
                              <p className="text-sm text-gray-600">
                                Tracking number: <span className="font-mono font-medium">{tracking.trackingNumber}</span>
                                {tracking.fallback && (
                                  <span className="text-xs text-gray-500 ml-2">(sample data)</span>
                                )}
                              </p>
                            </div>
                          </div>
                          {lastEvent && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-900 font-medium">{lastEvent.description}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                {lastEvent.location && <span>{lastEvent.location} · </span>}
                                {formatDisplayDate(lastEvent.time)}
                              </div>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {tracking.lastSyncedAt && (
                              <span>Last synced: {formatDisplayDate(tracking.lastSyncedAt)}</span>
                            )}
                            <Link
                              href={`/account/track/${order.id}`}
                              className="inline-flex items-center gap-1 font-medium text-gray-900 hover:text-gray-950 group"
                            >
                              View full tracking details
                              <span
                                aria-hidden="true"
                                className="transition-transform group-hover:translate-x-0.5"
                              >
                                →
                              </span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* 保存的地址 */}
          <section className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Saved Addresses</h2>
            <SavedAddresses showAddButton={true} />
          </section>

          <SellerReviews variant="dashboard" />
        </div>
      </div>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-600">{label}</dt>
      <dd className="text-lg font-semibold text-gray-900 mt-1">{value}</dd>
    </div>
  )
}

function formatDisplayDate(value: string | Date | null | undefined) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
