import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
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

    const orderId = params.orderId

    // 获取订单并验证所有权
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // 已付款的订单不能删除
    if (order.status === 'paid' || order.status === 'refunded') {
      return NextResponse.json(
        { error: 'Cannot delete paid or refunded orders' },
        { status: 400 }
      )
    }

    // 只能删除pending或cancelled状态的订单
    if (order.status !== 'pending' && order.status !== 'cancelled') {
      return NextResponse.json(
        { error: 'Order cannot be deleted' },
        { status: 400 }
      )
    }

    // 删除订单
    await prisma.order.delete({
      where: { id: orderId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Order deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}

