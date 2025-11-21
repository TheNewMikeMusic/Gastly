'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  stock: number
  sku?: string | null
}

interface WaitlistEntry {
  id: string
  email: string
  notified: boolean
  createdAt: Date | string
}

interface AdminInventoryManagementProps {
  product: Product | null
}

export function AdminInventoryManagement({ product: initialProduct }: AdminInventoryManagementProps) {
  const router = useRouter()
  const [product, setProduct] = useState(initialProduct)
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [stockInput, setStockInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadWaitlist()
  }, [])

  const loadWaitlist = async () => {
    try {
      const response = await fetch('/api/admin/waitlist')
      const data = await response.json()
      setWaitlist(data.waitlist || [])
    } catch (error) {
      console.error('Failed to load waitlist:', error)
    }
  }

  const handleUpdateStock = async () => {
    const newStock = parseInt(stockInput)
    if (isNaN(newStock) || newStock < 0) {
      setError('Please enter a valid stock number')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'maclock-default',
          stock: newStock,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update stock')
        return
      }

      setSuccess(`Stock updated to ${newStock}`)
      setStockInput('')
      router.refresh()
      
      // 重新加载产品信息
      const productResponse = await fetch('/api/inventory/check?productId=maclock-default')
      const productData = await productResponse.json()
      setProduct({ ...product!, stock: productData.stock })
      
      // 如果有新库存，重新加载等待列表
      if (newStock > 0) {
        loadWaitlist()
      }
    } catch (err) {
      setError('Failed to update stock')
    } finally {
      setLoading(false)
    }
  }

  const handleNotifyWaitlist = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/waitlist/notify', {
        method: 'POST',
      })

      if (response.ok) {
        setSuccess('Waitlist notification sent')
        loadWaitlist()
      } else {
        setError('Failed to notify waitlist')
      }
    } catch (err) {
      setError('Failed to notify waitlist')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-gray-600">Product not found. Please create the default product first.</p>
      </div>
    )
  }

  const notifiedCount = waitlist.filter((w) => w.notified).length
  const pendingCount = waitlist.filter((w) => !w.notified).length

  return (
    <div className="space-y-6">
      {/* 库存信息卡片 */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Current Stock</h2>
        <div className="flex items-center gap-6">
          <div>
            <div className="text-4xl font-bold text-gray-900">{product.stock}</div>
            <div className="text-sm text-gray-600 mt-1">units available</div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${
            product.stock === 0
              ? 'bg-red-100 text-red-800'
              : product.stock <= 10
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {product.stock === 0
              ? 'Out of Stock'
              : product.stock <= 10
              ? 'Low Stock'
              : 'In Stock'}
          </div>
        </div>
      </div>

      {/* 更新库存 */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Update Stock</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}
        <div className="flex gap-4">
          <input
            type="number"
            min="0"
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value)}
            placeholder="Enter new stock quantity"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          />
          <button
            onClick={handleUpdateStock}
            disabled={loading}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating...' : 'Update Stock'}
          </button>
        </div>
      </div>

      {/* 等待列表 */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Waitlist</h2>
            <p className="text-sm text-gray-600 mt-1">
              {pendingCount} pending notifications, {notifiedCount} already notified
            </p>
          </div>
          {pendingCount > 0 && product.stock > 0 && (
            <button
              onClick={handleNotifyWaitlist}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Notify Waitlist ({pendingCount})
            </button>
          )}
        </div>

        {waitlist.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No one on the waitlist</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {waitlist.map((entry) => (
              <div
                key={entry.id}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  entry.notified ? 'bg-gray-50' : 'bg-blue-50'
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{entry.email}</div>
                  <div className="text-xs text-gray-600">
                    Added {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                {entry.notified ? (
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                    Notified
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

