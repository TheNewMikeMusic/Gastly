'use client'

import { useState } from 'react'

interface CouponInputProps {
  onApply: (code: string, discount: number) => void
  onRemove: () => void
  appliedCode?: string
  discountAmount?: number
}

export function CouponInput({ onApply, onRemove, appliedCode, discountAmount }: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 这里需要订单金额，暂时使用固定值
      // 实际使用时应该从订单上下文获取
      const orderAmount = 29900 // $299 in cents
      
      const response = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          orderAmount,
        }),
      })

      const data = await response.json()

      if (!data.valid) {
        setError(data.error || 'Invalid coupon code')
        return
      }

      onApply(code.trim().toUpperCase(), data.discountAmount)
      setCode('')
    } catch (err) {
      setError('Failed to validate coupon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div>
          <p className="text-sm font-medium text-green-900">Coupon Applied</p>
          <p className="text-sm text-green-700">{appliedCode}</p>
          {discountAmount && discountAmount > 0 && (
            <p className="text-xs text-green-600 mt-1">
              You saved ${(discountAmount / 100).toFixed(2)}
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-sm text-green-700 hover:text-green-900 font-medium"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
        />
        <button
          onClick={handleApply}
          disabled={loading}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

