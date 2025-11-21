/**
 * 测试Stripe Webhook配置的脚本
 * 用于验证webhook配置是否正确
 * 
 * 使用方法:
 * node scripts/test-webhook.js
 */

require('dotenv').config({ path: '.env.local' })

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
    console.warn('   For production, you MUST configure this in Stripe Dashboard')
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
  } catch (error) {
    console.error(`❌ Cannot access webhook endpoint: ${error.message}`)
    console.error('   Make sure your server is running: npm run dev')
  }

  // 检查Stripe账户中的webhook配置
  console.log('\n3. Checking Stripe webhook endpoints...')
  try {
    const Stripe = require('stripe')
    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2024-11-20.acacia',
    })
    
    const endpoints = await stripe.webhookEndpoints.list({ limit: 10 })
    
    if (endpoints.data.length === 0) {
      console.warn('⚠️  No webhook endpoints found in Stripe Dashboard')
      console.warn('   Please create a webhook endpoint at: https://dashboard.stripe.com/webhooks')
      console.warn('   URL: https://yourdomain.com/api/webhooks/stripe')
      console.warn('   Events: checkout.session.completed, checkout.session.async_payment_failed')
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
  } catch (error) {
    console.error(`❌ Failed to check Stripe webhooks: ${error.message}`)
  }

  console.log('\n✅ Webhook configuration test completed!')
  console.log('\n📋 Next steps:')
  console.log('1. If webhook endpoint is not configured:')
  console.log('   - Go to https://dashboard.stripe.com/webhooks')
  console.log('   - Click "Add endpoint"')
  console.log('   - URL: https://yourdomain.com/api/webhooks/stripe')
  console.log('   - Select events: checkout.session.completed, checkout.session.async_payment_failed')
  console.log('   - Copy the signing secret to STRIPE_WEBHOOK_SECRET in .env.local')
  console.log('')
  console.log('2. For local development:')
  console.log('   - Install Stripe CLI: https://stripe.com/docs/stripe-cli')
  console.log('   - Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe')
  console.log('   - Use the signing secret shown by CLI in .env.local')
  console.log('')
  console.log('3. Test with a real payment:')
  console.log('   - Use test card: 4242 4242 4242 4242')
  console.log('   - Check webhook events in Stripe Dashboard')
  console.log('   - Verify order status is updated to "paid"')
}

testWebhook().catch(console.error)

