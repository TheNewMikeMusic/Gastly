'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks'

// 图片序列总数
const TOTAL_FRAMES = 60

// 生成图片路径
const getImagePath = (frameIndex: number): string => {
  const paddedIndex = String(frameIndex).padStart(3, '0')
  return `/product-spin-${paddedIndex}.webp`
}

// 检测iOS平台
const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function ProductSpinVideo() {
  // 双缓冲：两个img元素的ref
  const imageRef1 = useRef<HTMLImageElement>(null)
  const imageRef2 = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 状态管理（仅用于初始加载）
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  
  // 使用ref存储，避免React重新渲染导致的延迟
  const activeImageRef = useRef<number>(0)
  const lastFrameRef = useRef<number>(0)
  const prefersReducedMotion = useReducedMotion()
  
  // 预加载的图片缓存（使用Map存储Image对象，确保已加载和解码）
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map())
  const decodedFramesRef = useRef<Set<number>>(new Set()) // 跟踪已解码的帧
  const isIOSRef = useRef<boolean>(false)

  // 全量预加载：预加载所有60帧图片到缓存，iOS上跳过预解码
  useEffect(() => {
    isIOSRef.current = isIOS()
    
    const preloadAllImages = async () => {
      const imagesToLoad: Promise<void>[] = []
      let loadedCount = 0

      // 预加载所有60帧到缓存
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image()
        const promise = new Promise<void>(async (resolve) => {
          img.onload = async () => {
            // 图片加载完成后存入缓存
            imageCacheRef.current.set(i, img)
            
            // iOS上跳过预解码（性能问题），其他平台预解码
            if (!isIOSRef.current) {
              try {
                if (img.decode) {
                  await img.decode()
                  decodedFramesRef.current.add(i)
                } else {
                  decodedFramesRef.current.add(i)
                }
              } catch (e) {
                decodedFramesRef.current.add(i)
              }
            } else {
              // iOS上直接标记为已解码（使用图片本身）
              decodedFramesRef.current.add(i)
            }
            
            loadedCount++
            setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100))
            
            // 第一帧加载完成后立即显示
            if (i === 0 && imageRef1.current) {
              imageRef1.current.src = img.src
              setIsLoaded(true)
              setHasError(false)
            }
            resolve()
          }
          img.onerror = () => {
            loadedCount++
            setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100))
            resolve() // 即使失败也继续
          }
        })
        img.src = getImagePath(i)
        imagesToLoad.push(promise)
      }

      await Promise.all(imagesToLoad)
      setIsLoaded(true)
      setLoadProgress(100)
    }

    // 确保在客户端执行
    if (typeof window !== 'undefined') {
      preloadAllImages()
    }
  }, [])

  // 滚动驱动的图片帧更新 - iOS优化版本
  useEffect(() => {
    if (prefersReducedMotion || !isLoaded) return

    const updateImageFrame = () => {
      try {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // 如果组件距离视口太远，不更新
        if (rect.bottom < -viewportHeight * 0.5 || rect.top > viewportHeight * 1.5) {
          return
        }

        // 计算滚动进度
        const startOffset = rect.height * 0.3
        const scrollStart = viewportHeight + startOffset
        const scrollEnd = -rect.height
        const scrollRange = scrollStart - scrollEnd
        const currentPosition = scrollStart - rect.top
        const progress = Math.max(0, Math.min(1, currentPosition / scrollRange))

        // 根据进度计算帧索引
        const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1))
        const clampedFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex))

        // 只有当帧变化时才更新
        if (clampedFrame !== lastFrameRef.current) {
          lastFrameRef.current = clampedFrame
          
          // 获取缓存的图片
          const cachedImg = imageCacheRef.current.get(clampedFrame)
          
          if (cachedImg && imageRef1.current && imageRef2.current) {
            // 双缓冲切换：获取当前激活的图片和下一个图片
            const currentActive = activeImageRef.current
            const nextActive = currentActive === 0 ? 1 : 0
            
            const currentImg = currentActive === 0 ? imageRef1.current : imageRef2.current
            const nextImg = nextActive === 0 ? imageRef1.current : imageRef2.current
            
            // iOS上简化逻辑：直接切换，不检查解码状态
            if (isIOSRef.current) {
              // iOS：直接切换，图片已在缓存中
              nextImg.src = cachedImg.src
              
              // 同步切换显示
              if (nextImg.complete && nextImg.naturalWidth > 0) {
                currentImg.style.opacity = '0'
                nextImg.style.opacity = '1'
                activeImageRef.current = nextActive
              } else {
                // 等待图片加载完成
                const onLoad = () => {
                  currentImg.style.opacity = '0'
                  nextImg.style.opacity = '1'
                  activeImageRef.current = nextActive
                  nextImg.removeEventListener('load', onLoad)
                }
                nextImg.addEventListener('load', onLoad)
              }
            } else {
              // 非iOS：检查解码状态
              const isDecoded = decodedFramesRef.current.has(clampedFrame)
              
              if (isDecoded) {
                // 图片已解码，直接切换
                nextImg.src = cachedImg.src
                
                // 同步切换显示（无延迟）
                if (nextImg.complete && nextImg.naturalWidth > 0) {
                  currentImg.style.opacity = '0'
                  nextImg.style.opacity = '1'
                  activeImageRef.current = nextActive
                } else {
                  // 如果图片还没准备好，等待加载完成
                  const onLoad = () => {
                    currentImg.style.opacity = '0'
                    nextImg.style.opacity = '1'
                    activeImageRef.current = nextActive
                    nextImg.removeEventListener('load', onLoad)
                  }
                  nextImg.addEventListener('load', onLoad)
                }
              } else {
                // 图片未解码，先解码再切换（非iOS）
                const decodeAndSwitch = async () => {
                  try {
                    if (cachedImg.decode) {
                      await cachedImg.decode()
                    }
                    decodedFramesRef.current.add(clampedFrame)
                    nextImg.src = cachedImg.src
                    
                    if (nextImg.complete && nextImg.naturalWidth > 0) {
                      currentImg.style.opacity = '0'
                      nextImg.style.opacity = '1'
                      activeImageRef.current = nextActive
                    } else {
                      const onLoad = () => {
                        currentImg.style.opacity = '0'
                        nextImg.style.opacity = '1'
                        activeImageRef.current = nextActive
                        nextImg.removeEventListener('load', onLoad)
                      }
                      nextImg.addEventListener('load', onLoad)
                    }
                  } catch (e) {
                    // 解码失败，直接切换（降级处理）
                    decodedFramesRef.current.add(clampedFrame)
                    nextImg.src = cachedImg.src
                    currentImg.style.opacity = '0'
                    nextImg.style.opacity = '1'
                    activeImageRef.current = nextActive
                  }
                }
                decodeAndSwitch()
              }
            }
          }
        }
      } catch (e) {
        // 静默处理错误
        if (process.env.NODE_ENV === 'development') {
          console.warn('updateImageFrame error:', e)
        }
      }
    }

    // 持续RAF循环，确保每次滚动都更新（移除节流）
    let rafId: number | null = null
    let isRunning = false

    const handleScroll = () => {
      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(() => {
          updateImageFrame()
          isRunning = false
          rafId = null
        })
      }
    }

    // 初始更新
    updateImageFrame()

    // 使用passive监听器提升性能
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isLoaded, prefersReducedMotion]) // 移除loadedFrames依赖

  // 图片加载错误处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget
    // 如果加载失败，尝试加载第一帧
    const firstFrame = imageCacheRef.current.get(0)
    if (firstFrame) {
      img.src = firstFrame.src
    } else {
      setHasError(true)
      setIsLoaded(false)
    }
  }

  // 图片加载成功处理
  const handleImageLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  return (
    <section
      ref={containerRef}
      className="w-full overflow-hidden bg-[#f6f7fb]"
      aria-label="产品旋转展示"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full relative" style={{ aspectRatio: '16/9' }}>
          {/* 双缓冲：两个img元素叠加，无CSS transition */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef1}
            src={getImagePath(0)}
            alt="产品旋转展示"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: activeImageRef.current === 0 ? 1 : 0,
              willChange: 'opacity',
              imageRendering: 'crisp-edges',
              transition: 'none', // 移除过渡，直接切换
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager"
            decoding="async"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef2}
            src={getImagePath(0)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: activeImageRef.current === 1 ? 1 : 0,
              willChange: 'opacity',
              imageRendering: 'crisp-edges',
              transition: 'none', // 移除过渡，直接切换
            }}
            onError={handleImageError}
            loading="eager"
            decoding="async"
            aria-hidden="true"
          />
          
          {/* 加载进度指示 */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
              <div className="text-gray-400 text-sm mb-2">加载中... {loadProgress}%</div>
              <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 transition-all duration-300 ease-out"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* 错误提示 */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-gray-400 text-sm">图片加载失败</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
