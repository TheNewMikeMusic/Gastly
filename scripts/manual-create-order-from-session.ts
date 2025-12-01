/**
 * 手动从 Stripe Session 创建订单
 * 用于本地开发时数据库连接失败的情况
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

async function createOrderFromSession(sessionId: string) {
  console.log(`🔧 Creating order from Stripe session: ${sessionId}\n`)

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('Session details:')
    console.log(`  Payment Status: ${session.payment_status}`)
    console.log(`  Amount: ${(session.amount_total || 0) / 100} ${session.currency?.toUpperCase()}`)
    console.log(`  Customer Email: ${session.customer_email || 'N/A'}`)
    console.log(`  Metadata:`, session.metadata)
    console.log('')

    if (session.payment_status !== 'paid') {
      console.error('❌ Session is not paid. Payment status:', session.payment_status)
      return
    }

    // 检查订单是否已存在
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (existingOrder) {
      console.log(`✅ Order already exists: ${existingOrder.id}`)
      console.log(`   Status: ${existingOrder.status}`)
      console.log(`   Amount: ${existingOrder.amount / 100} ${existingOrder.currency}`)
      return
    }

    // 从 metadata 创建订单
    if (!session.metadata) {
      console.error('❌ Session has no metadata')
      return
    }

    const metadata = session.metadata
    console.log('Creating order from metadata...')

    const order = await prisma.$transaction(async (tx) => {
      // 检查库存
      const product = await tx.product.findUnique({
        where: { id: 'maclock-default' },
      })

      if (!product) {
        throw new Error('Product not found')
      }

      if (product.stock < 1) {
        throw new Error('Product is out of stock')
      }

      // 创建订单
      const newOrder = await tx.order.create({
        data: {
          userId: metadata.userId || 'unknown',
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'paid',
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

    console.log(`✅ Order created successfully!`)
    console.log(`   Order ID: ${order.id}`)
    console.log(`   Status: ${order.status}`)
    console.log(`   Amount: ${order.amount / 100} ${order.currency}`)
    console.log(`   Shipping Email: ${order.shippingEmail || 'N/A'}`)
    console.log('')

  } catch (error: any) {
    console.error('\n❌❌❌ Failed to create order!')
    console.error('Error:', error.message)
    if (error.code === 'P1000') {
      console.error('\n💡 Database connection failed. Please check:')
      console.error('   1. PostgreSQL is running')
      console.error('   2. DATABASE_URL is correct in .env.local')
      console.error('   3. Database credentials are valid')
    }
    process.exit(1)
  }
}

// 从命令行参数获取 session ID
const sessionId = process.argv[2]

if (!sessionId) {
  console.error('Usage: npx ts-node scripts/manual-create-order-from-session.ts <session_id>')
  console.error('Example: npx ts-node scripts/manual-create-order-from-session.ts cs_test_...')
  process.exit(1)
}

createOrderFromSession(sessionId)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })

