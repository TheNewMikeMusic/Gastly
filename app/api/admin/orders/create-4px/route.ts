import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getFourPXClient } from '@/lib/fourpx'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, productCode, deliverType, deliverToRecipientType } = body

    if (!orderId || !productCode || !deliverType || !deliverToRecipientType) {
      return NextResponse.json(
        { error: '缺少必需参数' },
        { status: 400 }
      )
    }

    // 获取订单信息
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    if (!order.shippingName || !order.shippingPhone || !order.shippingAddress || 
        !order.shippingCity || !order.shippingCountry || !order.shippingZip) {
      return NextResponse.json(
        { error: '订单缺少完整的收货地址信息' },
        { status: 400 }
      )
    }

    // 构建4px订单数据
    const client = getFourPXClient()
    
    // 默认发件人信息（需要根据实际情况配置）
    const senderInfo = {
      name: process.env.FOURPX_SENDER_NAME || 'Hello1984',
      phone: process.env.FOURPX_SENDER_PHONE || '13800138000',
      email: process.env.FOURPX_SENDER_EMAIL || 'support@hello1984.com',
      country: process.env.FOURPX_SENDER_COUNTRY || 'CN',
      state: process.env.FOURPX_SENDER_STATE || 'Guangdong',
      city: process.env.FOURPX_SENDER_CITY || 'Shenzhen',
      address: process.env.FOURPX_SENDER_ADDRESS || 'Shenzhen Warehouse',
      zip: process.env.FOURPX_SENDER_ZIP || '518000',
    }

    const fourpxOrder = await client.createOrder({
      refNo: order.id,
      businessType: 'BDS',
      dutyType: 'U', // DDU - 由收件人支付关税
      cargoType: '5', // 其它
      sender: senderInfo,
      recipient: {
        name: order.shippingName,
        phone: order.shippingPhone,
        email: order.shippingEmail || undefined,
        country: order.shippingCountry,
        state: order.shippingState || undefined,
        city: order.shippingCity,
        address: order.shippingAddress,
        zip: order.shippingZip,
      },
      parcelList: [
        {
          name: 'Maclock Digital Clock',
          nameEn: 'Maclock Digital Clock',
          quantity: 1,
          unitPrice: order.amount / 100,
          currency: order.currency.toUpperCase(),
          weight: 0.5, // 默认重量，需要根据实际产品调整
        },
      ],
      logisticsServiceInfo: {
        productCode: productCode,
      },
      returnInfo: senderInfo,
      deliverTypeInfo: {
        deliverType: deliverType,
      },
      deliverToRecipientInfo: {
        deliverType: deliverToRecipientType,
      },
      isInsure: 'N',
    })

    // 解析4px返回的跟踪号
    let trackingNumber: string | null = null
    if (fourpxOrder?.data) {
      if (typeof fourpxOrder.data === 'string') {
        try {
          const data = JSON.parse(fourpxOrder.data)
          trackingNumber = data.tracking_no || data.trackingNumber || data.tracking_number || null
        } catch {
          // 如果不是JSON，尝试直接提取
          trackingNumber = fourpxOrder.data.match(/[\dA-Z]{10,}/)?.[0] || null
        }
      } else if (typeof fourpxOrder.data === 'object') {
        trackingNumber = fourpxOrder.data.tracking_no || 
                       fourpxOrder.data.trackingNumber || 
                       fourpxOrder.data.tracking_number || 
                       null
      }
    }

    // 更新订单的跟踪信息
    if (trackingNumber) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          trackingNumber: trackingNumber,
          trackingStatus: 'info_received',
          trackingMeta: fourpxOrder as any,
        },
      })

      // 发送发货通知邮件
      if (!order.shippingEmailSent && order.shippingEmail) {
        try {
          const { sendShippingNotificationEmail } = await import('@/lib/email')
          await sendShippingNotificationEmail(order)
          await prisma.order.update({
            where: { id: orderId },
            data: { shippingEmailSent: true },
          })
        } catch (emailError) {
          console.error('Failed to send shipping email:', emailError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      response: fourpxOrder,
    })
  } catch (error: any) {
    console.error('4PX create order error:', error)
    return NextResponse.json(
      { 
        error: '创建4px订单失败',
        message: error.message || '未知错误',
      },
      { status: 500 }
    )
  }
}

