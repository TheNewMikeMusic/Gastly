import { Order } from '@prisma/client'

export interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  discount: number
  total: number
  currency: string
  paymentMethod: string
  paymentDate: string
}

export function generateInvoiceData(order: Order): InvoiceData {
  const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}-${new Date(order.createdAt).getFullYear()}`
  
  const shippingAddress = [
    order.shippingAddress,
    order.shippingCity,
    order.shippingState,
    order.shippingZip,
  ]
    .filter(Boolean)
    .join(', ') + (order.shippingCountry ? `, ${order.shippingCountry}` : '')

  const subtotal = order.amount + (order.discountAmount || 0)
  const discount = order.discountAmount || 0
  const total = order.amount

  return {
    invoiceNumber,
    orderNumber: order.id.slice(0, 8).toUpperCase(),
    date: new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    customerName: order.shippingName || 'Customer',
    customerEmail: order.shippingEmail || '',
    customerPhone: order.shippingPhone || undefined,
    shippingAddress,
    items: [
      {
        description: 'Maclock Digital Clock',
        quantity: 1,
        unitPrice: subtotal,
        total: subtotal,
      },
    ],
    subtotal,
    discount,
    total,
    currency: order.currency.toUpperCase(),
    paymentMethod: 'Credit Card (Stripe)',
    paymentDate: order.status === 'paid' 
      ? new Date(order.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Pending',
  }
}

export function generateInvoiceHTML(data: InvoiceData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #f5f5f5;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #667eea;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 10px;
    }
    .invoice-info p {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #667eea;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    .info-group p {
      margin-bottom: 5px;
      color: #333;
    }
    .info-group strong {
      color: #666;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    thead {
      background: #f8f9fa;
    }
    th {
      text-align: left;
      padding: 12px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e9ecef;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 20px;
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .totals-row.total {
      font-size: 18px;
      font-weight: bold;
      padding-top: 15px;
      border-top: 2px solid #667eea;
      margin-top: 10px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo">Hello1984</div>
      <div class="invoice-info">
        <h1>INVOICE</h1>
        <p>Invoice #${data.invoiceNumber}</p>
        <p>Date: ${data.date}</p>
      </div>
    </div>

    <div class="two-columns">
      <div class="section">
        <div class="section-title">Bill To</div>
        <div class="info-group">
          <p><strong>${data.customerName}</strong></p>
          ${data.customerEmail ? `<p>${data.customerEmail}</p>` : ''}
          ${data.customerPhone ? `<p>${data.customerPhone}</p>` : ''}
          <p style="margin-top: 10px;">${data.shippingAddress}</p>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Order Information</div>
        <div class="info-group">
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Items</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${data.currency} ${(item.unitPrice / 100).toFixed(2)}</td>
              <td class="text-right">${data.currency} ${(item.total / 100).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span>${data.currency} ${(data.subtotal / 100).toFixed(2)}</span>
      </div>
      ${data.discount > 0 ? `
        <div class="totals-row">
          <span>Discount:</span>
          <span>-${data.currency} ${(data.discount / 100).toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="totals-row total">
        <span>Total:</span>
        <span>${data.currency} ${(data.total / 100).toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>Hello1984 - Retro Macintosh-style Digital Clock</p>
    </div>
  </div>
</body>
</html>
  `
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  // 这里可以集成PDF生成库，如puppeteer或pdfkit
  // 为了简化，返回HTML字符串，实际使用时可以转换为PDF
  const html = generateInvoiceHTML(data)
  // 实际实现需要使用PDF库
  return Promise.resolve(Buffer.from(html))
}

