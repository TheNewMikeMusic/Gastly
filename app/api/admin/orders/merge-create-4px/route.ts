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
    const { orderIds, productCode, deliverType, deliverToRecipientType } = body

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: '请至少选择一个订单' },
        { status: 400 }
      )
    }

    if (!productCode || !deliverType || !deliverToRecipientType) {
      return NextResponse.json(
        { error: '缺少必需参数：productCode, deliverType, deliverToRecipientType' },
        { status: 400 }
      )
    }

    // 获取所有订单信息
    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        status: 'paid', // 只合并已支付的订单
      },
    })

    if (orders.length === 0) {
      return NextResponse.json(
        { error: '没有找到可合并的已支付订单' },
        { status: 404 }
      )
    }

    // 检查所有订单是否有完整的收货地址信息
    const incompleteOrders = orders.filter(
      (order) =>
        !order.shippingName ||
        !order.shippingPhone ||
        !order.shippingAddress ||
        !order.shippingCity ||
        !order.shippingCountry ||
        !order.shippingZip
    )

    if (incompleteOrders.length > 0) {
      return NextResponse.json(
        { error: `以下订单缺少完整的收货地址信息: ${incompleteOrders.map((o) => o.id.slice(0, 8)).join(', ')}` },
        { status: 400 }
      )
    }

    // 检查所有订单是否已经创建了4px运单
    const alreadyShipped = orders.filter((order) => order.trackingNumber)
    if (alreadyShipped.length > 0) {
      return NextResponse.json(
        { error: `以下订单已经创建了运单: ${alreadyShipped.map((o) => o.id.slice(0, 8)).join(', ')}` },
        { status: 400 }
      )
    }

    // 使用第一个订单的收货地址作为合并后的收货地址
    // 注意：实际应用中可能需要更复杂的合并逻辑
    const primaryOrder = orders[0]

    // 构建4px合并订单数据
    const client = getFourPXClient()

    // 默认发件人信息
    const senderInfo = {
      name: process.env.FOURPX_SENDER_NAME || 'Hello1984',
      phone: process.env.FOURPX_SENDER_PHONE || '13800138000',
      email: process.env.FOURPX_SENDER_EMAIL || 'mikeshyu@proton.me',
      country: process.env.FOURPX_SENDER_COUNTRY || 'CN',
      state: process.env.FOURPX_SENDER_STATE || 'Guangdong',
      city: process.env.FOURPX_SENDER_CITY || 'Shenzhen',
      address: process.env.FOURPX_SENDER_ADDRESS || 'Shenzhen Warehouse',
      zip: process.env.FOURPX_SENDER_ZIP || '518000',
    }

    // 合并包裹列表（每个订单一个包裹）
    const parcelList = orders.map((order) => ({
      name: 'Maclock Digital Clock',
      nameEn: 'Maclock Digital Clock',
      quantity: 1,
      unitPrice: order.amount / 100,
      currency: order.currency.toUpperCase(),
      weight: 0.5, // 默认重量
    }))

    // 创建合并的参考号（使用所有订单ID的组合）
    const mergedRefNo = `MERGE_${orderIds.join('_').substring(0, 50)}`

    const fourpxOrder = await client.createOrder({
      refNo: mergedRefNo,
      businessType: 'BDS',
      dutyType: 'U',
      cargoType: '5',
      sender: senderInfo,
      recipient: {
        name: primaryOrder.shippingName!,
        phone: primaryOrder.shippingPhone!,
        email: primaryOrder.shippingEmail || undefined,
        country: primaryOrder.shippingCountry!,
        state: primaryOrder.shippingState || undefined,
        city: primaryOrder.shippingCity!,
        address: primaryOrder.shippingAddress!,
        zip: primaryOrder.shippingZip!,
      },
      parcelList: parcelList,
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
      parcelQty: orders.length, // 包裹件数
    })

    // 解析4px返回的跟踪号
    let trackingNumber: string | null = null
    if (fourpxOrder?.data) {
      if (typeof fourpxOrder.data === 'string') {
        try {
          const data = JSON.parse(fourpxOrder.data)
          trackingNumber = data.tracking_no || data.trackingNumber || data.tracking_number || null
        } catch {
          trackingNumber = fourpxOrder.data.match(/[\dA-Z]{10,}/)?.[0] || null
        }
      } else if (typeof fourpxOrder.data === 'object') {
        trackingNumber =
          fourpxOrder.data.tracking_no ||
          fourpxOrder.data.trackingNumber ||
          fourpxOrder.data.tracking_number ||
          null
      }
    }

    // 更新所有订单的跟踪信息
    if (trackingNumber) {
      await prisma.order.updateMany({
        where: {
          id: { in: orderIds },
        },
        data: {
          trackingNumber: trackingNumber,
          trackingStatus: 'info_received',
          trackingMeta: {
            merged: true,
            mergedOrderIds: orderIds,
            mergedRefNo: mergedRefNo,
            fourpxResponse: fourpxOrder,
          } as any,
        },
      })

      // 发送发货通知邮件给所有订单的客户
      const { sendShippingNotificationEmail } = await import('@/lib/email')
      for (const order of orders) {
        if (!order.shippingEmailSent && order.shippingEmail) {
          try {
            await sendShippingNotificationEmail(order)
            await prisma.order.update({
              where: { id: order.id },
              data: { shippingEmailSent: true },
            })
          } catch (emailError) {
            console.error(`Failed to send shipping email for order ${order.id}:`, emailError)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      mergedOrders: orderIds.length,
      response: fourpxOrder,
    })
  } catch (error: any) {
    console.error('4PX merge create order error:', error)
    return NextResponse.json(
      {
        error: '合并创建4px订单失败',
        message: error.message || '未知错误',
      },
      { status: 500 }
    )
  }
}

