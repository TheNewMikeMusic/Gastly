import { Navigation } from '@/components/Navigation'
import { SellerReviews } from '@/components/SellerReviews'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getOrders(userId: string) {
  try {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  } catch {
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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Account
            </h1>
            <p className="text-lg text-gray-700">
              Manage your account settings and view your orders.
            </p>
          </div>

          <div className="space-y-8">
            {/* Account Information */}
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Full Name
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {user?.fullName || 'Not set'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Email Address
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {user?.emailAddresses[0]?.emailAddress || 'Not set'}
                  </div>
                </div>
                {user?.phoneNumbers[0]?.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      Phone Number
                    </label>
                    <div className="text-lg font-medium text-gray-900">
                      {user.phoneNumbers[0].phoneNumber}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Account Created
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                {orders.length > 0 && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    View all →
                  </Link>
                )}
              </div>
              
              {orders.length === 0 ? (
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
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-black/10 rounded-xl p-4 hover:border-gray-900/20 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">
                            {order.currency.toUpperCase()} {(order.amount / 100).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          {order.shippingName && (
                            <div className="text-sm text-gray-600 mt-1">
                              Shipping to: {order.shippingName}
                            </div>
                          )}
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-black/10 bg-white/90 p-4 hover:bg-white hover:border-gray-900/20 transition-all duration-200 ease-apple-standard group"
                >
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-gray-950">
                    View Dashboard
                  </div>
                  <div className="text-sm text-gray-600">
                    Manage orders and messages
                  </div>
                </Link>
                <Link
                  href="/checkout"
                  className="rounded-xl border border-black/10 bg-white/90 p-4 hover:bg-white hover:border-gray-900/20 transition-all duration-200 ease-apple-standard group"
                >
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-gray-950">
                    Buy Hello1984
                  </div>
                  <div className="text-sm text-gray-600">
                    Add to your collection
                  </div>
                </Link>
              </div>
            </div>

            <SellerReviews variant="dashboard" />
          </div>
        </div>
      </div>
    </>
  )
}

