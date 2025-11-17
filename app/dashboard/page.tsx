import { Navigation } from '@/components/Navigation'

async function getOrders(userId: string) {
  try {
    const { prisma } = await import('@/lib/prisma')
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
    const { prisma } = await import('@/lib/prisma')
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
  const hasClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_dummy'
  
  let userId: string | null = null
  if (hasClerk) {
    try {
      const { auth } = await import('@clerk/nextjs/server')
      const authResult = await auth()
      userId = authResult.userId
      if (!userId) {
        const { redirect } = await import('next/navigation')
        redirect('/login')
      }
    } catch {
      // Clerk not available
    }
  }
  
  // 预览模式：显示示例数据
  const orders = userId ? await getOrders(userId) : []
  const threads = userId ? await getThreads(userId) : []

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
          
          {!hasClerk && (
            <div className="glass rounded-lg p-6 mb-8 bg-yellow-50 border border-yellow-200">
              <p className="text-foreground/70">
                <strong>Preview Mode:</strong> Clerk authentication is not configured. 
                Configure Clerk keys in .env.local to enable full functionality.
              </p>
            </div>
          )}

          {/* Orders Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Orders</h2>
            {orders.length === 0 ? (
              <div className="glass rounded-lg p-8 text-center">
                <p className="text-foreground/70">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="glass rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold mb-1">
                        {order.currency.toUpperCase()} {(order.amount / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-foreground/60">
                        {new Date(order.createdAt).toLocaleDateString()}
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
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Messages Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Messages</h2>
            {threads.length === 0 ? (
              <div className="glass rounded-lg p-8 text-center">
                <p className="text-foreground/70">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    className="glass rounded-lg p-6"
                  >
                    <div className="text-sm text-foreground/60 mb-2">
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </div>
                    {thread.messages.length > 0 && (
                      <p className="text-foreground/80">
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
