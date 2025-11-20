/**
 * 测试Stripe Webhook的脚本
 * 用于验证webhook配置是否正确
 * 
 * 使用方法:
 * npx ts-node scripts/test-webhook.ts
 */

import Stripe from 'stripe'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  })
}

async function testWebhook() {
  console.log('🧪 Testing Stripe Webhook Configuration...\n')

  // 检查环境变量
  console.log('1. Checking environment variables...')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeSecret = process.env.STRIPE_SECRET_KEY

  if (!stripeSecret) {
    console.error('❌ STRIPE_SECRET_KEY is not configured')
    return
  }
  console.log('✅ STRIPE_SECRET_KEY is configured')

  if (!webhookSecret) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET is not configured')
    console.warn('   Webhook signature verification will be skipped in development')
  } else {
    console.log('✅ STRIPE_WEBHOOK_SECRET is configured')
  }

  // 检查webhook endpoint配置
  console.log('\n2. Checking webhook endpoint configuration...')
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const webhookUrl = `${baseUrl}/api/webhooks/stripe`
  console.log(`   Webhook URL: ${webhookUrl}`)

  // 测试webhook URL可访问性
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true }),
    })
    console.log(`   Status: ${response.status}`)
    if (response.status === 400) {
      console.log('✅ Webhook endpoint is accessible (expected 400 for invalid signature)')
    } else {
      console.warn(`⚠️  Unexpected status code: ${response.status}`)
    }
  } catch (error: any) {
    console.error(`❌ Cannot access webhook endpoint: ${error.message}`)
    console.error('   Make sure your server is running and accessible')
  }

  // 检查Stripe账户中的webhook配置
  console.log('\n3. Checking Stripe webhook endpoints...')
  try {
    const stripe = getStripe()
    const endpoints = await stripe.webhookEndpoints.list({ limit: 10 })
    
    if (endpoints.data.length === 0) {
      console.warn('⚠️  No webhook endpoints found in Stripe Dashboard')
      console.warn('   Please create a webhook endpoint at: https://dashboard.stripe.com/webhooks')
    } else {
      console.log(`✅ Found ${endpoints.data.length} webhook endpoint(s):`)
      endpoints.data.forEach((endpoint, index) => {
        console.log(`   ${index + 1}. ${endpoint.url}`)
        console.log(`      Status: ${endpoint.status}`)
        console.log(`      Events: ${endpoint.enabled_events.length} events`)
        if (endpoint.enabled_events.includes('checkout.session.completed')) {
          console.log('      ✅ checkout.session.completed is enabled')
        } else {
          console.warn('      ⚠️  checkout.session.completed is NOT enabled')
        }
      })
    }
  } catch (error: any) {
    console.error(`❌ Failed to check Stripe webhooks: ${error.message}`)
  }

  console.log('\n✅ Webhook configuration test completed!')
  console.log('\nNext steps:')
  console.log('1. If webhook endpoint is not configured, create it in Stripe Dashboard')
  console.log('2. Copy the signing secret to STRIPE_WEBHOOK_SECRET in .env.local')
  console.log('3. Test with a real payment using Stripe test card: 4242 4242 4242 4242')
}

testWebhook().catch(console.error)

