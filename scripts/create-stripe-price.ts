/**
 * 创建 Stripe Price 脚本
 * 用于在新 Stripe 账户中创建产品价格
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

async function createPrice() {
  console.log('🔧 开始创建 Stripe Price...\n')

  try {
    const stripe = getStripe()

    // 1. 检查是否已有产品，如果没有则创建
    console.log('1️⃣ 检查产品...')
    let productId = 'prod_maclock_default'
    
    try {
      const existingProduct = await stripe.products.retrieve(productId)
      console.log(`✅ 产品已存在: ${existingProduct.name} (${existingProduct.id})`)
    } catch (error: any) {
      if (error.code === 'resource_missing') {
        console.log('⚠️  产品不存在，正在创建...')
        const product = await stripe.products.create({
          id: productId,
          name: 'Hello1984 Retro Mac Clock',
          description: 'A beautifully crafted retro Macintosh-style digital clock. Pixel-perfect nostalgia meets modern craftsmanship.',
          images: [],
        })
        console.log(`✅ 产品创建成功: ${product.name} (${product.id})`)
      } else {
        throw error
      }
    }
    console.log('')

    // 2. 创建价格（$99，前100台特价）
    console.log('2️⃣ 创建价格...')
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: 9900, // $99.00 in cents
      currency: 'usd',
      metadata: {
        description: 'First 100 Units Special Price',
        original_price: '19900', // $199.00
      },
    })
    
    console.log(`✅ 价格创建成功!`)
    console.log(`   Price ID: ${price.id}`)
    console.log(`   金额: $${(price.unit_amount! / 100).toFixed(2)}`)
    console.log(`   货币: ${price.currency.toUpperCase()}`)
    console.log('')

    // 3. 更新环境变量
    console.log('3️⃣ 更新环境变量...')
    const envFile = '.env.local'
    const fs = await import('fs')
    const path = await import('path')
    
    const envPath = path.resolve(process.cwd(), envFile)
    let envContent = fs.existsSync(envPath) 
      ? fs.readFileSync(envPath, 'utf-8')
      : ''
    
    // 更新或添加 Price ID
    if (envContent.includes('NEXT_PUBLIC_STRIPE_PRICE_ID=')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_STRIPE_PRICE_ID=.*/,
        `NEXT_PUBLIC_STRIPE_PRICE_ID=${price.id}`
      )
    } else {
      envContent += `\nNEXT_PUBLIC_STRIPE_PRICE_ID=${price.id}\n`
    }
    
    fs.writeFileSync(envPath, envContent)
    console.log(`✅ 环境变量已更新: NEXT_PUBLIC_STRIPE_PRICE_ID=${price.id}`)
    console.log('')

    console.log('✅✅✅ Price 创建完成！')
    console.log('')
    console.log('📋 下一步：')
    console.log('   1. 重启开发服务器以加载新的 Price ID')
    console.log('   2. 测试支付流程')
    console.log('')

  } catch (error: any) {
    console.error('\n❌❌❌ 创建 Price 失败！')
    console.error('错误详情:', error.message)
    if (error.type === 'StripeAuthenticationError') {
      console.error('请检查 STRIPE_SECRET_KEY 是否正确')
    }
    process.exit(1)
  }
}

createPrice()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('未处理的错误:', error)
    process.exit(1)
  })


