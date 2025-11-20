import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)

    // 查找超过30分钟的pending订单
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'pending',
        reservedAt: {
          lt: thirtyMinutesAgo, // 超过30分钟
        },
      },
    })

    // 清除预留时间（释放库存）
    const result = await prisma.order.updateMany({
      where: {
        status: 'pending',
        reservedAt: {
          lt: thirtyMinutesAgo,
        },
      },
      data: {
        reservedAt: null, // 清除预留时间
      },
    })

    return NextResponse.json({
      success: true,
      cleared: result.count,
      expiredOrders: expiredOrders.length,
    })
  } catch (error: any) {
    console.error('Cleanup expired reservations error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup expired reservations' },
      { status: 500 }
    )
  }
}

// GET endpoint for manual trigger
export async function GET() {
  return POST()
}

