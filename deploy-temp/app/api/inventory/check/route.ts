import { NextRequest, NextResponse } from 'next/server'
import { checkStock, getProductStock } from '@/lib/inventory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId') || 'maclock-default'
    const quantity = parseInt(searchParams.get('quantity') || '1')

    const product = await getProductStock(productId)
    const inStock = await checkStock(productId, quantity)

    return NextResponse.json({
      inStock,
      stock: product.stock,
      productId: product.id,
      productName: product.name,
    })
  } catch (error: any) {
    console.error('Inventory check error:', error)
    return NextResponse.json(
      { error: 'Failed to check inventory' },
      { status: 500 }
    )
  }
}

