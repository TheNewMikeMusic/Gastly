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
    redirect('/login')
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

  // Verify session and update order
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid') {
      await prisma.order.updateMany({
        where: { stripeSessionId: sessionId },
        data: { status: 'paid' },
      })

      // Create thread for buyer
      const order = await prisma.order.findFirst({
        where: { stripeSessionId: sessionId },
      })

      if (order && order.userId === userId) {
        // Check if thread already exists
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
      }
    }

    const amount = (session.amount_total || 0) / 100
    const currency = session.currency?.toUpperCase() || 'USD'

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold">Payment Successful</h1>
          <p className="text-foreground/70">
            Your order has been confirmed. You will receive a confirmation email shortly.
          </p>
          <div className="glass rounded-lg p-6 mt-8">
            <div className="text-sm text-foreground/60 mb-2">Amount Paid</div>
            <div className="text-2xl font-bold">
              {currency} {amount.toFixed(2)}
            </div>
          </div>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            View Orders
          </a>
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

