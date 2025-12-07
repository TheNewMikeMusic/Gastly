'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useGBASound } from '@/lib/hooks/useGBASound'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glowColor?: string
  pulse?: boolean
}

export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  glowColor = '#7C3AED',
  pulse = true,
  className = '',
  onClick,
  ...props
}: NeonButtonProps) {
  const { playHoverSound, playClickSound } = useGBASound()

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-apple-caption min-h-[44px]',
    md: 'px-6 py-3 text-apple-body-sm min-h-[48px]',
    lg: 'px-8 py-4 text-apple-body min-h-[52px]',
  }

  const variantClasses = {
    primary: 'bg-transparent border-2 text-white',
    secondary: 'bg-black/20 border-2 text-white backdrop-blur-sm',
    ghost: 'bg-transparent border border-white/20 text-white',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound()
    onClick?.(e)
  }

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={playHoverSound}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        font-apple-semibold rounded-full 
        relative overflow-hidden
        transition-all duration-300 ease-apple-standard
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        touch-manipulation touch-target
        ${className}
      `}
      style={{
        borderColor: glowColor,
        boxShadow: pulse
          ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, inset 0 0 20px ${glowColor}33`
          : `0 0 10px ${glowColor}`,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: pulse
          ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 0 90px ${glowColor}66, inset 0 0 30px ${glowColor}33`
          : `0 0 20px ${glowColor}`,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* 发光背景动画 */}
      {pulse && (
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* 扫描线效果 */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 文字内容 */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}


