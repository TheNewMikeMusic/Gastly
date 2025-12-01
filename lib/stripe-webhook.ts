import Stripe from 'stripe'
import { prisma } from './prisma'
import { sendOrderConfirmationEmail } from './email'
import { applyCoupon } from './coupon'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

export async function handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
  const session = event.data.object

  try {
    // 查找订单
    let order = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    })

    // 如果订单不存在，从 metadata 创建订单（fallback机制）
    let orderCreatedFromMetadata = false
    if (!order && session.metadata) {
      console.log(`Order not found for session ${session.id}, creating from metadata`)
      try {
        const metadata = session.metadata
        order = await prisma.$transaction(async (tx) => {
          // 检查库存
          const product = await tx.product.findUnique({
            where: { id: 'maclock-default' },
          })

          if (!product || product.stock < 1) {
            throw new Error('Product is out of stock')
          }

          // 创建订单（状态直接设为paid，因为支付已完成）
          const newOrder = await tx.order.create({
            data: {
              userId: metadata.userId || 'unknown',
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'paid', // 直接设为paid，因为支付已完成
              stripeSessionId: session.id,
              couponCode: metadata.couponCode || null,
              discountAmount: metadata.discountAmount ? parseInt(metadata.discountAmount) : null,
              shippingName: metadata.shippingName || null,
              shippingPhone: metadata.shippingPhone || null,
              shippingEmail: metadata.shippingEmail || session.customer_email || null,
              shippingAddress: metadata.shippingAddress || null,
              shippingCity: metadata.shippingCity || null,
              shippingState: metadata.shippingState || null,
              shippingZip: metadata.shippingZip || null,
              shippingCountry: metadata.shippingCountry || null,
            },
          })

          // 扣减库存
          await tx.product.update({
            where: { id: 'maclock-default' },
            data: {
              stock: {
                decrement: 1,
              },
            },
          })

          return newOrder
        })
        orderCreatedFromMetadata = true
        console.log(`Order ${order.id} created from webhook metadata`)
      } catch (createError: any) {
        console.error(`Failed to create order from metadata:`, createError)
        throw createError
      }
    }

    if (!order) {
      console.error(`Order not found for session ${session.id} and failed to create from metadata`)
      return
    }

    // 如果订单已经是paid状态，跳过（幂等性）
    // 注意：从metadata创建的订单已经是paid状态，不需要再次更新
    if (order.status === 'paid') {
      if (orderCreatedFromMetadata) {
        console.log(`Order ${order.id} created from metadata and already marked as paid`)
      } else {
        console.log(`Order ${order.id} already marked as paid`)
      }
      
      // 如果是从metadata创建的订单，发送确认邮件
      if (orderCreatedFromMetadata && !order.confirmationEmailSent && order.shippingEmail) {
        try {
          await sendOrderConfirmationEmail(order)
          await prisma.order.update({
            where: { id: order.id },
            data: { confirmationEmailSent: true },
          })
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
        }
      }
      
      // 如果使用了优惠券，更新使用次数
      if (orderCreatedFromMetadata && order.couponCode) {
        try {
          await applyCoupon(order.couponCode, session.id)
        } catch (error) {
          console.warn('Failed to apply coupon in webhook:', error)
        }
      }
      
      return
    }

    // 更新订单状态并确认库存预留
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'paid',
          amount: session.amount_total || order.amount, // 使用Stripe的实际支付金额
        },
      })

      // 确认库存预留（实际减少库存）
      if (order.reservedAt) {
        // 在事务内减少库存
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
        } else {
          console.warn(`Insufficient stock when confirming reservation for order ${order.id}`)
        }
      }
    })

    // 发送确认邮件
    if (!order.confirmationEmailSent && order.shippingEmail) {
      try {
        await sendOrderConfirmationEmail(order)
        await prisma.order.update({
          where: { id: order.id },
          data: { confirmationEmailSent: true },
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }
    }

    // 如果使用了优惠券，更新使用次数（如果之前失败）
    if (order.couponCode) {
      try {
        await applyCoupon(order.couponCode, session.id)
      } catch (error) {
        console.warn('Failed to apply coupon in webhook:', error)
      }
    }

    console.log(`Order ${order.id} marked as paid via webhook`)
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error)
    throw error
  }
}

export async function handleCheckoutSessionAsyncPaymentFailed(event: Stripe.CheckoutSessionAsyncPaymentFailedEvent) {
  const session = event.data.object

  try {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    })

    if (!order) {
      console.error(`Order not found for session ${session.id}`)
      return
    }

    // 如果订单是pending状态，清除预留时间（释放库存）
    if (order.status === 'pending' && order.reservedAt) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          reservedAt: null, // 清除预留时间，库存检查时会排除此订单
        },
      })
      console.log(`Released reservation for order ${order.id}`)
    }
  } catch (error) {
    console.error('Error handling checkout.session.async_payment_failed:', error)
  }
}

export async function handlePaymentIntentSucceeded(event: Stripe.PaymentIntentSucceededEvent) {
  const paymentIntent = event.data.object

  try {
    // 通过metadata查找订单
    const sessionId = paymentIntent.metadata?.session_id
    if (!sessionId) {
      return
    }

    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (!order || order.status === 'paid') {
      return
    }

    // 更新订单状态并确认库存预留
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'paid',
          amount: paymentIntent.amount,
        },
      })

      // 确认库存预留（实际减少库存）
      if (order.reservedAt) {
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
        } else {
          console.warn(`Insufficient stock when confirming reservation for order ${order.id}`)
        }
      }
    })

    // 发送确认邮件
    if (!order.confirmationEmailSent && order.shippingEmail) {
      try {
        await sendOrderConfirmationEmail(order)
        await prisma.order.update({
          where: { id: order.id },
          data: { confirmationEmailSent: true },
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error)
  }
}

