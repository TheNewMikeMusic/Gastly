import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  handleCheckoutSessionCompleted,
  handleCheckoutSessionAsyncPaymentFailed,
  handlePaymentIntentSucceeded,
} from '@/lib/stripe-webhook'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    // 在开发环境中，如果没有配置webhook secret，跳过验证（仅用于测试）
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }
    console.warn('⚠️ Webhook secret not configured, skipping signature verification (development only)')
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // 开发环境：如果没有webhook secret，尝试解析body（不安全，仅用于开发）
      event = JSON.parse(body) as Stripe.Event
      console.warn('⚠️ Parsing webhook without signature verification (development only)')
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    // 处理不同类型的事件
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event as Stripe.CheckoutSessionCompletedEvent)
        break

      case 'checkout.session.async_payment_failed':
        await handleCheckoutSessionAsyncPaymentFailed(
          event as Stripe.CheckoutSessionAsyncPaymentFailedEvent
        )
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event as Stripe.PaymentIntentSucceededEvent)
        break

      default:
        // Log unhandled events for monitoring (use error level for visibility)
        console.error(`Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// 禁用body解析，我们需要原始body来验证签名
export const runtime = 'nodejs'

