import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  // 使用稳定的 Stripe API 版本
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
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
    const body = await request.json()
    const shippingData: ShippingData = body
    const couponCode = body.couponCode
    
    // 初步检查库存（最终检查在事务内进行）
    try {
      const { checkStock } = await import('@/lib/inventory')
      const inStock = await checkStock('maclock-default', 1)
      if (!inStock) {
        return Response.json({ error: 'Product is out of stock' }, { status: 400 })
      }
    } catch (error) {
      console.warn('Failed to check stock, continuing anyway:', error)
    }
    
    // 如果没有 Clerk，使用基于邮箱的临时用户 ID
    if (!userId) {
      // 使用简单的哈希生成临时用户 ID（仅用于测试）
      const crypto = await import('crypto')
      userId = `temp_${crypto.createHash('md5').update(shippingData.email || 'anonymous').digest('hex').substring(0, 16)}`
    }
    
    // Validate shipping data with detailed validation
    const { validateEmail, validatePhone, validateName, validateAddress, validateCity, validateState, validateZip } = await import('@/lib/validation')
    
    const nameResult = validateName(shippingData.name)
    if (!nameResult.valid) {
      return Response.json({ error: nameResult.error || 'Invalid name' }, { status: 400 })
    }

    const phoneResult = validatePhone(shippingData.phone, shippingData.country)
    if (!phoneResult.valid) {
      return Response.json({ error: phoneResult.error || 'Invalid phone number' }, { status: 400 })
    }

    const emailResult = validateEmail(shippingData.email)
    if (!emailResult.valid) {
      return Response.json({ error: emailResult.error || 'Invalid email' }, { status: 400 })
    }

    const addressResult = validateAddress(shippingData.address)
    if (!addressResult.valid) {
      return Response.json({ error: addressResult.error || 'Invalid address' }, { status: 400 })
    }

    const cityResult = validateCity(shippingData.city)
    if (!cityResult.valid) {
      return Response.json({ error: cityResult.error || 'Invalid city' }, { status: 400 })
    }

    const stateResult = validateState(shippingData.state, shippingData.country)
    if (!stateResult.valid) {
      return Response.json({ error: stateResult.error || 'Invalid state/province' }, { status: 400 })
    }

    const zipResult = validateZip(shippingData.zip, shippingData.country)
    if (!zipResult.valid) {
      return Response.json({ error: zipResult.error || 'Invalid ZIP/postal code' }, { status: 400 })
    }

    // 验证和应用优惠券
    let discountAmount = 0
    if (couponCode) {
      try {
        const { validateCoupon } = await import('@/lib/coupon')
        const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
        if (priceId) {
          const stripe = getStripe()
          const price = await stripe.prices.retrieve(priceId)
          const orderAmount = price.unit_amount || 0
          const couponResult = await validateCoupon(couponCode, orderAmount)
          if (couponResult.valid) {
            discountAmount = couponResult.discountAmount
          }
        }
      } catch (error) {
        console.warn('Failed to validate coupon, continuing without discount:', error)
      }
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
    if (!priceId) {
      return Response.json({ error: 'Price ID not configured' }, { status: 500 })
    }

    // 在开发环境中，使用请求的 origin 作为 baseUrl，避免跳转到生产服务器
    // 在生产环境中，使用配置的 NEXT_PUBLIC_URL
    const isDevelopment = process.env.NODE_ENV === 'development'
    const baseUrl = isDevelopment 
      ? (request.headers.get('origin') || 'http://localhost:3000')
      : (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000')

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
    let basePrice: number = 0
    try {
      const price = await stripe.prices.retrieve(priceId)
      basePrice = price.unit_amount || 0
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

    // 如果有优惠券，创建Stripe Coupon并应用到session
    let discounts: Array<{ coupon: string }> | undefined = undefined
    if (couponCode && discountAmount > 0) {
      try {
        const { createStripeCoupon } = await import('@/lib/coupon')
        const stripeCouponId = await createStripeCoupon(couponCode)
        if (stripeCouponId) {
          discounts = [{ coupon: stripeCouponId }]
        } else {
          console.warn('Failed to create Stripe coupon, continuing without discount')
        }
      } catch (error) {
        console.warn('Failed to apply coupon to Stripe session:', error)
      }
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
      allow_promotion_codes: !couponCode, // 如果已使用优惠券，禁用promotion codes
      ...(discounts ? { discounts } : {}),
      // 不收集配送地址，因为我们已经在自己的表单中收集了
      // 地址信息已存储在 metadata 中，并在订单创建时保存到数据库
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: shippingData.email || userEmail,
      // 将收货信息存储在 metadata 中（作为备份，主要数据在数据库中）
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
        couponCode: couponCode || '',
      },
    })

    // 使用事务创建订单并预留库存
    const { prisma } = await import('@/lib/prisma')
    try {
      await prisma.$transaction(async (tx) => {
        // 检查并预留库存（在事务内）
        const { checkStock, reserveStock } = await import('@/lib/inventory')
        const inStock = await checkStock('maclock-default', 1, tx)
        if (!inStock) {
          throw new Error('Product is out of stock')
        }

        const reserved = await reserveStock('maclock-default', 1, tx)
        if (!reserved) {
          throw new Error('Failed to reserve stock')
        }

        // 创建订单记录，设置预留时间
        // 注意：如果优惠券已应用到Stripe session，session.amount_total已经是折扣后的金额
        // 但此时session可能还未完成，所以使用basePrice减去discountAmount
        const orderAmount = basePrice > 0 ? basePrice - discountAmount : (session.amount_total || 0)
        await tx.order.create({
          data: {
            userId: userId,
            amount: orderAmount, // 应用折扣后的金额（webhook中会用实际支付金额更新）
            currency: session.currency || 'usd',
            status: 'pending',
            stripeSessionId: session.id,
            couponCode: couponCode || null,
            discountAmount: discountAmount,
            reservedAt: new Date(), // 记录预留时间
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
      })

      // 在事务外更新优惠券使用次数
      if (couponCode) {
        try {
          const { applyCoupon } = await import('@/lib/coupon')
          await applyCoupon(couponCode, session.id)
        } catch (error) {
          console.warn('Failed to apply coupon:', error)
          // 不影响订单创建，可以在webhook中重试
        }
      }
    } catch (dbError: any) {
      // 如果数据库操作失败，记录错误但继续返回 Stripe session URL
      // 这样用户仍然可以完成支付，订单可以在 webhook 中创建
      console.warn('Failed to create order record:', dbError)
      console.warn('Stripe session created successfully, but order record failed. Session ID:', session.id)
      
      // 如果是库存不足错误，返回错误
      if (dbError.message?.includes('stock')) {
        return Response.json({ error: dbError.message }, { status: 400 })
      }
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
      } else if (error && typeof error === 'object' && 'type' in error && typeof (error as any).type === 'string' && (error as any).type.startsWith('Stripe')) {
        // Stripe API 错误
        const stripeError = error as { type?: string; message?: string }
        errorMessage = `Stripe error: ${stripeError.message || (error as any).message}`
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

