'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlowEffectProps {
  children: ReactNode
  intensity?: 'low' | 'medium' | 'high'
  color?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function GlowEffect({
  children,
  intensity = 'medium',
  color = 'rgba(124, 58, 237, 0.5)',
  size = 'md',
  animated = true,
  className = '',
}: GlowEffectProps) {
  const intensityMap = {
    low: '0 0 20px',
    medium: '0 0 40px, 0 0 80px',
    high: '0 0 60px, 0 0 120px, 0 0 180px',
  }

  const sizeMap = {
    sm: '0.5',
    md: '1',
    lg: '1.5',
  }

  const glowStyle = {
    filter: `drop-shadow(${intensityMap[intensity]} ${color})`,
    willChange: animated ? 'filter' : 'auto',
  }

  if (!animated) {
    return (
      <div className={className} style={glowStyle}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={glowStyle}
      animate={{
        filter: [
          `drop-shadow(${intensityMap[intensity]} ${color})`,
          `drop-shadow(${intensityMap[intensity]} ${color.replace('0.5', '0.7')})`,
          `drop-shadow(${intensityMap[intensity]} ${color})`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}


