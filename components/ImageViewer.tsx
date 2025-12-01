'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ImageViewerProps {
  images: Array<{ prefix: string; alt: string; title?: string }>
  currentIndex: number
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export function ImageViewer({ images, currentIndex, onClose, onNext, onPrev }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null)
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const lastTapTime = useRef<number>(0)

  const currentImage = images[currentIndex]

  // Reset scale and position when image changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  // Prevent body scroll when viewer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY !== 0) {
      e.preventDefault()
      const delta = e.deltaY * -0.01
      const newScale = Math.min(Math.max(scale + delta, 1), 5)
      setScale(newScale)
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 })
      }
    }
  }

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      setLastTouchDistance(distance)
      setLastTouchCenter({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      })
    } else if (e.touches.length === 1) {
      // Double tap to zoom
      const now = Date.now()
      const timeSinceLastTap = now - lastTapTime.current
      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        if (scale > 1) {
          setScale(1)
          setPosition({ x: 0, y: 0 })
        } else {
          setScale(2)
        }
        lastTapTime.current = 0
      } else {
        lastTapTime.current = now
        if (scale > 1) {
          setLastTouchCenter({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          })
        }
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.stopPropagation()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      const scaleChange = distance / lastTouchDistance
      setScale((prevScale) => {
        const newScale = Math.min(Math.max(prevScale * scaleChange, 1), 5)
        return newScale
      })
      setLastTouchDistance(distance)
    } else if (e.touches.length === 1 && scale > 1 && lastTouchCenter) {
      e.stopPropagation()
      const touch = e.touches[0]
      setPosition((prev) => ({
        x: prev.x + (touch.clientX - lastTouchCenter!.x) / scale,
        y: prev.y + (touch.clientY - lastTouchCenter!.y) / scale,
      }))
      setLastTouchCenter({
        x: touch.clientX,
        y: touch.clientY,
      })
    }
  }

  const handleTouchEnd = () => {
    setLastTouchDistance(null)
    setLastTouchCenter(null)
  }

  // Handle double click zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (scale > 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setScale(2)
    }
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5))
  }

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1)
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newScale
    })
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[102] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/40"
          style={{
            top: 'max(1rem, calc(env(safe-area-inset-top) + 1rem))',
            right: 'max(1rem, calc(env(safe-area-inset-right) + 1rem))',
          }}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {onPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[102] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 touch-manipulation"
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {onNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[102] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 touch-manipulation"
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </>
        )}

        {/* Image Container - 相对于视口居中 */}
        <div
          ref={containerRef}
          className="absolute flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 5rem))',
            paddingBottom: 'max(10rem, calc(env(safe-area-inset-bottom) + 10rem))',
            paddingLeft: 'max(1rem, calc(env(safe-area-inset-left) + 1rem))',
            paddingRight: 'max(1rem, calc(env(safe-area-inset-right) + 1rem))',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            touchAction: 'none',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            ref={imageRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
            style={{
              width: 'min(85vw, 1200px)',
              height: 'min(70vh, 900px)',
              maxWidth: 'calc(100% - 2rem)',
              maxHeight: 'calc(100% - 2rem)',
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onDoubleClick={handleDoubleClick}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-ghost-bg-card rounded-2xl sm:rounded-3xl overflow-hidden border border-ghost-purple-primary/20 flex items-center justify-center" style={{ width: '100%', height: '100%', padding: '1rem' }}>
              {/* 直接使用 img 标签，因为 OptimizedImage 会尝试添加 .webp 扩展名 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/${currentImage.prefix}`}
                alt={currentImage.alt}
                className="select-none"
                style={{ 
                  objectFit: 'contain',
                  display: 'block',
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  img.style.visibility = 'visible'
                }}
                onError={(e) => {
                  console.error('Image load error:', currentImage.prefix)
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.error-message')) {
                    const errorDiv = document.createElement('div')
                    errorDiv.className = 'error-message absolute inset-0 flex items-center justify-center text-white p-8'
                    errorDiv.textContent = `Image not found: ${currentImage.prefix}`
                    parent.appendChild(errorDiv)
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[102] flex flex-col items-center gap-3">
          {/* Zoom buttons */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              disabled={scale <= 1}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white touch-manipulation transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <span className="text-white/90 text-sm font-medium min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              disabled={scale >= 5}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white touch-manipulation transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {scale > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleReset()
                }}
                className="ml-2 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium touch-manipulation transition-all"
              >
                Reset
              </button>
            )}
          </div>

          {/* Hint text */}
          <div className="bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
            <p className="text-white/90 text-xs sm:text-sm font-medium text-center">
              {scale > 1
                ? 'Double-click or tap Reset to restore'
                : images.length > 1
                ? 'Scroll to zoom · Double-click to enlarge · Swipe to navigate'
                : 'Scroll to zoom · Double-click to enlarge'}
            </p>
          </div>
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-[102]">
            <div className="bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
              <p className="text-white/90 text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

