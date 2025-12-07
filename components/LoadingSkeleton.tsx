'use client'

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'image' | 'button'
  lines?: number
}

export function LoadingSkeleton({ className = '', variant = 'card', lines = 3 }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`glass-neon rounded-2xl overflow-hidden ${className}`}>
        <div className="relative aspect-square bg-ghost-bg-section/50 animate-pulse" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-ghost-bg-section/50 rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-ghost-bg-section/50 rounded-lg w-full animate-pulse" />
          <div className="h-4 bg-ghost-bg-section/50 rounded-lg w-5/6 animate-pulse" />
        </div>
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-ghost-bg-section/50 rounded-lg animate-pulse ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'image') {
    return (
      <div className={`relative aspect-square bg-ghost-bg-section/50 rounded-2xl animate-pulse ${className}`} />
    )
  }

  if (variant === 'button') {
    return (
      <div className={`h-12 bg-ghost-bg-section/50 rounded-full animate-pulse ${className}`} />
    )
  }

  return null
}
