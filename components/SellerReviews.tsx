'use client'

import Image from 'next/image'
import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

type SellerReviewsProps = {
  variant?: 'marketing' | 'dashboard'
}

type Review = {
  id: string
  customer: string
  date: string
  rating: number
  scoreLabel: string
  headline: string
  body: string
  response: string
  media?: Array<{
    file: string
    alt: string
  }>
}

const reviews: Review[] = [
  {
    id: 'jane-george',
    customer: 'Jane George',
    date: 'Nov 2, 2025',
    rating: 5,
    scoreLabel: 'Verified Purchase',
    headline: 'So cute and really well made.',
    body: 'So cute and really well made. The attention to detail is incredible—every pixel feels intentional. It sits perfectly on my desk and brings a smile every time I see that little Mac smile boot up.',
    response:
      "Hi Jane, thank you so much for your sweet note. It makes me really happy to hear you think the little Mac-style clock is cute and well made. I keep the design simple and clean so it feels warm on a desk, and I love knowing it fits your vibe. If you ever want a different face style or a tiny matching piece for your setup, just tell me — I'm always here and happy to help you find something fun.",
    media: [
      {
        file: 'iap_300x300.7307396637_refzr49b.webp',
        alt: 'Jane shows the Mac-style clock on a tidy desk.',
      },
    ],
  },
  {
    id: 'christine',
    customer: 'Christine',
    date: 'Nov 1, 2025',
    rating: 5,
    scoreLabel: 'Verified Purchase',
    headline: 'Bought this as a gift for my husband who works at Apple.',
    body:
      'Bought this as a gift for my husband who works at Apple. He was very impressed by the detail put into the design and build quality. The retro aesthetic is spot-on, and the USB-C power is a nice modern touch. Shipping time was somewhat of a mystery as we are located less than 25 miles from the shipping facility and it took more than a week, but the product itself is perfect.',
    response:
      "Hi Christine, thank you so much for sharing this — and please tell your husband I'm really glad the little Mac-style clock won him over. I put a lot of care into the tiny details, so it means a lot hearing that someone from Apple noticed and enjoyed the design. The shipping delay is honestly a bit strange, and I'm sorry it took longer than it should have, especially when you're so close. Sometimes the carrier holds a package at a hub for a few days, but I know that doesn't make it any less confusing. If you ever need a matching piece or want a different retro style for his desk, just let me know. I'd love to help you put together something fun for him.",
    media: [
      {
        file: 'iap_300x300.7241535096_dvmyoc4g.webp',
        alt: 'Christine shared a detail shot of the clock gift.',
      },
    ],
  },
  {
    id: 'andrea-carstarphen',
    customer: 'Andrea Carstarphen',
    date: 'Oct 5, 2025',
    rating: 5,
    scoreLabel: 'Verified Purchase',
    headline: 'My order shipped out on time and arrived in great condition.',
    body:
      'My order shipped out on time and arrived in great condition. The clocks were a gift and my family loved them. They seem really well made and work great. The boot animation is delightful—exactly like the original Macintosh. Highly recommend!',
    response:
      "Hi Andrea! Thank you so much for sharing your lovely feedback — and that photo made my day! I&apos;m really happy to hear your family loved the clocks and that everything arrived safely. I had a lot of fun designing this retro piece; it&apos;s such a nostalgic nod to old-school tech. Hope it brings lots of smiles whenever it boots up with that floppy grin!",
    media: [
      {
        file: 'iap_1000x1000.7133129332_7ugtj81k.webp',
        alt: 'Andrea captured the retro clock glowing on a walnut shelf.',
      },
      {
        file: 'iap_1000x1000.7228009722_h2ekbf1s.webp',
        alt: 'Andrea styled the clock next to matching accessories.',
      },
    ],
  },
]

export function SellerReviews({ variant = 'marketing' }: SellerReviewsProps) {
  const isDashboard = variant === 'dashboard'
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 })

  // 简化动画逻辑：始终显示内容，只在可见时触发动画
  const getFadeMotion = (delay = 0) => {
    if (prefersReducedMotion) return {}
    return {
      initial: { opacity: 0, y: 20 },
      animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }, // 始终显示，不依赖可见性
      transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
    }
  }

  const getCardMotion = (index: number) => {
    if (prefersReducedMotion) return {}
    const baseDelay = isDashboard ? 0 : 0.1
    return {
      initial: { opacity: 0, y: 20 },
      animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }, // 始终显示
      transition: { duration: 0.5, delay: baseDelay + index * 0.1, ease: [0.16, 1, 0.3, 1] },
    }
  }

  const content = (
    <div
      ref={containerRef}
      className={
        isDashboard
          ? 'glass rounded-2xl p-6 sm:p-8'
          : 'relative rounded-[2rem] sm:rounded-[2.5rem] border border-black/[0.06] bg-white p-6 sm:p-8 lg:p-10 xl:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full'
      }
    >
      {!isDashboard && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white rounded-2xl sm:rounded-3xl z-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-blue-100/10 opacity-20 blur-3xl z-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-amber-100/10 opacity-20 blur-3xl z-0"
          />
        </>
      )}

      <div className="relative z-10 space-y-6 sm:space-y-8 lg:space-y-10 w-full">
        <motion.div
          {...getFadeMotion()}
          className={
            isDashboard
              ? 'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'
              : 'flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between'
          }
        >
          <div>
            <p className="text-apple-footnote font-apple-semibold uppercase tracking-[0.35em] text-gray-500 mb-3">
              Customer Reviews
            </p>
            <h2
              className={
                isDashboard
                  ? 'text-apple-headline-sm font-apple-semibold text-gray-900'
                  : 'text-apple-display font-apple-semibold text-[#1d1d1f]'
              }
            >
              Loved by collectors worldwide
            </h2>
            <p
              className={
                isDashboard
                  ? 'text-apple-caption font-apple-normal text-gray-600 mt-3 max-w-2xl'
                  : 'text-apple-subtitle font-apple-normal text-[#424245] mt-4 sm:mt-6 max-w-3xl'
              }
            >
              Real customers share how Hello1984 fits into their daily lives. Each review highlights 
              the thoughtful design, quality craftsmanship, and the personal attention we give every order.
            </p>
          </div>
          <div className={`${isDashboard ? 'sm:text-right' : 'lg:text-right'} mt-6 lg:mt-0`}>
            <div className="inline-flex flex-col items-start lg:items-end gap-2">
              <p className="text-apple-footnote font-apple-medium text-gray-500 uppercase tracking-wider">Average Rating</p>
              <div className="flex items-baseline gap-3">
                <div className="text-apple-headline font-apple-semibold text-gray-900">5.0</div>
                <div className="flex text-amber-500 gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="h-5 w-5 sm:h-6 sm:w-6" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on verified purchases</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3 w-full">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              {...getCardMotion(index)}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: isDashboard ? -4 : -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
              }
              className={
                isDashboard
                  ? 'glass-card rounded-apple p-5 sm:p-6 space-y-5'
                  : 'group relative bg-white rounded-apple sm:rounded-apple-lg p-6 sm:p-8 shadow-medium hover:shadow-deep transition-all duration-500 ease-apple-smooth border border-black/[0.06] overflow-hidden space-y-5 flex flex-col'
              }
            >
              {/* Decorative gradient overlay */}
              {!isDashboard && (
                <div 
                  className="absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
                  }}
                />
              )}
              {/* Header with avatar and rating */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                    {review.customer.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-apple-body font-apple-semibold text-gray-900 truncate">{review.customer}</p>
                      <p className="text-apple-footnote font-apple-normal text-gray-500 mt-0.5">{review.date}</p>
                    </div>
                    <div className="flex text-amber-500 shrink-0 gap-0.5">
                      {Array.from({ length: review.rating }).map((_, starIndex) => (
                        <StarIcon key={starIndex} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                      {review.scoreLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review content */}
              <div className="flex-shrink-0">
                <h3 className="text-apple-title-sm font-apple-semibold text-gray-900 mb-2">{review.headline}</h3>
                <p className="text-apple-caption font-apple-normal text-gray-600">{review.body}</p>
              </div>

              {/* Media gallery */}
              {review.media && review.media.length > 0 && (
                <div className={`grid gap-3 flex-shrink-0 ${review.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {review.media.map((mediaItem) => (
                    <ReviewImage
                      key={mediaItem.file}
                      file={mediaItem.file}
                      alt={mediaItem.alt}
                    />
                  ))}
                </div>
              )}

              {/* Seller response */}
              <div className="rounded-xl border border-gray-200/50 bg-gray-50/80 p-4 sm:p-5 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">A</span>
                  </div>
                  <p className="text-apple-footnote font-apple-semibold uppercase tracking-wider text-gray-600">
                    Response from Hello1984
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{review.response}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )

  if (isDashboard) {
    return content
  }

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 w-full relative overflow-hidden">
      <SectionBackground variant="subtle" />
      <div className="max-w-7xl mx-auto w-full relative z-10">{content}</div>
    </section>
  )
}

function ReviewImage({ file, alt }: { file: string; alt: string }) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(`/${file}`)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  
  // 检测是否为PC视图（非移动端）
  const [isPC, setIsPC] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPC(window.innerWidth >= 768) // md断点以上为PC
      
      const handleResize = () => {
        setIsPC(window.innerWidth >= 768)
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleError = () => {
    // 尝试不同的路径格式
    const alternatives = [
      `/${file}`,
      `/${file.replace('.webp', '.avif')}`, // 尝试avif格式
      `/${file.replace('.webp', '.jpg')}`, // 尝试jpg格式
    ]
    
    if (retryCount < alternatives.length - 1) {
      const nextIndex = retryCount + 1
      setImageSrc(alternatives[nextIndex])
      setRetryCount(nextIndex)
      setIsLoading(true) // 重试时重置加载状态
    } else {
      setImageError(true)
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // 骨架屏组件
  const SkeletonPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  )

  if (imageError) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200/50 bg-gray-100 flex items-center justify-center min-h-[200px]">
        <span className="text-xs text-gray-400 text-center px-2">图片加载失败</span>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-gray-200/50 bg-gray-50 group cursor-pointer">
      {/* 骨架屏占位符 */}
      {isLoading && <SkeletonPlaceholder />}
      
      {/* 使用普通img标签以支持动态src切换 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading={isPC ? 'eager' : 'lazy'}
        fetchPriority={isPC ? 'high' : 'auto'}
        decoding={isPC ? 'sync' : 'async'}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
    </div>
  )
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      aria-hidden="true" 
      className="fill-current drop-shadow-sm" 
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
