import { NextRequest, NextResponse } from 'next/server'
import { checkStock, getProductStock } from '@/lib/inventory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId') || 'maclock-default'
    const quantity = parseInt(searchParams.get('quantity') || '1')

    // 确保产品存在
    const product = await getProductStock(productId)
    
    // 检查库存
    const inStock = await checkStock(productId, quantity)

    return NextResponse.json({
      inStock,
      stock: product.stock,
      productId: product.id,
      productName: product.name,
    })
  } catch (error: any) {
    console.error('Inventory check error:', error)
    
    // 返回更详细的错误信息用于调试
    const errorMessage = error?.message || 'Failed to check inventory'
    const errorStack = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Failed to check inventory',
        message: errorMessage,
        ...(errorStack && { stack: errorStack })
      },
      { status: 500 }
    )
  }
}





