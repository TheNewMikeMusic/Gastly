'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks'

interface HolographicEffectProps {
  children: ReactNode
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function HolographicEffect({
  children,
  intensity = 'medium',
  className = '',
}: HolographicEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }

    const container = containerRef.current
    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [prefersReducedMotion])

  const intensityMap = {
    low: '0.3',
    medium: '0.5',
    high: '0.7',
  }

  const gradientStyle = prefersReducedMotion
    ? {}
    : {
        background: `
          linear-gradient(
            135deg,
            rgba(124, 58, 237, ${intensityMap[intensity]}) 0%,
            rgba(168, 85, 247, ${intensityMap[intensity]}) 25%,
            rgba(59, 130, 246, ${intensityMap[intensity]}) 50%,
            rgba(168, 85, 247, ${intensityMap[intensity]}) 75%,
            rgba(124, 58, 237, ${intensityMap[intensity]}) 100%
          )
        `,
        backgroundSize: '200% 200%',
        backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'brightness(1.2)',
      }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 扫描线效果 */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(124, 58, 237, 0.1) 2px,
                rgba(124, 58, 237, 0.1) 4px
              )
            `,
            animation: 'scan 3s linear infinite',
            mixBlendMode: 'screen',
          }}
        />
      )}
      
      {/* 彩虹渐变覆盖层 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
        style={gradientStyle}
      />
      
      {/* 内容 */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  )
}


