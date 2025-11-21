import { Order } from '@prisma/client'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // 如果配置了邮件服务（如SendGrid、Resend等），使用实际服务
  // 否则使用控制台输出（开发环境）
  const emailService = process.env.EMAIL_SERVICE || 'console'

  if (emailService === 'console' || process.env.NODE_ENV === 'development') {
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
    return true
  }

  // 这里可以集成实际的邮件服务
  // 例如：Resend, SendGrid, AWS SES等
  try {
    if (emailService === 'resend' && process.env.RESEND_API_KEY) {
      try {
        const resend = await import('resend')
        const resendClient = new resend.Resend(process.env.RESEND_API_KEY)
        
        await resendClient.emails.send({
          from: process.env.EMAIL_FROM || 'noreply@hello1984.com',
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        })
        return true
      } catch (importError: any) {
        // 如果 resend 包未安装，回退到 console 模式
        if (importError.code === 'MODULE_NOT_FOUND') {
          console.warn('Resend package not installed. Install it with: npm install resend')
          console.log('📧 Email would be sent (Resend not configured):', {
            to: options.to,
            subject: options.subject,
          })
          return true
        }
        throw importError
      }
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }

  return false
}

export async function sendOrderConfirmationEmail(order: Order) {
  const email = order.shippingEmail
  if (!email) return false

  const orderUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/track/${order.id}`
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Hello1984</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Order Confirmation</h2>
          <p>Thank you for your order! We've received your payment and are preparing your Maclock for shipment.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Amount:</strong> ${order.currency.toUpperCase()} ${(order.amount / 100).toFixed(2)}</p>
            ${order.couponCode ? `<p><strong>Coupon:</strong> ${order.couponCode} (Saved ${order.currency.toUpperCase()} ${((order.discountAmount || 0) / 100).toFixed(2)})</p>` : ''}
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          ${order.shippingName ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>${order.shippingName}</p>
            ${order.shippingPhone ? `<p>${order.shippingPhone}</p>` : ''}
            <p>${[
              order.shippingAddress,
              order.shippingCity,
              order.shippingState,
              order.shippingZip,
            ].filter(Boolean).join(', ')}${order.shippingCountry ? `, ${order.shippingCountry}` : ''}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${orderUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Your Order</a>
          </div>

          <p style="color: #666; font-size: 14px;">We'll send you another email once your order ships with tracking information.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you have any questions, please contact us at <a href="mailto:support@hello1984.com">support@hello1984.com</a>
          </p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: `Order Confirmation - ${order.id.slice(0, 8).toUpperCase()}`,
    html,
  })
}

export async function sendShippingNotificationEmail(order: Order) {
  const email = order.shippingEmail
  if (!email || !order.trackingNumber) return false

  const trackingUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/track/${order.id}`
  const fourpxUrl = `https://track.4px.com/?trackingNumber=${order.trackingNumber}`
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Shipped</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Hello1984</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">🚀 Your Order Has Shipped!</h2>
          <p>Great news! Your Maclock is on its way to you.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Tracking Information</h3>
            <p><strong>Order Number:</strong> ${order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Tracking Number:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${order.trackingNumber}</code></p>
            <p><strong>Carrier:</strong> 4PX</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${trackingUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">Track on Our Site</a>
            <a href="${fourpxUrl}" style="background: #333; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Track on 4PX</a>
          </div>

          <p style="color: #666; font-size: 14px;">You'll receive updates as your package moves through our shipping network.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Questions? Contact us at <a href="mailto:support@hello1984.com">support@hello1984.com</a>
          </p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: `Your Order Has Shipped - ${order.id.slice(0, 8).toUpperCase()}`,
    html,
  })
}

export async function sendTrackingUpdateEmail(order: Order, updateMessage: string) {
  const email = order.shippingEmail
  if (!email || !order.trackingNumber) return false

  const trackingUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/account/track/${order.id}`
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tracking Update</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Hello1984</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">📦 Tracking Update</h2>
          <p>Your order has been updated:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0;">${updateMessage}</p>
            <p style="margin-top: 15px; color: #666;"><strong>Tracking:</strong> ${order.trackingNumber}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${trackingUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Full Tracking</a>
          </div>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: `Tracking Update - ${order.id.slice(0, 8).toUpperCase()}`,
    html,
  })
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Hello1984 Newsletter</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Hello1984</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Welcome!</h2>
          <p>Thank you for subscribing to our newsletter. You'll be the first to know about:</p>
          <ul>
            <li>New product launches</li>
            <li>Exclusive discounts and promotions</li>
            <li>Product updates and improvements</li>
            <li>Behind-the-scenes content</li>
          </ul>
          <p>We're excited to have you on board!</p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: 'Welcome to Hello1984 Newsletter',
    html,
  })
}

export async function sendStockNotificationEmail(email: string) {
  const productUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}`
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maclock is Back in Stock!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Hello1984</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">🎉 Great News!</h2>
          <p>The Maclock is back in stock! Don't miss out - order yours today.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${productUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Order Now</a>
          </div>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: 'Maclock is Back in Stock!',
    html,
  })
}

