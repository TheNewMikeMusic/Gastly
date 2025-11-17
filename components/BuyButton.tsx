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
    primary: 'bg-foreground text-background hover:opacity-90',
    secondary: 'bg-white text-gray-900 border-2 border-white/20 hover:bg-gray-100 hover:border-white/40',
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      className={`${sizeClasses[size]} ${variantClasses[variant]} font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Buy Now"
    >
      {loading ? 'Processing...' : 'Buy Now'}
    </motion.button>
  )
}

