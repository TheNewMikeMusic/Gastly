import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  // 使用稳定的 Stripe API 版本
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  })
}

interface ShippingData {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export async function POST(request: Request) {
  try {
    // 检查 Clerk 是否配置
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const isClerkConfigured = publishableKey && publishableKey !== 'pk_test_dummy' && !publishableKey.includes('你的Clerk')
    
    let userId: string | null = null
    let userEmail: string | undefined = undefined
    
    if (isClerkConfigured) {
      try {
        const { auth, currentUser } = await import('@clerk/nextjs/server')
        const authResult = await auth()
        userId = authResult.userId
        if (!userId) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const user = await currentUser()
        userEmail = user?.emailAddresses[0]?.emailAddress
      } catch (e) {
        console.warn('Clerk authentication failed, continuing without auth')
      }
    }
    
    // Get shipping data from request body
    const shippingData: ShippingData = await request.json()
    
    // 如果没有 Clerk，使用基于邮箱的临时用户 ID
    if (!userId) {
      // 使用简单的哈希生成临时用户 ID（仅用于测试）
      const crypto = await import('crypto')
      userId = `temp_${crypto.createHash('md5').update(shippingData.email || 'anonymous').digest('hex').substring(0, 16)}`
    }
    
    // Validate shipping data
    if (!shippingData.name || !shippingData.phone || !shippingData.email || 
        !shippingData.address || !shippingData.city || !shippingData.state || 
        !shippingData.zip || !shippingData.country) {
      return Response.json({ error: 'Missing required shipping information' }, { status: 400 })
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
    if (!priceId) {
      return Response.json({ error: 'Price ID not configured' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    const stripe = getStripe()
    
    // 验证 Price ID 格式
    if (!priceId.startsWith('price_')) {
      return Response.json(
        { error: `Invalid Price ID format. Price ID should start with "price_". Current value: ${priceId.substring(0, 20)}...` },
        { status: 500 }
      )
    }
    
    // 获取价格信息以确定是订阅还是单次支付
    let priceMode: 'payment' | 'subscription' = 'payment'
    try {
      const price = await stripe.prices.retrieve(priceId)
      // 如果价格有 recurring 属性，说明是订阅价格
      if (price.type === 'recurring') {
        priceMode = 'subscription'
      } else if (price.type === 'one_time') {
        priceMode = 'payment'
      }
    } catch (priceError) {
      console.warn('Failed to retrieve price info, defaulting to payment mode:', priceError)
      // 如果获取价格信息失败，默认使用 payment 模式
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: priceMode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      currency: 'usd',
      allow_promotion_codes: true,
      ...(priceMode === 'payment' ? {
        // 单次支付模式：收集配送地址
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'CN'],
        },
        tax_id_collection: {
          enabled: true,
        },
      } : {
        // 订阅模式：不收集配送地址（订阅通常不需要配送）
      }),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: shippingData.email || userEmail,
      metadata: {
        userId: userId,
        shippingName: shippingData.name,
        shippingPhone: shippingData.phone,
        shippingEmail: shippingData.email,
        shippingAddress: shippingData.address,
        shippingCity: shippingData.city,
        shippingState: shippingData.state,
        shippingZip: shippingData.zip,
        shippingCountry: shippingData.country,
      },
    })

    // Create order record with shipping information
    try {
      const { prisma } = await import('@/lib/prisma')
      await prisma.order.create({
        data: {
          userId: userId,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'pending',
          stripeSessionId: session.id,
          shippingName: shippingData.name,
          shippingPhone: shippingData.phone,
          shippingEmail: shippingData.email,
          shippingAddress: shippingData.address,
          shippingCity: shippingData.city,
          shippingState: shippingData.state,
          shippingZip: shippingData.zip,
          shippingCountry: shippingData.country,
        },
      })
    } catch (dbError) {
      // 如果数据库操作失败，记录错误但继续返回 Stripe session URL
      // 这样用户仍然可以完成支付，订单可以在 webhook 中创建
      console.warn('Failed to create order record:', dbError)
      console.warn('Stripe session created successfully, but order record failed. Session ID:', session.id)
    }

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    
    // 提供更详细的错误信息
    let errorMessage = 'Failed to create checkout session'
    let statusCode = 500
    
    if (error instanceof Error) {
      // Stripe 错误
      if (error.message.includes('STRIPE_SECRET_KEY')) {
        errorMessage = 'Stripe secret key is not configured. Please check your environment variables.'
        statusCode = 500
      } else if (error.message.includes('Price ID')) {
        errorMessage = 'Stripe Price ID is not configured. Please check your environment variables.'
        statusCode = 500
      } else if (error.message.includes('Unauthorized')) {
        errorMessage = 'You must be logged in to complete checkout.'
        statusCode = 401
      } else if (error.message.includes('Missing required')) {
        errorMessage = error.message
        statusCode = 400
      } else if (error && typeof error === 'object' && 'type' in error && error.type?.startsWith('Stripe')) {
        // Stripe API 错误
        const stripeError = error as { type?: string; message?: string }
        errorMessage = `Stripe error: ${stripeError.message || error.message}`
        if (stripeError.type === 'StripeInvalidRequestError') {
          errorMessage = `Invalid Stripe request: ${stripeError.message || error.message}. Please check your Price ID and Stripe configuration.`
        }
      } else {
        // 记录完整的错误信息用于调试
        console.error('Full error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        })
        errorMessage = `Checkout failed: ${error.message}`
      }
    }
    
    return Response.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

