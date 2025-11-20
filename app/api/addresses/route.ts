import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  saveAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from '@/lib/addresses'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const addresses = await getAddresses(userId)
    return NextResponse.json({ addresses })
  } catch (error: any) {
    console.error('Get addresses error:', error)
    return NextResponse.json(
      { error: 'Failed to get addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const address = await saveAddress(userId, body)

    return NextResponse.json({ address })
  } catch (error: any) {
    console.error('Save address error:', error)
    return NextResponse.json(
      { error: 'Failed to save address' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...addressData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    const address = await updateAddress(userId, id, addressData)
    return NextResponse.json({ address })
  } catch (error: any) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    await deleteAddress(userId, id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete address error:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}

