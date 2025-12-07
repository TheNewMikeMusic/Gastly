'use client'

import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks'
import { createEnterAnimation, createHoverAnimation, createTapAnimation, EASE_APPLE } from '@/lib/animations'

interface CardProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass' | 'solid'
  index?: number
  isVisible?: boolean
  priority?: boolean
  interactive?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
}

const sizeClasses = {
  sm: 'rounded-xl p-4',
  md: 'rounded-2xl p-5 sm:p-6',
  lg: 'rounded-3xl p-6 sm:p-8',
}

const variantClasses = {
  default: 'glass-neon border border-ghost-purple-primary/30 shadow-glass-dark',
  glass: 'glass-neon border border-ghost-purple-primary/30 shadow-glass-dark',
  solid: 'bg-ghost-bg-card border border-ghost-purple-primary/30 shadow-glass-dark',
}

export function Card({
  children,
  className = '',
  size = 'md',
  variant = 'default',
  index = 0,
  isVisible = true,
  priority = false,
  interactive = true,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: CardProps) {
  const prefersReducedMotion = useReducedMotion()
  
  const enterAnimation = createEnterAnimation('card', index, 'card')
  const hoverAnimation = interactive ? createHoverAnimation('card') : undefined
  const tapAnimation = interactive ? createTapAnimation() : undefined

  const motionProps: MotionProps = {
    initial: prefersReducedMotion || !isVisible ? {} : enterAnimation.initial,
    animate: prefersReducedMotion || !isVisible ? {} : enterAnimation.animate,
    transition: prefersReducedMotion ? {} : enterAnimation.transition,
    whileHover: prefersReducedMotion || !interactive ? {} : hoverAnimation,
    whileTap: prefersReducedMotion || !interactive ? {} : tapAnimation,
    onMouseEnter,
    onMouseLeave,
    onClick,
  }

  return (
    <motion.div
      {...motionProps}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${interactive ? 'touch-manipulation cursor-pointer group' : ''}
        transition-all duration-300
        ${className}
      `}
      style={{
        transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
      }}
    >
      {/* 悬停时的光晕效果 */}
      {interactive && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit">
          <div 
            className="absolute inset-0 rounded-inherit"
            style={{
              background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15), transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </div>
      )}
      
      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

