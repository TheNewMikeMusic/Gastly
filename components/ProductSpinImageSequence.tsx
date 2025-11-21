'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'

/**
 * 产品旋转图片序列组件
 * 
 * 使用图片序列替代视频，提供更好的性能和流畅度
 * 参考苹果等大公司的实现方式：
 * 1. 使用图片序列而非视频 seek
 * 2. Canvas 渲染优化
 * 3. 智能预加载相邻帧
 * 4. Intersection Observer 只在可见时更新
 * 5. 节流优化减少重绘
 * 
 * 图片命名规范：product-spin-{frameNumber}.webp
 * 例如：product-spin-000.webp, product-spin-001.webp, ..., product-spin-059.webp
 * 
 * @param totalFrames - 总帧数（默认 60 帧，对应 360 度旋转）
 * @param imagePrefix - 图片前缀（默认 'product-spin'）
 * @param imageFormat - 图片格式（默认 'webp'）
 */
export function ProductSpinImageSequence({
  totalFrames = 60,
  imagePrefix = 'product-spin',
  imageFormat = 'webp',
}: {
  totalFrames?: number
  imagePrefix?: string
  imageFormat?: 'webp' | 'avif' | 'jpg' | 'png'
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set())
  const [imageCache, setImageCache] = useState<Map<number, HTMLImageElement>>(new Map())
  const currentFrameRef = useRef<number>(-1)
  const rafIdRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const isInitializingRef = useRef<boolean>(false)
  const lastDrawnFrameRef = useRef<number>(-1)
  
  // 使用 Intersection Observer 只在可见时更新
  const isVisible = useIntersectionObserver(containerRef, { 
    threshold: 0.1,
    rootMargin: '50%' // 提前开始加载
  })

  // 检测设备性能
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  
  useEffect(() => {
    // 检测是否为低端设备
    const checkDevicePerformance = () => {
      if (typeof navigator === 'undefined') return false
      
      // 检测硬件并发数（CPU 核心数）
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      // 检测内存（如果可用）
      const deviceMemory = (navigator as any).deviceMemory || 4
      
      // 低端设备：CPU 核心数 < 4 或内存 < 4GB
      return hardwareConcurrency < 4 || deviceMemory < 4
    }
    
    setIsLowEndDevice(checkDevicePerformance())
  }, [])

  // 加载单帧图片（优化：使用 fetch 优先级和更好的错误处理）
  const loadFrame = useCallback((frameIndex: number): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      // 如果已经加载过，直接返回
      if (imageCache.has(frameIndex)) {
        const cached = imageCache.get(frameIndex)!
        if (cached.complete) {
          resolve(cached)
          return
        }
      }

      const frameNumber = frameIndex.toString().padStart(3, '0')
      const imagePath = `/${imagePrefix}-${frameNumber}.${imageFormat}`
      const img = new Image()
      
      // 设置图片加载属性，避免 Edge 浏览器懒加载警告
      // 使用 fetchpriority 和 decoding 属性优化加载
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = frameIndex < 5 ? 'high' : 'auto'
      }
      if ('decoding' in img) {
        (img as any).decoding = 'async'
      }
      
      let resolved = false
      
      // 设置 onload 处理器（备用，如果 decode 失败会使用）
      img.onload = () => {
        if (!resolved) {
          resolved = true
          setImageCache(prev => new Map(prev).set(frameIndex, img))
          setLoadedFrames(prev => new Set(prev).add(frameIndex))
          resolve(img)
        }
      }
      
      // 设置解码优先级（如果支持）
      if ('decode' in img) {
        img.src = imagePath
        img.decode().then(() => {
          if (!resolved && img.complete) {
            resolved = true
            setImageCache(prev => new Map(prev).set(frameIndex, img))
            setLoadedFrames(prev => new Set(prev).add(frameIndex))
            resolve(img)
          }
        }).catch(() => {
          // decode 失败，等待 onload 触发
          // 如果图片已经加载完成，直接 resolve
          if (!resolved && img.complete) {
            resolved = true
            setImageCache(prev => new Map(prev).set(frameIndex, img))
            setLoadedFrames(prev => new Set(prev).add(frameIndex))
            resolve(img)
          }
        })
      } else {
        // 不支持 decode，直接设置 src，使用 onload
        img.src = imagePath
      }
      
      img.onerror = (error) => {
        // 如果加载失败，尝试其他格式
        const fallbackFormats: Array<'webp' | 'avif' | 'jpg' | 'png'> = ['jpg', 'png']
        let fallbackIndex = 0
        
        const tryFallback = () => {
          if (fallbackIndex >= fallbackFormats.length) {
            // 只在第一帧加载失败时显示错误（避免控制台刷屏）
            if (frameIndex === 0) {
              console.error(`无法加载帧 ${frameIndex}，路径: ${imagePath}`)
              console.error('请确保图片文件存在于 public/ 目录下')
            }
            resolve(null)
            return
          }
          
          const fallbackFormat = fallbackFormats[fallbackIndex]
          const fallbackPath = `/${imagePrefix}-${frameNumber}.${fallbackFormat}`
          const fallbackImg = new Image()
          
          // 设置图片加载属性
          if ('fetchPriority' in fallbackImg) {
            (fallbackImg as any).fetchPriority = 'auto'
          }
          if ('decoding' in fallbackImg) {
            (fallbackImg as any).decoding = 'async'
          }
          
          fallbackImg.onload = () => {
            setImageCache(prev => new Map(prev).set(frameIndex, fallbackImg))
            setLoadedFrames(prev => new Set(prev).add(frameIndex))
            resolve(fallbackImg)
          }
          
          fallbackImg.onerror = () => {
            fallbackIndex++
            tryFallback()
          }
          
          fallbackImg.src = fallbackPath
        }
        
        tryFallback()
      }
      
      // 如果之前没有设置 src（不支持 decode 的情况），现在设置
      if (!img.src) {
        img.src = imagePath
      }
    })
  }, [imagePrefix, imageFormat, imageCache])

  // 预加载关键帧和相邻帧（优化：不阻塞，异步加载）
  const preloadFrames = useCallback((targetFrame: number) => {
    const preloadRange = isLowEndDevice ? 2 : 3 // 低端设备预加载更少的帧
    const framesToLoad: number[] = []
    
    // 加载目标帧
    if (!imageCache.has(targetFrame)) {
      framesToLoad.push(targetFrame)
    }
    
    // 加载前后各几帧
    for (let i = 1; i <= preloadRange; i++) {
      const prevFrame = (targetFrame - i + totalFrames) % totalFrames
      const nextFrame = (targetFrame + i) % totalFrames
      if (!imageCache.has(prevFrame)) {
        framesToLoad.push(prevFrame)
      }
      if (!imageCache.has(nextFrame)) {
        framesToLoad.push(nextFrame)
      }
    }
    
    // 异步加载，不阻塞主线程
    if (framesToLoad.length > 0) {
      // 使用 requestIdleCallback 或 setTimeout 延迟加载
      const scheduleLoad = () => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            framesToLoad.forEach(frame => loadFrame(frame).catch(() => {}))
          }, { timeout: 500 })
        } else {
          setTimeout(() => {
            framesToLoad.forEach(frame => loadFrame(frame).catch(() => {}))
          }, 0)
        }
      }
      scheduleLoad()
    }
  }, [loadFrame, totalFrames, isLowEndDevice, imageCache])

  // 在 Canvas 上绘制帧（优化：避免闪烁）
  const drawFrame = useCallback((frameIndex: number, force = false) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // 如果帧没有变化且不是强制绘制，跳过
    if (!force && frameIndex === lastDrawnFrameRef.current) {
      return
    }
    
    const img = imageCache.get(frameIndex)
    if (!img || !img.complete) {
      // 如果图片还没加载完成，尝试加载并等待
      loadFrame(frameIndex).then(() => {
        // 图片加载完成后再次尝试绘制
        if (imageCache.get(frameIndex)?.complete) {
          drawFrame(frameIndex, true)
        }
      })
      return
    }
    
    const ctx = canvas.getContext('2d', { 
      alpha: false, // 禁用 alpha 通道提升性能
      desynchronized: true, // 允许异步渲染
      willReadFrequently: false // 不需要频繁读取像素
    })
    
    if (!ctx) return
    
    // 使用 requestAnimationFrame 确保在下一帧绘制
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      try {
        // 只在帧真正变化时才清除和重绘，避免闪烁
        if (lastDrawnFrameRef.current !== frameIndex || force) {
          // 使用双缓冲技术：先绘制到离屏画布，再一次性显示
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // 绘制图片（使用高质量渲染）
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          currentFrameRef.current = frameIndex
          lastDrawnFrameRef.current = frameIndex
        }
      } catch (e) {
        console.warn('绘制帧失败:', e)
      }
    })
  }, [imageCache, loadFrame])

  // 初始化：立即显示第一帧，后台分批加载其他帧
  useEffect(() => {
    if (prefersReducedMotion || !isVisible || isInitializingRef.current) return
    
    const init = async () => {
      isInitializingRef.current = true
      
      try {
        // 第一步：立即加载并显示第一帧（不等待其他帧）
        const firstFrame = await loadFrame(0)
        if (firstFrame && firstFrame.complete && firstFrame.width > 0 && firstFrame.height > 0) {
          setIsLoaded(true)
          setHasError(false)
          
          // 设置 canvas 尺寸并立即绘制
          const canvas = canvasRef.current
          if (canvas) {
            // 确保 canvas 有正确的尺寸
            const container = containerRef.current
            if (container) {
              const rect = container.getBoundingClientRect()
              const containerWidth = rect.width || container.clientWidth || 1920
              const containerHeight = containerWidth * (9 / 16) // 16:9 比例
              
              // 设置 canvas 尺寸（使用容器尺寸或图片尺寸，取较大者）
              canvas.width = Math.max(containerWidth, firstFrame.width)
              canvas.height = Math.max(containerHeight, firstFrame.height)
            } else {
              canvas.width = firstFrame.width
              canvas.height = firstFrame.height
            }
            
            // 立即绘制第一帧
            drawFrame(0, true)
          } else {
            console.warn('Canvas 元素未找到')
            setHasError(true)
            isInitializingRef.current = false
            return
          }
        } else {
          console.warn('第一帧加载失败或尺寸无效', { firstFrame })
          setHasError(true)
          isInitializingRef.current = false
          return
        }
        
        // 第二步：使用 requestIdleCallback 或 setTimeout 在后台分批加载其他帧
        // 不阻塞主线程，避免卡顿
        const loadInBackground = () => {
          // 使用 requestIdleCallback（如果支持）或 setTimeout
          const scheduleLoad = (callback: () => void) => {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(callback, { timeout: 1000 })
            } else {
              setTimeout(callback, 0)
            }
          }
          
          // 分批加载：每次加载 3-5 帧，避免一次性加载太多
          const batchSize = 5
          let currentBatch = 1
          const totalBatches = Math.ceil(totalFrames / batchSize)
          
          const loadBatch = () => {
            const startFrame = (currentBatch - 1) * batchSize
            const endFrame = Math.min(currentBatch * batchSize, totalFrames)
            
            // 优先加载前几帧（用户最可能看到的）
            const framesToLoad: number[] = []
            for (let i = startFrame; i < endFrame; i++) {
              if (i !== 0) { // 第一帧已经加载了
                framesToLoad.push(i)
              }
            }
            
            // 异步加载，不阻塞
            Promise.all(framesToLoad.map(frame => loadFrame(frame))).catch(() => {
              // 忽略加载错误，继续加载其他帧
            })
            
            currentBatch++
            if (currentBatch <= totalBatches) {
              // 延迟下一批，给浏览器喘息的机会
              scheduleLoad(loadBatch)
            }
          }
          
          // 延迟开始，确保第一帧已经显示
          scheduleLoad(() => {
            // 先加载前几帧（用户最可能看到的）
            const priorityFrames = [1, 2, 3, 4, 5, totalFrames - 1, totalFrames - 2]
            Promise.all(priorityFrames.map(frame => loadFrame(frame))).catch(() => {})
            
            // 然后开始分批加载
            setTimeout(loadBatch, 50)
          })
        }
        
        loadInBackground()
      } catch (e) {
        console.error('初始化失败:', e)
        setHasError(true)
      } finally {
        // 不立即重置，让后台加载继续
        setTimeout(() => {
          isInitializingRef.current = false
        }, 100)
      }
    }
    
    init()
  }, [prefersReducedMotion, isVisible, loadFrame, drawFrame, totalFrames])

  // 滚动驱动的帧更新
  useEffect(() => {
    if (prefersReducedMotion || !isLoaded || !isVisible || hasError) return

    const updateFrame = () => {
      const now = performance.now()
      // 节流：低端设备使用更长的间隔
      const throttleMs = isLowEndDevice ? 16 : 8 // 60fps 或 120fps
      
      if (now - lastUpdateTimeRef.current < throttleMs) {
        return
      }
      
      lastUpdateTimeRef.current = now
      
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
        const targetFrame = Math.floor(progress * (totalFrames - 1))
        
        // 只在帧变化时更新
        if (targetFrame !== currentFrameRef.current) {
          // 确保目标帧已加载
          const targetImg = imageCache.get(targetFrame)
          if (targetImg && targetImg.complete) {
            // 预加载相邻帧（异步，不阻塞，不返回 Promise）
            preloadFrames(targetFrame)
            // 绘制当前帧
            drawFrame(targetFrame)
          } else {
            // 如果目标帧还没加载，先加载再绘制
            loadFrame(targetFrame).then(() => {
              const loadedImg = imageCache.get(targetFrame)
              if (loadedImg && loadedImg.complete) {
                drawFrame(targetFrame)
              }
            }).catch(() => {
              // 忽略加载错误
            })
          }
        }
      } catch (e) {
        console.warn('更新帧失败:', e)
      }
    }

    let ticking = false
    let scrollRafId: number | null = null

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        scrollRafId = requestAnimationFrame(() => {
          updateFrame()
          ticking = false
          scrollRafId = null
        })
      }
    }

    // 初始更新
    updateFrame()

    // 添加事件监听（使用 passive 提升性能）
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
      if (scrollRafId !== null) {
        cancelAnimationFrame(scrollRafId)
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isLoaded, isVisible, prefersReducedMotion, hasError, totalFrames, drawFrame, preloadFrames, isLowEndDevice])

  return (
    <section
      ref={containerRef}
      className="w-full overflow-hidden bg-[#f6f7fb]"
      aria-label="产品旋转展示"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full relative" style={{ aspectRatio: '16/9' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            style={{
              imageRendering: 'high-quality', // 高质量渲染
              display: isLoaded ? 'block' : 'none', // 只在加载完成后显示
            }}
            aria-label="产品旋转动画"
          />
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f6f7fb]">
              <div className="text-gray-400 text-sm">加载中...</div>
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f6f7fb]">
              <div className="text-gray-400 text-sm text-center px-4">
                图片序列加载失败
                <br />
                <span className="text-xs">请确保图片文件存在：/{imagePrefix}-000.{imageFormat}</span>
                <br />
                <span className="text-xs mt-2 block">检查浏览器控制台查看详细错误</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

