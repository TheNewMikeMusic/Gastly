/**
 * 部署后验证脚本
 * 检查支付、4px物流跟踪、后台管理等功能
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
}

const checks: CheckResult[] = []

async function checkDatabase() {
  console.log('🔍 检查数据库连接...')
  try {
    await prisma.$connect()
    const orderCount = await prisma.order.count()
    checks.push({
      name: '数据库连接',
      status: 'pass',
      message: `连接成功，当前有 ${orderCount} 个订单`,
    })
    console.log(`✅ 数据库连接正常 (${orderCount} 个订单)`)
  } catch (error: any) {
    checks.push({
      name: '数据库连接',
      status: 'fail',
      message: `连接失败: ${error.message}`,
    })
    console.error(`❌ 数据库连接失败:`, error.message)
  }
}

async function checkStripeConfig() {
  console.log('🔍 检查 Stripe 配置...')
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || secretKey.includes('sk_test_dummy') || secretKey.includes('你的')) {
    checks.push({
      name: 'Stripe 密钥',
      status: 'fail',
      message: 'STRIPE_SECRET_KEY 未配置或无效',
    })
    console.error('❌ Stripe 密钥未配置')
  } else {
    checks.push({
      name: 'Stripe 密钥',
      status: 'pass',
      message: '已配置',
    })
    console.log('✅ Stripe 密钥已配置')
  }

  if (!priceId || priceId.includes('price_你的')) {
    checks.push({
      name: 'Stripe Price ID',
      status: 'fail',
      message: 'NEXT_PUBLIC_STRIPE_PRICE_ID 未配置或无效',
    })
    console.error('❌ Stripe Price ID 未配置')
  } else {
    checks.push({
      name: 'Stripe Price ID',
      status: 'pass',
      message: `已配置: ${priceId}`,
    })
    console.log(`✅ Stripe Price ID 已配置: ${priceId}`)
  }

  if (!webhookSecret || webhookSecret.includes('whsec_你的')) {
    checks.push({
      name: 'Stripe Webhook Secret',
      status: 'warning',
      message: 'STRIPE_WEBHOOK_SECRET 未配置（开发环境可忽略）',
    })
    console.warn('⚠️  Stripe Webhook Secret 未配置')
  } else {
    checks.push({
      name: 'Stripe Webhook Secret',
      status: 'pass',
      message: '已配置',
    })
    console.log('✅ Stripe Webhook Secret 已配置')
  }
}

async function checkFourPXConfig() {
  console.log('🔍 检查 4px 配置...')
  const apiKey = process.env.FOURPX_API_KEY
  const apiSecret = process.env.FOURPX_API_SECRET

  if (!apiKey || !apiSecret) {
    checks.push({
      name: '4px 配置',
      status: 'warning',
      message: '4px API 密钥未配置（物流跟踪功能将使用模拟数据）',
    })
    console.warn('⚠️  4px API 密钥未配置')
  } else {
    checks.push({
      name: '4px 配置',
      status: 'pass',
      message: '已配置',
    })
    console.log('✅ 4px API 密钥已配置')
  }
}

async function checkOrders() {
  console.log('🔍 检查订单数据...')
  try {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    })

    const paidOrders = orders.filter((o) => o.status === 'paid')
    const pendingOrders = orders.filter((o) => o.status === 'pending')

    checks.push({
      name: '订单数据',
      status: 'pass',
      message: `总计 ${orders.length} 个订单 (已支付: ${paidOrders.length}, 待支付: ${pendingOrders.length})`,
    })
    console.log(`✅ 订单数据正常 (${orders.length} 个订单)`)

    // 检查订单数据完整性
    const incompleteOrders = orders.filter(
      (o) => !o.shippingName || !o.shippingEmail || !o.shippingAddress
    )
    if (incompleteOrders.length > 0) {
      checks.push({
        name: '订单完整性',
        status: 'warning',
        message: `${incompleteOrders.length} 个订单缺少配送信息`,
      })
      console.warn(`⚠️  ${incompleteOrders.length} 个订单缺少配送信息`)
    }
  } catch (error: any) {
    checks.push({
      name: '订单数据',
      status: 'fail',
      message: `查询失败: ${error.message}`,
    })
    console.error(`❌ 订单数据查询失败:`, error.message)
  }
}

async function checkTracking() {
  console.log('🔍 检查物流跟踪...')
  try {
    const ordersWithTracking = await prisma.order.findMany({
      where: {
        trackingNumber: {
          not: null,
        },
      },
      take: 5,
    })

    checks.push({
      name: '物流跟踪',
      status: 'pass',
      message: `${ordersWithTracking.length} 个订单有物流单号`,
    })
    console.log(`✅ ${ordersWithTracking.length} 个订单有物流单号`)
  } catch (error: any) {
    checks.push({
      name: '物流跟踪',
      status: 'fail',
      message: `查询失败: ${error.message}`,
    })
    console.error(`❌ 物流跟踪查询失败:`, error.message)
  }
}

async function checkAdminAuth() {
  console.log('🔍 检查后台管理认证...')
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    checks.push({
      name: '后台管理认证',
      status: 'warning',
      message: '管理员账号未配置（使用默认配置）',
    })
    console.warn('⚠️  管理员账号未配置')
  } else {
    checks.push({
      name: '后台管理认证',
      status: 'pass',
      message: '已配置',
    })
    console.log('✅ 管理员账号已配置')
  }
}

async function checkEndpoints() {
  console.log('🔍 检查 API 端点...')
  const endpoints = [
    { path: '/', name: '首页' },
    { path: '/checkout', name: '结账页面' },
    { path: '/admin', name: '后台管理' },
    { path: '/api/checkout', name: '支付 API' },
    { path: '/api/webhooks/stripe', name: 'Stripe Webhook' },
  ]

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: 'GET',
        headers: { 'User-Agent': 'Deployment-Verifier' },
      })
      const status = response.status
      if (status < 500) {
        checks.push({
          name: endpoint.name,
          status: 'pass',
          message: `HTTP ${status}`,
        })
        console.log(`✅ ${endpoint.name}: HTTP ${status}`)
      } else {
        checks.push({
          name: endpoint.name,
          status: 'fail',
          message: `HTTP ${status}`,
        })
        console.error(`❌ ${endpoint.name}: HTTP ${status}`)
      }
    } catch (error: any) {
      checks.push({
        name: endpoint.name,
        status: 'fail',
        message: `连接失败: ${error.message}`,
      })
      console.error(`❌ ${endpoint.name}: 连接失败`)
    }
  }
}

async function main() {
  console.log('🚀 开始部署验证...\n')

  await checkDatabase()
  await checkStripeConfig()
  await checkFourPXConfig()
  await checkOrders()
  await checkTracking()
  await checkAdminAuth()
  await checkEndpoints()

  console.log('\n📊 验证结果汇总:\n')

  const passed = checks.filter((c) => c.status === 'pass').length
  const warnings = checks.filter((c) => c.status === 'warning').length
  const failed = checks.filter((c) => c.status === 'fail').length

  checks.forEach((check) => {
    const icon =
      check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'
    const color =
      check.status === 'pass' ? '\x1b[32m' : check.status === 'warning' ? '\x1b[33m' : '\x1b[31m'
    console.log(`${icon} ${check.name}: ${color}${check.message}\x1b[0m`)
  })

  console.log(`\n总计: ✅ ${passed} 通过 | ⚠️  ${warnings} 警告 | ❌ ${failed} 失败`)

  if (failed > 0) {
    console.log('\n❌ 验证失败，请修复上述问题后重新部署')
    process.exit(1)
  } else if (warnings > 0) {
    console.log('\n⚠️  验证通过，但有警告项需要注意')
    process.exit(0)
  } else {
    console.log('\n✅ 所有检查通过！')
    process.exit(0)
  }
}

main()
  .catch((error) => {
    console.error('❌ 验证过程出错:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


