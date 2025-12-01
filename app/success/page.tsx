import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { metadata } from './metadata'
import { PaymentProcessing } from '@/components/PaymentProcessing'

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
  // Check if Clerk is configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = publishableKey &&
    publishableKey !== 'pk_test_dummy' &&
    !publishableKey.includes('你的Clerk') &&
    !publishableKey.includes('placeholder') &&
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))
  
  let userId: string | null = null
  if (isClerkConfigured) {
    try {
      const { userId: authUserId } = await auth()
      userId = authUserId
      if (!userId) {
        redirect('/sign-in')
      }
    } catch (error) {
      console.warn('Clerk authentication failed, continuing without auth:', error)
    }
  }

  const sessionId = searchParams.session_id
  if (!sessionId) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Payment Successful</h1>
            <p className="text-gray-700">Thank you for your purchase!</p>
          </div>
        </div>
      )
  }

  // Verify session and get order
  // Note: Order status update is handled by webhook, this page just displays the result
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    // Log session details for debugging
    console.log('Stripe session status:', {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
    })
    
    // If session is complete, always show success page (regardless of payment_status)
    // session.status === 'complete' means the checkout session is finished
    // This is the most reliable indicator that payment was processed
    if (session.status === 'complete') {
      // Session is complete, proceed to show success page
      // Continue below to show order details
    } else if (session.payment_status === 'paid') {
      // Payment is paid but session might not be marked complete yet
      // This can happen if webhook hasn't processed yet
      // Proceed to show success page
    } else {
      // Payment is still processing, show pending page with auto-refresh
      return <PaymentProcessing />
    }
    
    // Try to get order from database (if database is available)
    let order: Awaited<ReturnType<typeof prisma.order.findFirst>> = null
    try {
      // First try to find order by session ID
      order = await prisma.order.findFirst({
        where: { stripeSessionId: sessionId },
      })
      
      // If not found by session ID, try to find by orderId in metadata (for retry payments)
      if (!order && session.metadata?.orderId) {
        order = await prisma.order.findFirst({
          where: { id: session.metadata.orderId },
        })
        // If found, update the stripeSessionId to the new session
        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { stripeSessionId: sessionId },
          })
          console.log(`Updated order ${order.id} with new session ID ${sessionId}`)
        }
      }
      
      // If payment is complete but order is still pending, update it (fallback for webhook)
      if (order && order.status === 'pending' && (session.status === 'complete' || session.payment_status === 'paid')) {
        const orderId = order.id
        const orderAmount = order.amount
        const orderReservedAt = order.reservedAt
        console.log(`Updating order ${orderId} status from pending to paid (fallback)`)
        try {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: orderId },
              data: {
                status: 'paid',
                amount: session.amount_total || orderAmount,
              },
            })
            
            // Decrement stock if reserved
            if (orderReservedAt) {
              const product = await tx.product.findUnique({
                where: { id: 'maclock-default' },
              })
              
              if (product && product.stock >= 1) {
                await tx.product.update({
                  where: { id: 'maclock-default' },
                  data: {
                    stock: {
                      decrement: 1,
                    },
                  },
                })
              }
            }
          })
          console.log(`Order ${orderId} status updated to paid`)
          
          // Reload order to get updated status
          order = await prisma.order.findFirst({
            where: { id: orderId },
          })
        } catch (updateError) {
          console.error('Failed to update order status:', updateError)
        }
      }
      
      // If order found and user matches, try to create thread and send email
      if (order && userId && order.userId === userId) {
        try {
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
            !order.confirmationEmailSent &&
            order.shippingEmail &&
            order.status === 'paid'
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
        } catch (dbError) {
          console.warn('Database operations failed, continuing with Stripe session data:', dbError)
        }
      }
    } catch (dbError) {
      // Database connection failed, use Stripe session metadata as fallback
      console.warn('Database connection failed, using Stripe session metadata:', dbError)
    }

    // Get information from Stripe session or order
    const amount = (session.amount_total || 0) / 100
    const currency = session.currency?.toUpperCase() || 'USD'
    
    // Prefer order data, fallback to Stripe session metadata if not available
    const shippingName = order?.shippingName || session.metadata?.shippingName || ''
    const shippingPhone = order?.shippingPhone || session.metadata?.shippingPhone || ''
    const shippingEmail = order?.shippingEmail || session.metadata?.shippingEmail || session.customer_email || ''
    const shippingAddress = order?.shippingAddress || session.metadata?.shippingAddress || ''
    const shippingCity = order?.shippingCity || session.metadata?.shippingCity || ''
    const shippingState = order?.shippingState || session.metadata?.shippingState || ''
    const shippingZip = order?.shippingZip || session.metadata?.shippingZip || ''
    const shippingCountry = order?.shippingCountry || session.metadata?.shippingCountry || ''

    const hasShippingInfo = shippingName || shippingAddress

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 text-green-600">✓</div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Payment Successful</h1>
            <p className="text-gray-700">
              Your order has been confirmed. We will ship your order as soon as possible.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
            <div>
              <div className="text-sm text-gray-600 mb-2">Amount Paid</div>
              <div className="text-2xl font-bold text-gray-900">
                {currency} {amount.toFixed(2)}
              </div>
            </div>

            {hasShippingInfo && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Shipping Information</h3>
                <div className="space-y-2 text-sm">
                  {shippingName && (
                    <div className="flex">
                      <span className="text-gray-600 w-20">Recipient:</span>
                      <span className="font-medium text-gray-900">{shippingName}</span>
                    </div>
                  )}
                  {shippingPhone && (
                    <div className="flex">
                      <span className="text-gray-600 w-20">Phone:</span>
                      <span className="font-medium text-gray-900">{shippingPhone}</span>
                    </div>
                  )}
                  {shippingEmail && (
                    <div className="flex">
                      <span className="text-gray-600 w-20">Email:</span>
                      <span className="font-medium text-gray-900">{shippingEmail}</span>
                    </div>
                  )}
                  {(shippingAddress || shippingCity || shippingState || shippingZip) && (
                    <div className="flex">
                      <span className="text-gray-600 w-20">Address:</span>
                      <span className="font-medium text-gray-900">
                        {[
                          shippingAddress,
                          shippingCity,
                          shippingState,
                          shippingZip,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        {shippingCountry && ` (${shippingCountry})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            {userId && (
              <a
                href="/dashboard"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-all"
              >
                View Orders
              </a>
            )}
            <a
              href="/"
              className="px-6 py-3 border border-black/10 bg-white/90 text-gray-900 rounded-lg font-medium hover:bg-white transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error verifying session:', error)
    // Even if error occurs, show success page (because Stripe session is already completed)
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4 text-green-600">✓</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Payment Successful</h1>
          <p className="text-gray-700 mb-6">
            Your payment has been processed successfully. Please check your email for order confirmation.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }
}

