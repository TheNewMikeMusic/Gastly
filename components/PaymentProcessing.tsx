'use client'

import { useEffect } from 'react'

export function PaymentProcessing() {
  useEffect(() => {
    // Auto-refresh after 3 seconds
    const timer = setTimeout(() => {
      window.location.reload()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Payment Processing</h1>
        <p className="text-gray-700 mb-6">
          Your payment is being processed. Please check your email for confirmation.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          This page will automatically refresh in a few seconds...
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-all"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}


