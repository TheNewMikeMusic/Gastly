import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { metadata } from './metadata'

export { metadata }
export const dynamic = 'force-dynamic'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const sessionId = searchParams.session_id
  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
          <p className="text-foreground/70">Thank you for your purchase!</p>
        </div>
      </div>
    )
  }

  // Verify session and get order
  // Note: Order status update is handled by webhook, this page just displays the result
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    // Get order (may not be updated yet if webhook hasn't processed)
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
    })

    if (order && order.userId === userId) {
      // Create thread for buyer (if not exists)
      const existingThread = await prisma.thread.findFirst({
        where: { buyerId: userId },
      })

      if (!existingThread) {
        await prisma.thread.create({
          data: {
            buyerId: userId,
          },
        })
      }

      // Send order confirmation email (if not sent yet and webhook hasn't processed)
      // This is a fallback in case webhook fails
      if (
        session.payment_status === 'paid' &&
        !order.confirmationEmailSent &&
        order.shippingEmail &&
        order.status === 'pending'
      ) {
        try {
          const { sendOrderConfirmationEmail } = await import('@/lib/email')
          await sendOrderConfirmationEmail(order)
          await prisma.order.update({
            where: { id: order.id },
            data: { confirmationEmailSent: true },
          })
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
        }
      }
    }

    const amount = (session.amount_total || 0) / 100
    const currency = session.currency?.toUpperCase() || 'USD'

    // Get order with shipping information
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
    })

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-2">支付成功</h1>
            <p className="text-foreground/70">
              您的订单已确认，我们将尽快为您发货。
            </p>
          </div>

          <div className="glass rounded-lg p-6 space-y-6">
            <div>
              <div className="text-sm text-foreground/60 mb-2">支付金额</div>
              <div className="text-2xl font-bold">
                {currency} {amount.toFixed(2)}
              </div>
            </div>

            {order && (order.shippingName || order.shippingAddress) && (
              <div className="border-t border-black/10 pt-6">
                <h3 className="text-lg font-semibold mb-4">物流信息</h3>
                <div className="space-y-2 text-sm">
                  {order.shippingName && (
                    <div className="flex">
                      <span className="text-foreground/60 w-20">收货人：</span>
                      <span className="font-medium">{order.shippingName}</span>
                    </div>
                  )}
                  {order.shippingPhone && (
                    <div className="flex">
                      <span className="text-foreground/60 w-20">联系电话：</span>
                      <span className="font-medium">{order.shippingPhone}</span>
                    </div>
                  )}
                  {order.shippingEmail && (
                    <div className="flex">
                      <span className="text-foreground/60 w-20">邮箱：</span>
                      <span className="font-medium">{order.shippingEmail}</span>
                    </div>
                  )}
                  {(order.shippingAddress || order.shippingCity || order.shippingState || order.shippingZip) && (
                    <div className="flex">
                      <span className="text-foreground/60 w-20">收货地址：</span>
                      <span className="font-medium">
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
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-all"
            >
              查看订单
            </a>
            <a
              href="/"
              className="px-6 py-3 border border-black/10 bg-white/90 text-gray-900 rounded-lg font-medium hover:bg-white transition-all"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error verifying session:', error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Payment Processing</h1>
          <p className="text-foreground/70">
            Your payment is being processed. Please check your email for confirmation.
          </p>
        </div>
      </div>
    )
  }
}

