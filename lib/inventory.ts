import { prisma } from './prisma'
import { sendStockNotificationEmail } from './email'

const DEFAULT_PRODUCT_ID = 'maclock-default' // 默认产品ID

export async function getProductStock(productId: string = DEFAULT_PRODUCT_ID) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      // 如果产品不存在，创建默认产品
      return await prisma.product.create({
        data: {
          id: productId,
          name: 'Maclock Digital Clock',
          description: 'Retro Macintosh-style Digital Clock',
          price: parseInt(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '29900'), // 默认$299
          currency: 'usd',
          stock: parseInt(process.env.DEFAULT_STOCK || '100'),
          sku: 'MACLOCK-001',
          isActive: true,
        },
      })
    }

    return product
  } catch (error) {
    console.error('Failed to get product stock:', error)
    throw error
  }
}

export async function checkStock(
  productId: string = DEFAULT_PRODUCT_ID,
  quantity: number = 1,
  tx?: any // 可选的事务对象
): Promise<boolean> {
  const db = tx || prisma
  const product = await db.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    return false
  }

  // 计算实际可用库存（排除未过期的预留）
  const now = new Date()
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)

  // 统计未过期的pending订单占用的库存
  const reservedCount = await db.order.count({
    where: {
      status: 'pending',
      reservedAt: {
        gte: thirtyMinutesAgo, // 30分钟内的预留才有效
      },
    },
  })

  // 可用库存 = 总库存 - 有效预留
  const availableStock = product.stock - reservedCount
  return availableStock >= quantity
}

export async function reserveStock(
  productId: string = DEFAULT_PRODUCT_ID,
  quantity: number = 1,
  tx?: any // 可选的事务对象
): Promise<boolean> {
  try {
    const db = tx || prisma
    
    // 检查可用库存（排除过期预留）
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return false
    }

    // 计算实际可用库存
    const now = new Date()
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)

    const reservedCount = await db.order.count({
      where: {
        status: 'pending',
        reservedAt: {
          gte: thirtyMinutesAgo,
        },
      },
    })

    const availableStock = product.stock - reservedCount
    if (availableStock < quantity) {
      return false
    }

    // 预留成功（不实际减少库存，只标记预留时间）
    // 实际减少在支付成功时通过confirmStockReservation进行
    return true
  } catch (error) {
    console.error('Failed to reserve stock:', error)
    return false
  }
}

export async function confirmStockReservation(
  productId: string = DEFAULT_PRODUCT_ID,
  quantity: number = 1,
  tx?: any
): Promise<boolean> {
  try {
    const db = tx || prisma
    
    // 支付成功后，实际减少库存
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product || product.stock < quantity) {
      console.error('Insufficient stock when confirming reservation')
      return false
    }

    await db.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    })

    return true
  } catch (error) {
    console.error('Failed to confirm stock reservation:', error)
    return false
  }
}

export async function releaseStock(productId: string = DEFAULT_PRODUCT_ID, quantity: number = 1): Promise<void> {
  try {
    // 只有在订单已支付的情况下才需要释放库存（因为pending订单没有实际减少库存）
    // 如果订单是pending状态，只需要清除reservedAt即可
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    })

    // 检查是否有等待列表需要通知
    const updatedProduct = await getProductStock(productId)
    if (updatedProduct.stock > 0) {
      await notifyWaitlist(productId)
    }
  } catch (error) {
    console.error('Failed to release stock:', error)
  }
}

export async function addToWaitlist(email: string, userId?: string): Promise<boolean> {
  try {
    await prisma.waitlist.upsert({
      where: { email },
      create: {
        email,
        userId: userId || null,
        notified: false,
      },
      update: {
        userId: userId || null,
      },
    })
    return true
  } catch (error) {
    console.error('Failed to add to waitlist:', error)
    return false
  }
}

export async function notifyWaitlist(productId: string = DEFAULT_PRODUCT_ID): Promise<void> {
  try {
    const waitlist = await prisma.waitlist.findMany({
      where: {
        notified: false,
      },
      take: 50, // 每次最多通知50人
    })

    const product = await getProductStock(productId)
    if (product.stock <= 0) {
      return // 没有库存，不通知
    }

    for (const entry of waitlist) {
      try {
        await sendStockNotificationEmail(entry.email)
        await prisma.waitlist.update({
          where: { id: entry.id },
          data: {
            notified: true,
            notifiedAt: new Date(),
          },
        })
      } catch (error) {
        console.error(`Failed to notify ${entry.email}:`, error)
      }
    }
  } catch (error) {
    console.error('Failed to notify waitlist:', error)
  }
}

export async function updateStock(productId: string = DEFAULT_PRODUCT_ID, newStock: number): Promise<void> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: newStock,
      },
    })

    // 如果有新库存，通知等待列表
    if (newStock > 0) {
      await notifyWaitlist(productId)
    }
  } catch (error) {
    console.error('Failed to update stock:', error)
    throw error
  }
}

