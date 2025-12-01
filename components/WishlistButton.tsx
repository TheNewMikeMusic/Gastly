'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/config'

// Safe hook wrapper - always call hooks, but return safe defaults if Clerk not configured
function useSafeAuth() {
  // Always call the hook (required by React rules)
  const clerkAuth = useAuth()
  // Return safe defaults if Clerk not configured
  if (!isClerkConfigured()) {
    return { isSignedIn: false }
  }
  return clerkAuth
}

interface WishlistButtonProps {
  productId?: string
  variant?: 'icon' | 'button'
}

export function WishlistButton({ productId = 'maclock-default', variant = 'icon' }: WishlistButtonProps) {
  const { isSignedIn } = useSafeAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkWishlist = useCallback(async () => {
    try {
      const response = await fetch('/api/wishlist')
      const data = await response.json()
      setIsInWishlist(data.wishlist?.some((item: any) => item.productId === productId) || false)
    } catch (error) {
      console.error('Failed to check wishlist:', error)
    }
  }, [productId])

  useEffect(() => {
    if (isSignedIn) {
      checkWishlist()
    }
  }, [isSignedIn, checkWishlist])

  const toggleWishlist = async () => {
    if (!isSignedIn) {
      // 可以重定向到登录页面
      return
    }

    setLoading(true)
    try {
      if (isInWishlist) {
        await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' })
        setIsInWishlist(false)
      } else {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn && variant === 'icon') {
    return null
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isInWishlist
          ? 'bg-red-50 text-red-700 hover:bg-red-100'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {loading ? '...' : isInWishlist ? '✓ In Wishlist' : '+ Add to Wishlist'}
    </button>
  )
}

