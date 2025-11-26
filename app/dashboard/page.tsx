import { Navigation } from '@/components/Navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { RetryPaymentButton } from '@/components/RetryPaymentButton'
import { DeleteOrderButton } from '@/components/DeleteOrderButton'

async function getOrders(userId: string) {
  try {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

async function getThreads(userId: string) {
  try {
    return prisma.thread.findMany({
      where: { buyerId: userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const orders = await getOrders(userId)
  const threads = await getThreads(userId)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white page-content pb-20 px-4 sm:px-6 lg:px-8 safe-area-bottom">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Dashboard
            </h1>
            <p className="text-lg text-gray-700">
              Manage your orders and messages.
            </p>
          </div>

          {/* Orders Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Orders</h2>
              {orders.length > 0 && (
                <Link
                  href="/account"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  View account →
                </Link>
              )}
            </div>
            {orders.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-gray-600 mb-6">No orders yet.</p>
                <Link
                  href="/checkout"
                  className="inline-block px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-950 shadow-deep transition-all duration-200 ease-apple-standard"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="glass rounded-2xl p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="font-semibold mb-1 text-gray-900">
                          {order.currency.toUpperCase()} {(order.amount / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                    {(order.shippingName || order.shippingAddress) && (
                      <div className="border-t border-black/10 pt-4">
                        <h3 className="text-sm font-semibold mb-2 text-gray-900">Shipping Information</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          {order.shippingName && (
                            <div>Recipient: <span className="text-gray-900 font-medium">{order.shippingName}</span></div>
                          )}
                          {order.shippingPhone && (
                            <div>Phone: <span className="text-gray-900 font-medium">{order.shippingPhone}</span></div>
                          )}
                          {(order.shippingAddress || order.shippingCity || order.shippingState || order.shippingZip) && (
                            <div>
                              Address: <span className="text-gray-900 font-medium">
                                {[
                                  order.shippingAddress,
                                  order.shippingCity,
                                  order.shippingState,
                                  order.shippingZip,
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                {order.shippingCountry && ` (${order.shippingCountry})`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/10">
                      <Link
                        href={`/account/track/${order.id}`}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      {order.status === 'pending' && (
                        <RetryPaymentButton orderId={order.id} />
                      )}
                      <DeleteOrderButton orderId={order.id} orderStatus={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Messages Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Messages</h2>
            {threads.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-gray-600">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    className="glass rounded-2xl p-6"
                  >
                    <div className="text-sm text-gray-600 mb-2">
                      {new Date(thread.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    {thread.messages.length > 0 && (
                      <p className="text-gray-900">
                        {thread.messages[0].body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
