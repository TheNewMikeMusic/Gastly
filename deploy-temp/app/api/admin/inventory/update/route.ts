import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { updateStock, notifyWaitlist } from '@/lib/inventory'

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, stock } = body

    if (!productId || stock === undefined) {
      return NextResponse.json(
        { error: 'Product ID and stock are required' },
        { status: 400 }
      )
    }

    await updateStock(productId, stock)

    // 如果有新库存，通知等待列表
    if (stock > 0) {
      await notifyWaitlist(productId)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update inventory error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update inventory' },
      { status: 500 }
    )
  }
}

