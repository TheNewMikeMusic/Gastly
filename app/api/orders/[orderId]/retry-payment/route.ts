import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.orderId

    // 获取订单，确保属于当前用户且状态为pending
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
        status: 'pending',
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or already paid' },
        { status: 404 }
      )
    }

    // 检查库存
    try {
      const { checkStock } = await import('@/lib/inventory')
      const inStock = await checkStock('maclock-default', 1)
      if (!inStock) {
        return NextResponse.json(
          { error: 'Product is out of stock' },
          { status: 400 }
        )
      }
    } catch (error) {
      console.warn('Failed to check stock, continuing anyway:', error)
    }

    const stripe = getStripe()
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    // 如果有旧的session ID，先检查它是否仍然有效
    let sessionId = order.stripeSessionId
    if (sessionId) {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(sessionId)
        // 如果session已经完成或过期，创建新的
        if (existingSession.status === 'complete' || existingSession.status === 'expired') {
          sessionId = null
        } else if (existingSession.payment_status === 'paid') {
          // 如果已经支付，更新订单状态
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'paid' },
          })
          return NextResponse.json(
            { error: 'Order already paid' },
            { status: 400 }
          )
        }
      } catch (error) {
        // Session不存在或无效，创建新的
        sessionId = null
      }
    }

    // 创建新的checkout session
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured' },
        { status: 500 }
      )
    }

    // 计算最终金额（考虑折扣）
    const finalAmount = order.amount - (order.discountAmount || 0)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      currency: order.currency || 'usd',
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'CN'],
      },
      tax_id_collection: {
        enabled: true,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/account`,
      customer_email: order.shippingEmail || undefined,
      metadata: {
        userId: userId,
        orderId: orderId,
      },
      // 如果有优惠券，应用到session
      ...(order.couponCode && {
        discounts: [
          {
            coupon: order.couponCode,
          },
        ],
      }),
    })

    // 更新订单的session ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: session.id,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Retry payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment session' },
      { status: 500 }
    )
  }
}

