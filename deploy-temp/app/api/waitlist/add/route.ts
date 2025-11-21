import { NextRequest, NextResponse } from 'next/server'
import { addToWaitlist } from '@/lib/inventory'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required' },
        { status: 400 }
      )
    }

    const success = await addToWaitlist(email, userId || undefined)

    return NextResponse.json({
      success,
      message: success
        ? 'You have been added to the waitlist. We will notify you when the product is back in stock.'
        : 'Failed to add to waitlist',
    })
  } catch (error: any) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add to waitlist' },
      { status: 500 }
    )
  }
}

