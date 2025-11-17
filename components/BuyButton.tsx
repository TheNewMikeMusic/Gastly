'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface BuyButtonProps {
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function BuyButton({ className = '', variant = 'primary', size = 'md' }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary:
      'bg-gray-900 text-white shadow-deep hover:bg-gray-950 hover:shadow-deep focus-visible:ring-gray-900/60',
    secondary:
      'border border-black/10 bg-white/90 text-gray-900 hover:bg-white focus-visible:ring-gray-400',
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      className={`${sizeClasses[size]} ${variantClasses[variant]} font-semibold rounded-full transition-all duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      aria-label="Buy Now"
    >
      {loading ? 'Processing...' : 'Buy Now'}
    </motion.button>
  )
}
