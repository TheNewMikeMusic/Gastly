'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'

export function ProductSpinVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const rafIdRef = useRef<number | null>(null)
  const lastProgressRef = useRef<number>(-1)
  
  // 使用 Intersection Observer 来优化性能
  const isVisible = useIntersectionObserver(containerRef, { 
    threshold: 0,
    rootMargin: '50%' // 提前开始监听
  })

  // 处理视频元数据加载和预加载
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      if (video.duration && video.duration > 0) {
        setVideoDuration(video.duration)
        setIsLoaded(true)
        setHasError(false)
        // 预加载整个视频以确保流畅播放
        if (video.readyState < 4) {
          video.load()
        }
      }
    }

    const handleCanPlayThrough = () => {
      if (video.duration && video.duration > 0) {
        setVideoDuration(video.duration)
        setIsLoaded(true)
        setHasError(false)
      }
    }

    const handleLoadedData = () => {
      if (video.duration && video.duration > 0) {
        setVideoDuration(video.duration)
        setIsLoaded(true)
        setHasError(false)
      }
    }

    const handleError = (e: Event) => {
      setHasError(true)
      setIsLoaded(false)
      console.error('视频加载失败:', e)
    }

    // 如果视频已经加载了元数据，直接设置
    if (video.readyState >= 1 && video.duration > 0) {
      setVideoDuration(video.duration)
      setIsLoaded(true)
    } else {
      // 强制加载视频
      video.load()
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('error', handleError)
    }
  }, [])

  // 计算滚动进度的函数
  const calculateProgress = useCallback(() => {
    if (!containerRef.current) return 0

    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    // 计算滚动进度
    // 滚动范围：从组件下沿进入视口到组件上沿离开视口
    const startOffset = rect.height * 0.3 // 提前30%的高度开始
    const scrollStart = viewportHeight + startOffset
    const scrollEnd = -rect.height
    const scrollRange = scrollStart - scrollEnd
    const currentPosition = scrollStart - rect.top
    const progress = Math.max(0, Math.min(1, currentPosition / scrollRange))

    return progress
  }, [])

  // 滚动驱动的视频播放逻辑 - 苹果官网级别的优化
  useEffect(() => {
    if (prefersReducedMotion || !isLoaded || !videoDuration) return

    // 只在组件可见或接近可见时更新，优化性能
    if (!isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // 如果组件距离视口太远，不更新
      if (rect.bottom < -viewportHeight * 0.5 || rect.top > viewportHeight * 1.5) {
        return
      }
    }

    const updateVideoFrame = () => {
      if (!containerRef.current || !videoRef.current) return

      const progress = calculateProgress()
      const video = videoRef.current
      
      // 只有当进度变化足够大时才更新，避免微小抖动
      // 但阈值要非常小，确保快速滚动时也能流畅
      const progressDiff = Math.abs(progress - lastProgressRef.current)
      if (progressDiff < 0.0001 && progress !== 0 && progress !== 1) {
        rafIdRef.current = null
        return
      }

      lastProgressRef.current = progress

      // 设置视频播放位置 - 苹果官网级别的流畅度
      // 直接设置，不检查时间差，确保每一帧都更新
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA 或更高
        const targetTime = progress * videoDuration
        // 使用 try-catch 避免某些浏览器的时间设置错误
        try {
          video.currentTime = targetTime
        } catch (e) {
          // 忽略时间设置错误，继续执行
        }
      }

      rafIdRef.current = null
    }

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        // 使用 requestAnimationFrame 节流，但确保每次滚动都能更新
        requestAnimationFrame(() => {
          updateVideoFrame()
          ticking = false
        })
        ticking = true
      }
    }

    // 初始更新
    updateVideoFrame()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isLoaded, videoDuration, prefersReducedMotion, isVisible, calculateProgress])

  return (
    <section
      ref={containerRef}
      className="w-full overflow-hidden bg-[#f6f7fb]"
      aria-label="产品旋转展示"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full relative" style={{ aspectRatio: '16/9', willChange: 'contents' }}>
        <video
          ref={videoRef}
          src="/videos/product-spin.mp4"
          className="w-full h-full object-cover"
          style={{ willChange: 'auto' }}
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-label="产品旋转视频"
        />
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-gray-400 text-sm">加载中...</div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-gray-400 text-sm">视频加载失败</div>
          </div>
        )}
        </div>
      </div>
    </section>
  )
}

