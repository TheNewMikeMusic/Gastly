import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const threads = await prisma.thread.findMany({
      where: { buyerId: userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ threads })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { threadId, body: messageBody } = body

    if (!threadId || !messageBody) {
      return NextResponse.json(
        { error: 'Thread ID and message body required' },
        { status: 400 }
      )
    }

    // Sanitize message body (basic XSS prevention)
    const sanitizedBody = messageBody
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim()

    const message = await prisma.message.create({
      data: {
        threadId,
        authorId: userId,
        body: sanitizedBody,
      },
    })

    // Update thread updatedAt
    await prisma.thread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}

