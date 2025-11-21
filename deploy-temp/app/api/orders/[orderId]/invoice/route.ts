import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateInvoiceData, generateInvoiceHTML } from '@/lib/invoice'

export async function GET(
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

    const invoiceData = generateInvoiceData(order)
    const html = generateInvoiceHTML(invoiceData)

    // 返回HTML格式的发票
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${invoiceData.invoiceNumber}.html"`,
      },
    })
  } catch (error: any) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

