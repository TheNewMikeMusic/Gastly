/**
 * 列出最近的 Stripe Checkout Sessions
 * 用于查找需要创建订单的 session
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

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

async function listRecentSessions() {
  console.log('🔍 Fetching recent Stripe Checkout Sessions...\n')

  try {
    const stripe = getStripe()
    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
      expand: ['data.customer'],
    })

    console.log(`Found ${sessions.data.length} recent sessions:\n`)

    for (const session of sessions.data) {
      const amount = (session.amount_total || 0) / 100
      const currency = session.currency?.toUpperCase() || 'USD'
      const date = new Date(session.created * 1000).toLocaleString()

      console.log(`Session ID: ${session.id}`)
      console.log(`  Status: ${session.payment_status}`)
      console.log(`  Amount: ${currency} ${amount.toFixed(2)}`)
      console.log(`  Created: ${date}`)
      console.log(`  Customer Email: ${session.customer_email || 'N/A'}`)
      if (session.metadata) {
        console.log(`  Shipping Name: ${session.metadata.shippingName || 'N/A'}`)
        console.log(`  Shipping Email: ${session.metadata.shippingEmail || 'N/A'}`)
      }
      console.log('')
    }

    console.log('💡 To create an order from a session, run:')
    console.log('   npx ts-node scripts/manual-create-order-from-session.ts <session_id>')
    console.log('')

  } catch (error: any) {
    console.error('\n❌❌❌ Failed to list sessions!')
    console.error('Error:', error.message)
    process.exit(1)
  }
}

listRecentSessions()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })


