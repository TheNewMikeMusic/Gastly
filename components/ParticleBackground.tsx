'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
}

interface ParticleBackgroundProps {
  particleCount?: number
  speed?: number
  colors?: string[]
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function ParticleBackground({
  particleCount = 50,
  speed = 0.5,
  colors = ['rgba(124, 58, 237, 0.6)', 'rgba(168, 85, 247, 0.4)', 'rgba(139, 92, 246, 0.5)'],
  className = '',
  intensity = 'medium',
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const prefersReducedMotion = useReducedMotion()
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  // 检测设备性能
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkPerformance = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const hardwareConcurrency = navigator.hardwareConcurrency || 2
      const memory = (navigator as any).deviceMemory || 4
      
      // 低性能设备：移动设备且硬件线程数少于4，或内存少于4GB
      const lowPerf = isMobile && (hardwareConcurrency < 4 || memory < 4)
      setIsLowPerformance(lowPerf)
    }
    
    checkPerformance()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return

    const canvas = canvasRef.current
    let ctx: CanvasRenderingContext2D | null = null
    
    try {
      ctx = canvas.getContext('2d')
      if (!ctx) return
    } catch (error) {
      console.debug('Canvas context creation failed:', error)
      return
    }

    // 根据性能调整粒子数量
    const adjustedCount = isLowPerformance 
      ? Math.floor(particleCount * 0.5)
      : intensity === 'high' 
        ? particleCount * 1.5 
        : intensity === 'low'
          ? Math.floor(particleCount * 0.7)
          : particleCount

    // 设置canvas尺寸
    const resizeCanvas = () => {
      try {
        const rect = canvas.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      } catch (error) {
        console.debug('Canvas resize failed:', error)
      }
    }

    resizeCanvas()

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < adjustedCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width / window.devicePixelRatio,
          y: Math.random() * canvas.height / window.devicePixelRatio,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    initParticles()

    // 绘制粒子
    const drawParticles = () => {
      try {
        if (!ctx || canvas.width === 0 || canvas.height === 0) return
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
        
        particlesRef.current.forEach((particle, i) => {
          // 更新位置
          particle.x += particle.vx
          particle.y += particle.vy

          // 边界检测
          if (particle.x < 0 || particle.x > canvas.width / window.devicePixelRatio) {
            particle.vx *= -1
          }
          if (particle.y < 0 || particle.y > canvas.height / window.devicePixelRatio) {
            particle.vy *= -1
          }

          // 绘制粒子
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = particle.color.replace('0.6', particle.opacity.toString())
          ctx.fill()

          // 绘制连线（仅在高性能设备上）
          if (!isLowPerformance && intensity !== 'low') {
            particlesRef.current.slice(i + 1).forEach((otherParticle) => {
              const dx = particle.x - otherParticle.x
              const dy = particle.y - otherParticle.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              const maxDistance = 150

              if (distance < maxDistance) {
                ctx.beginPath()
                ctx.moveTo(particle.x, particle.y)
                ctx.lineTo(otherParticle.x, otherParticle.y)
                ctx.strokeStyle = particle.color.replace('0.6', (0.2 * (1 - distance / maxDistance)).toString())
                ctx.lineWidth = 0.5
                ctx.stroke()
              }
            })
          }
        })
      } catch (error) {
        console.debug('Draw particles failed:', error)
      }
    }

    // 动画循环
    const animate = () => {
      drawParticles()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // 窗口大小改变时重新调整
    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [prefersReducedMotion, particleCount, speed, colors, intensity, isLowPerformance])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}


