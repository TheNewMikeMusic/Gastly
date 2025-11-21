import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { releaseStock } from '@/lib/inventory'
import { createRefund } from '@/lib/refunds'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reason } = body

    // 获取订单并验证所有权
    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        userId: userId,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // 只能取消待支付或已支付的订单
    if (order.status === 'cancelled' || order.status === 'refunded') {
      return NextResponse.json(
        { error: 'Order cannot be cancelled' },
        { status: 400 }
      )
    }

    // 如果订单已支付，需要退款
    const wasPaid = order.status === 'paid'
    if (wasPaid) {
      // 创建Stripe退款
      const refundResult = await createRefund(order.id, reason || 'Customer cancellation')
      if (!refundResult.success) {
        return NextResponse.json(
          { error: refundResult.error || 'Failed to process refund' },
          { status: 500 }
        )
      }
      // 退款成功，订单状态已更新为refunded
      return NextResponse.json({
        success: true,
        refundId: refundResult.refundId,
      })
    }

    // 如果订单是pending状态，清除预留时间（释放库存）
    if (order.status === 'pending') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          refundReason: reason || 'Customer cancellation',
          reservedAt: null, // 清除预留时间
        },
      })
    } else {
      // 更新订单状态为cancelled
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          refundReason: reason || 'Customer cancellation',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Order cancellation error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}

