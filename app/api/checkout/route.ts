import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user email from Clerk
    const { currentUser } = await import('@clerk/nextjs/server')
    const user = await currentUser()

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
    if (!priceId) {
      return Response.json({ error: 'Price ID not configured' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      currency: 'usd',
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'CN'],
      },
      tax_id_collection: {
        enabled: true,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#features`,
      customer_email: user?.emailAddresses[0]?.emailAddress,
      metadata: {
        userId: userId,
      },
    })

    // Create order record
    const { prisma } = await import('@/lib/prisma')
    await prisma.order.create({
      data: {
        userId: userId,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'pending',
        stripeSessionId: session.id,
      },
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

