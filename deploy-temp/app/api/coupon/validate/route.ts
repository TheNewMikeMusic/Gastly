import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/coupon'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, orderAmount } = body

    if (!code || !orderAmount) {
      return NextResponse.json(
        { error: 'Coupon code and order amount are required' },
        { status: 400 }
      )
    }

    const result = await validateCoupon(code, orderAmount)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon', valid: false, discountAmount: 0 },
      { status: 500 }
    )
  }
}

