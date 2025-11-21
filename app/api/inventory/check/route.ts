import { NextRequest, NextResponse } from 'next/server'
import { checkStock, getProductStock } from '@/lib/inventory'

export async function GET(request: NextRequest) {
  // 使用独立的错误处理函数，确保总是返回JSON
  const safeResponse = (data: any, status = 200) => {
    try {
      return NextResponse.json(data, { status })
    } catch (jsonError) {
      // 如果JSON序列化失败，返回最简单的JSON
      return NextResponse.json({
        inStock: true,
        stock: 100,
        productId: 'maclock-default',
        productName: 'Maclock Digital Clock',
      }, { status: 200 })
    }
  }

  try {
    // 确保URL解析不会失败
    let searchParams: URLSearchParams
    let productId = 'maclock-default'
    let quantity = 1

    try {
      const url = new URL(request.url)
      searchParams = url.searchParams
      productId = searchParams.get('productId') || 'maclock-default'
      quantity = parseInt(searchParams.get('quantity') || '1', 10)
    } catch (urlError) {
      console.error('URL parsing error:', urlError)
      // 如果URL解析失败，使用默认值
      return safeResponse({
        inStock: true,
        stock: 100,
        productId: 'maclock-default',
        productName: 'Maclock Digital Clock',
      })
    }

    // 确保产品存在 - 添加错误处理
    let product = null
    try {
      product = await getProductStock(productId)
    } catch (productError: any) {
      console.error('Failed to get product stock:', productError)
      // 如果数据库查询失败，返回默认值
      return safeResponse({
        inStock: true,
        stock: 100,
        productId: productId,
        productName: 'Maclock Digital Clock',
      })
    }
    
    // 检查库存 - 添加错误处理
    let inStock = true
    try {
      inStock = await checkStock(productId, quantity)
    } catch (stockError: any) {
      console.error('Failed to check stock:', stockError)
      // 如果库存检查失败，假设有库存
      inStock = true
    }

    return safeResponse({
      inStock,
      stock: product?.stock ?? 100,
      productId: product?.id ?? productId,
      productName: product?.name ?? 'Maclock Digital Clock',
    })
  } catch (error: any) {
    console.error('Inventory check error:', error)
    
    // 确保总是返回有效的JSON响应，状态码200而不是500
    return safeResponse({
      inStock: true, // 默认有库存，避免阻止用户购买
      stock: 100,
      productId: 'maclock-default',
      productName: 'Maclock Digital Clock',
      error: process.env.NODE_ENV === 'development' ? String(error?.message || error) : undefined,
    })
  }
}

