import Stripe from 'stripe'
import { prisma } from './prisma'
import { releaseStock } from './inventory'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  })
}

export async function createRefund(orderId: string, reason?: string): Promise<{
  success: boolean
  refundId?: string
  error?: string
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    if (order.status !== 'paid') {
      return { success: false, error: 'Order is not paid, cannot refund' }
    }

    if (order.status === 'refunded') {
      return { success: false, error: 'Order already refunded' }
    }

    // 获取Stripe payment intent
    const stripe = getStripe()
    let paymentIntentId: string | null = null

    if (order.stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId, {
          expand: ['payment_intent'],
        })
        if (session.payment_intent) {
          paymentIntentId =
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent.id
        }
      } catch (error) {
        console.error('Failed to retrieve session:', error)
      }
    }

    if (!paymentIntentId) {
      return { success: false, error: 'Payment intent not found' }
    }

    // 创建退款
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason ? (reason.includes('fraudulent') ? 'fraudulent' : 'requested_by_customer') : undefined,
      metadata: {
        orderId: order.id,
        reason: reason || 'Customer cancellation',
      },
    })

    // 更新订单状态
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'refunded',
        refundAmount: refund.amount,
        refundReason: reason || 'Customer cancellation',
        refundedAt: new Date(),
      },
    })

    // 释放库存
    await releaseStock('maclock-default', 1)

    return {
      success: true,
      refundId: refund.id,
    }
  } catch (error: any) {
    console.error('Failed to create refund:', error)
    return {
      success: false,
      error: error.message || 'Failed to create refund',
    }
  }
}

