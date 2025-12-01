/**
 * 更新已支付但状态仍为 pending 的订单
 * 用于修复 webhook 未处理的情况
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

async function updatePaidOrders() {
  console.log('🔧 Checking for paid orders with pending status...\n')

  try {
    const stripe = getStripe()
    
    // 查找所有 pending 状态的订单，且有 stripeSessionId
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'pending',
        stripeSessionId: {
          not: null,
        },
      },
    })

    console.log(`Found ${pendingOrders.length} pending orders with session IDs\n`)

    let updatedCount = 0
    let errorCount = 0

    for (const order of pendingOrders) {
      if (!order.stripeSessionId) continue

      try {
        console.log(`Checking order ${order.id} with session ${order.stripeSessionId}...`)
        
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId)
        
        // 如果支付已完成，更新订单状态
        if (session.status === 'complete' || session.payment_status === 'paid') {
          console.log(`  ✅ Payment completed, updating order status...`)
          
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: 'paid',
                amount: session.amount_total || order.amount,
              },
            })
            
            // Decrement stock if reserved
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
              }
            }
          })
          
          updatedCount++
          console.log(`  ✅ Order ${order.id} updated to paid\n`)
        } else {
          console.log(`  ⏳ Payment still pending (status: ${session.status}, payment_status: ${session.payment_status})\n`)
        }
      } catch (error: any) {
        errorCount++
        console.error(`  ❌ Error checking order ${order.id}:`, error.message)
        
        // 如果 session 不存在，可能是旧的 session，跳过
        if (error.code === 'resource_missing') {
          console.log(`  ⚠️  Session not found, skipping...\n`)
        } else {
          console.error(`  ❌ Unexpected error:\n`)
        }
      }
    }

    console.log('\n✅✅✅ Update complete!')
    console.log(`   Updated: ${updatedCount} orders`)
    console.log(`   Errors: ${errorCount} orders`)
    console.log('')

  } catch (error: any) {
    console.error('\n❌❌❌ Failed to update orders!')
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updatePaidOrders()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })


