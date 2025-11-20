import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/newsletter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required' },
        { status: 400 }
      )
    }

    const result = await subscribeToNewsletter(email)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}

