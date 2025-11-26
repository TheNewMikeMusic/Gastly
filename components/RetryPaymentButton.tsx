'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RetryPaymentButtonProps {
  orderId: string
  className?: string
}

export function RetryPaymentButton({ orderId, className = '' }: RetryPaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRetryPayment = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}/retry-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session')
      }

      if (data.url) {
        // 重定向到Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('No payment URL received')
      }
    } catch (error: any) {
      console.error('Retry payment error:', error)
      alert(error.message || 'Failed to start payment. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleRetryPayment}
      disabled={loading}
      className={`px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-950 active:bg-gray-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center min-h-[44px] touch-manipulation ${className}`}
    >
      {loading ? 'Processing...' : 'Continue Payment'}
    </button>
  )
}

