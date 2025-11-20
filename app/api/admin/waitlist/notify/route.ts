import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { notifyWaitlist } from '@/lib/inventory'

export async function POST() {
  try {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await notifyWaitlist('maclock-default')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Notify waitlist error:', error)
    return NextResponse.json(
      { error: 'Failed to notify waitlist' },
      { status: 500 }
    )
  }
}

