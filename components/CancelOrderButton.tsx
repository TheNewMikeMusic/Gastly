'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Customer request' }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to cancel order')
      }
    } catch (error) {
      alert('Failed to cancel order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-center min-h-[44px] flex items-center justify-center touch-manipulation whitespace-nowrap"
    >
      {loading ? 'Cancelling...' : 'Cancel Order'}
    </button>
  )
}

