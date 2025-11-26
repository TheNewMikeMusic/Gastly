'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteOrderButtonProps {
  orderId: string
  orderStatus: string
  className?: string
}

export function DeleteOrderButton({ orderId, orderStatus, className = '' }: DeleteOrderButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  // 只有pending或cancelled状态的订单可以删除
  const canDelete = orderStatus === 'pending' || orderStatus === 'cancelled'
  
  if (!canDelete) {
    return null
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete order')
      }

      // 刷新页面以更新订单列表
      router.refresh()
    } catch (error: any) {
      console.error('Delete order error:', error)
      alert(error.message || 'Failed to delete order. Please try again.')
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className={`flex flex-col gap-2 p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-sm text-gray-700 mb-2 font-medium">
          Are you sure you want to delete this order?
        </p>
        <p className="text-xs text-gray-600 mb-3">
          This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false)
              setLoading(false)
            }}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className={`px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors text-center min-h-[44px] flex items-center justify-center touch-manipulation ${className}`}
    >
      Delete Order
    </button>
  )
}

