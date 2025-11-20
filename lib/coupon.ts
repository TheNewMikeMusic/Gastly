import { prisma } from './prisma'

export interface CouponValidationResult {
  valid: boolean
  discountAmount: number
  error?: string
}

export async function validateCoupon(
  code: string,
  orderAmount: number
): Promise<CouponValidationResult> {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return {
        valid: false,
        discountAmount: 0,
        error: 'Invalid coupon code',
      }
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        discountAmount: 0,
        error: 'This coupon is no longer active',
      }
    }

    const now = new Date()
    if (now < coupon.validFrom) {
      return {
        valid: false,
        discountAmount: 0,
        error: 'This coupon is not yet valid',
      }
    }

    if (now > coupon.validUntil) {
      return {
        valid: false,
        discountAmount: 0,
        error: 'This coupon has expired',
      }
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return {
        valid: false,
        discountAmount: 0,
        error: 'This coupon has reached its usage limit',
      }
    }

    if (coupon.minAmount && orderAmount < coupon.minAmount) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Minimum order amount is ${coupon.minAmount / 100}`,
      }
    }

    // 计算折扣金额
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.floor((orderAmount * coupon.discountValue) / 100)
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue
      if (discountAmount > orderAmount) {
        discountAmount = orderAmount // 不能超过订单金额
      }
    }

    return {
      valid: true,
      discountAmount,
    }
  } catch (error) {
    console.error('Failed to validate coupon:', error)
    return {
      valid: false,
      discountAmount: 0,
      error: 'Failed to validate coupon',
    }
  }
}

export async function applyCoupon(code: string, orderId: string): Promise<boolean> {
  try {
    await prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    })
    return true
  } catch (error) {
    console.error('Failed to apply coupon:', error)
    return false
  }
}

export async function createCoupon(data: {
  code: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minAmount?: number
  maxDiscount?: number
  usageLimit?: number
  validFrom: Date
  validUntil: Date
}) {
  try {
    return await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minAmount: data.minAmount,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
        isActive: true,
      },
    })
  } catch (error) {
    console.error('Failed to create coupon:', error)
    throw error
  }
}

export async function createStripeCoupon(couponCode: string): Promise<string | null> {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    })

    if (!coupon || !coupon.isActive) {
      return null
    }

    // 验证优惠券是否有效
    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return null
    }

    const Stripe = await import('stripe')
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    const stripe = new Stripe.default(secretKey, {
      apiVersion: '2024-11-20.acacia',
    })

    // 创建或获取Stripe Coupon
    let stripeCouponId: string

    try {
      // 尝试获取已存在的coupon
      try {
        const existing = await stripe.coupons.retrieve(couponCode.toUpperCase())
        stripeCouponId = existing.id
      } catch (retrieveError: any) {
        // Coupon不存在，创建新的
        if (retrieveError.code === 'resource_missing') {
          const couponData: Stripe.CouponCreateParams = {
            id: couponCode.toUpperCase(), // 使用相同的ID
            name: coupon.description || couponCode,
            duration: 'once',
            redeem_by: Math.floor(coupon.validUntil.getTime() / 1000),
          }

          if (coupon.discountType === 'percentage') {
            couponData.percent_off = coupon.discountValue
            if (coupon.maxDiscount) {
              // Stripe不支持max_discount，我们需要在应用时处理
              // 但可以设置max_redemptions
              if (coupon.usageLimit) {
                couponData.max_redemptions = coupon.usageLimit
              }
            }
          } else {
            couponData.amount_off = coupon.discountValue
            couponData.currency = 'usd'
            if (coupon.usageLimit) {
              couponData.max_redemptions = coupon.usageLimit
            }
          }

          const stripeCoupon = await stripe.coupons.create(couponData)
          stripeCouponId = stripeCoupon.id
        } else {
          throw retrieveError
        }
      }
    } catch (stripeError: any) {
      console.error('Failed to create Stripe coupon:', stripeError)
      return null
    }

    return stripeCouponId
  } catch (error) {
    console.error('Failed to create Stripe coupon:', error)
    return null
  }
}

