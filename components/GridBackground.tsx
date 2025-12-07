'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks'

interface GridBackgroundProps {
  cellSize?: number
  lineColor?: string
  className?: string
  animated?: boolean
}

export function GridBackground({
  cellSize = 50,
  lineColor = 'rgba(124, 58, 237, 0.1)',
  className = '',
  animated = true,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const offsetRef = useRef({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current || !animated) return

    const canvas = canvasRef.current
    let ctx: CanvasRenderingContext2D | null = null
    
    try {
      ctx = canvas.getContext('2d')
      if (!ctx) return
    } catch (error) {
      console.debug('Canvas context creation failed:', error)
      return
    }

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

    const drawGrid = () => {
      try {
        if (!ctx || canvas.width === 0 || canvas.height === 0) return
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
        
        const width = canvas.width / window.devicePixelRatio
        const height = canvas.height / window.devicePixelRatio
        const offsetX = offsetRef.current.x % cellSize
        const offsetY = offsetRef.current.y % cellSize

        ctx.strokeStyle = lineColor
        ctx.lineWidth = 1

        // 绘制垂直线
        for (let x = -offsetX; x < width; x += cellSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }

        // 绘制水平线
        for (let y = -offsetY; y < height; y += cellSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }

        // 添加发光点
        const glowPoints = [
          { x: width * 0.2, y: height * 0.3 },
          { x: width * 0.8, y: height * 0.7 },
        ]

        glowPoints.forEach((point) => {
          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            cellSize * 2
          )
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)')
          gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.1)')
          gradient.addColorStop(1, 'transparent')

          ctx.fillStyle = gradient
          ctx.fillRect(point.x - cellSize * 2, point.y - cellSize * 2, cellSize * 4, cellSize * 4)
        })
      } catch (error) {
        console.debug('Draw grid failed:', error)
      }
    }

    const animate = () => {
      if (animated) {
        offsetRef.current.x += 0.5
        offsetRef.current.y += 0.3
      }
      drawGrid()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
      drawGrid()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [prefersReducedMotion, cellSize, lineColor, animated])

  if (prefersReducedMotion && !animated) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          backgroundImage: `
            linear-gradient(${lineColor} 1px, transparent 1px),
            linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          zIndex: 0,
        }}
        aria-hidden="true"
      />
    )
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
