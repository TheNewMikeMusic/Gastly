'use client'

import Image from 'next/image'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

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
      "Hi Andrea! Thank you so much for sharing your lovely feedback — and that photo made my day! I'm really happy to hear your family loved the clocks and that everything arrived safely. I had a lot of fun designing this retro piece; it's such a nostalgic nod to old-school tech. Hope it brings lots of smiles whenever it boots up with that floppy grin!",
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
  const hasAnimatedRef = useRef(false)
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.25 })

  if (isVisible && !hasAnimatedRef.current) {
    hasAnimatedRef.current = true
  }

  const shouldShow = prefersReducedMotion || hasAnimatedRef.current || isVisible

  const getFadeMotion = (delay = 0) => {
    if (prefersReducedMotion) return {}
    return {
      initial: { opacity: 0, y: 24 },
      animate: shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
    }
  }

  const getCardMotion = (index: number) => {
    if (prefersReducedMotion) return {}
    const baseDelay = isDashboard ? 0 : 0.2
    return {
      initial: { opacity: 0, y: 32 },
      animate: shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
      transition: { duration: 0.6, delay: baseDelay + index * 0.12, ease: [0.16, 1, 0.3, 1] },
    }
  }

  const content = (
    <div
      ref={containerRef}
      className={
        isDashboard
          ? 'glass rounded-2xl p-6 sm:p-8'
          : 'relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/90 p-8 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl'
      }
    >
      {!isDashboard && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/95 to-gray-50/50"
          >
            <div className="absolute inset-px rounded-[30px] border border-white/40" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-blue-100/30 opacity-40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-amber-100/30 opacity-40 blur-3xl"
          />
        </>
      )}

      <div className="relative z-10 space-y-8 sm:space-y-10">
        <motion.div
          {...getFadeMotion()}
          className={
            isDashboard
              ? 'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'
              : 'flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between'
          }
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500 mb-3">
              Customer Reviews
            </p>
            <h2
              className={
                isDashboard
                  ? 'text-2xl font-semibold text-gray-900 tracking-[-0.022em]'
                  : 'text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.022em] text-gray-900 leading-[1.08]'
              }
            >
              Loved by collectors worldwide
            </h2>
            <p
              className={
                isDashboard
                  ? 'text-sm text-gray-600 mt-3 max-w-2xl leading-relaxed'
                  : 'text-base sm:text-lg text-gray-600 mt-4 max-w-2xl leading-relaxed'
              }
            >
              Real customers share how Hello1984 fits into their daily lives. Each review highlights 
              the thoughtful design, quality craftsmanship, and the personal attention we give every order.
            </p>
          </div>
          <div className={`${isDashboard ? 'sm:text-right' : 'lg:text-right'} mt-6 lg:mt-0`}>
            <div className="inline-flex flex-col items-start lg:items-end gap-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</p>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight">5.0</div>
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

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
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
                  ? 'glass-card rounded-2xl p-5 sm:p-6 space-y-5'
                  : 'glass-card rounded-2xl p-6 sm:p-7 space-y-5 h-full flex flex-col'
              }
            >
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
                      <p className="text-base font-semibold text-gray-900 truncate">{review.customer}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{review.date}</p>
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
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">{review.headline}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
              </div>

              {/* Media gallery */}
              {review.media && review.media.length > 0 && (
                <div className={`grid gap-3 ${review.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {review.media.map((mediaItem) => (
                    <div
                      key={mediaItem.file}
                      className="relative aspect-square overflow-hidden rounded-xl border border-gray-200/50 bg-gray-50 group cursor-pointer"
                    >
                      <Image
                        src={`/${mediaItem.file}`}
                        alt={mediaItem.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              )}

              {/* Seller response */}
              <div className="rounded-xl border border-gray-200/50 bg-gray-50/80 p-4 sm:p-5 mt-auto">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">A</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
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
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">{content}</div>
    </section>
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
