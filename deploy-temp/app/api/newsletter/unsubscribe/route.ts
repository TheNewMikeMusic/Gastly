import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeFromNewsletter } from '@/lib/newsletter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const success = await unsubscribeFromNewsletter(email)

    return NextResponse.json({ success })
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}

