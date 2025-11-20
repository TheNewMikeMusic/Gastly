import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { trackingNumber } = body

    if (!trackingNumber) {
      return NextResponse.json(
        { error: '跟踪号不能为空' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        trackingNumber: trackingNumber,
        trackingStatus: 'info_received',
      },
    })

    // 发送发货通知邮件
    if (!updatedOrder.shippingEmailSent && updatedOrder.shippingEmail) {
      try {
        const { sendShippingNotificationEmail } = await import('@/lib/email')
        await sendShippingNotificationEmail(updatedOrder)
        await prisma.order.update({
          where: { id: params.orderId },
          data: { shippingEmailSent: true },
        })
      } catch (emailError) {
        console.error('Failed to send shipping email:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update tracking error:', error)
    return NextResponse.json(
      { error: '更新跟踪号失败', message: error.message },
      { status: 500 }
    )
  }
}

