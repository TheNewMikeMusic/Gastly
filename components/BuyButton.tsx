'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface BuyButtonProps {
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function BuyButton({ className = '', variant = 'primary', size = 'md', onClick }: BuyButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    router.push('/checkout')
  }

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
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
      className={`${sizeClasses[size]} ${variantClasses[variant]} font-semibold rounded-full transition-all duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent touch-manipulation ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Buy Now"
    >
      Buy Now
    </motion.button>
  )
}
