import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建默认产品
  const product = await prisma.product.upsert({
    where: { id: 'maclock-default' },
    update: {},
    create: {
      id: 'maclock-default',
      name: 'Maclock Digital Clock',
      description: 'Retro Macintosh-style Digital Clock',
      price: parseInt(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '9900'), // 前100台特价 $99 (原价 $199)
      currency: 'usd',
      stock: parseInt(process.env.DEFAULT_STOCK || '100'),
      sku: 'MACLOCK-001',
      isActive: true,
    },
  })

  console.log('✅ Default product created/updated:', product)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

