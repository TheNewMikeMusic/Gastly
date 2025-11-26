'use client'

import { useState, useEffect, useCallback } from 'react'

interface StockStatusProps {
  productId?: string
}

export function StockStatus({ productId = 'maclock-default' }: StockStatusProps) {
  const [stock, setStock] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [waitlistSuccess, setWaitlistSuccess] = useState(false)

  const checkStock = useCallback(async () => {
    try {
      const response = await fetch(`/api/inventory/check?productId=${productId}&quantity=1`)
      const data = await response.json()
      setStock(data.stock)
    } catch (error) {
      console.error('Failed to check stock:', error)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    checkStock()
  }, [checkStock])

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!waitlistEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitlistEmail)) {
      return
    }

    setWaitlistLoading(true)

    try {
      const response = await fetch('/api/waitlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: waitlistEmail }),
      })

      const data = await response.json()

      if (data.success) {
        setWaitlistSuccess(true)
        setWaitlistEmail('')
        setTimeout(() => {
          setShowWaitlist(false)
          setWaitlistSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to add to waitlist:', error)
    } finally {
      setWaitlistLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-apple-caption font-apple-normal text-[#6e6e73]">
        Checking availability...
      </div>
    )
  }

  if (stock === null) {
    return null
  }

  if (stock === 0) {
    return (
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-[#ff3b30] rounded-full"></span>
          <span className="text-apple-caption font-apple-normal text-[#6e6e73]">
            Out of Stock
          </span>
        </div>
        
        {!showWaitlist && !waitlistSuccess && (
          <button
            onClick={() => setShowWaitlist(true)}
            className="text-sm text-gray-700 hover:text-gray-900 font-medium underline"
          >
            Notify me when available
          </button>
        )}

        {showWaitlist && !waitlistSuccess && (
          <form onSubmit={handleWaitlistSubmit} className="space-y-2">
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={waitlistLoading}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {waitlistLoading ? 'Adding...' : 'Notify Me'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWaitlist(false)
                  setWaitlistEmail('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {waitlistSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              ✓ You&apos;ve been added to the waitlist. We&apos;ll notify you when it&apos;s back in stock!
            </p>
          </div>
        )}
      </div>
    )
  }

  if (stock <= 10) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5">
        <span className="w-1.5 h-1.5 bg-[#ff9500] rounded-full animate-pulse"></span>
        <span className="text-apple-caption font-apple-normal text-[#6e6e73]">
          Only {stock} left · Order soon
        </span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5">
      <span className="w-1.5 h-1.5 bg-[#30d158] rounded-full"></span>
      <span className="text-apple-caption font-apple-normal text-[#6e6e73]">
        In Stock · Ready to ship
      </span>
    </div>
  )
}

