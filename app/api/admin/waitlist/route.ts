import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const waitlist = await prisma.waitlist.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ waitlist })
  } catch (error: any) {
    console.error('Get waitlist error:', error)
    return NextResponse.json(
      { error: 'Failed to get waitlist' },
      { status: 500 }
    )
  }
}

