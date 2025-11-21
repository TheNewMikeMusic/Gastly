import { Order } from '@prisma/client'

export function exportOrdersToCSV(orders: Order[]): string {
  const headers = [
    'Order ID',
    'Order Number',
    'User ID',
    'Amount',
    'Currency',
    'Status',
    'Coupon Code',
    'Discount Amount',
    'Shipping Name',
    'Shipping Email',
    'Shipping Phone',
    'Shipping Address',
    'Shipping City',
    'Shipping State',
    'Shipping Zip',
    'Shipping Country',
    'Tracking Number',
    'Tracking Status',
    'Created At',
    'Updated At',
  ]

  const rows = orders.map(order => [
    order.id,
    order.id.slice(0, 8).toUpperCase(),
    order.userId,
    (order.amount / 100).toFixed(2),
    order.currency.toUpperCase(),
    order.status,
    order.couponCode || '',
    order.discountAmount ? (order.discountAmount / 100).toFixed(2) : '0.00',
    order.shippingName || '',
    order.shippingEmail || '',
    order.shippingPhone || '',
    order.shippingAddress || '',
    order.shippingCity || '',
    order.shippingState || '',
    order.shippingZip || '',
    order.shippingCountry || '',
    order.trackingNumber || '',
    order.trackingStatus || '',
    order.createdAt.toISOString(),
    order.updatedAt.toISOString(),
  ])

  // CSV格式：处理包含逗号、引号或换行符的值
  const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const csvRows = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ]

  return csvRows.join('\n')
}

export function exportOrdersToJSON(orders: Order[]): string {
  return JSON.stringify(
    orders.map(order => ({
      id: order.id,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      userId: order.userId,
      amount: order.amount / 100,
      currency: order.currency.toUpperCase(),
      status: order.status,
      couponCode: order.couponCode,
      discountAmount: order.discountAmount ? order.discountAmount / 100 : 0,
      shipping: {
        name: order.shippingName,
        email: order.shippingEmail,
        phone: order.shippingPhone,
        address: order.shippingAddress,
        city: order.shippingCity,
        state: order.shippingState,
        zip: order.shippingZip,
        country: order.shippingCountry,
      },
      tracking: {
        number: order.trackingNumber,
        status: order.trackingStatus,
        carrier: order.trackingCarrier,
      },
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    })),
    null,
    2
  )
}

