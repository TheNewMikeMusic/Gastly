import { prisma } from './prisma'
import { sendNewsletterWelcomeEmail } from './email'

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // 检查是否已经订阅
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isActive) {
        return {
          success: false,
          message: 'This email is already subscribed',
        }
      } else {
        // 重新激活订阅
        await prisma.newsletter.update({
          where: { email },
          data: {
            isActive: true,
            unsubscribedAt: null,
          },
        })
        await sendNewsletterWelcomeEmail(email)
        return {
          success: true,
          message: 'Successfully resubscribed to newsletter',
        }
      }
    }

    // 创建新订阅
    await prisma.newsletter.create({
      data: {
        email,
        isActive: true,
      },
    })

    await sendNewsletterWelcomeEmail(email)

    return {
      success: true,
      message: 'Successfully subscribed to newsletter',
    }
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error)
    return {
      success: false,
      message: 'Failed to subscribe. Please try again later.',
    }
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  try {
    await prisma.newsletter.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    })
    return true
  } catch (error) {
    console.error('Failed to unsubscribe:', error)
    return false
  }
}

export async function getAllSubscribers(activeOnly: boolean = true) {
  try {
    return await prisma.newsletter.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { subscribedAt: 'desc' },
    })
  } catch (error) {
    console.error('Failed to get subscribers:', error)
    return []
  }
}

