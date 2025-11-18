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
    scoreLabel: '5 out of 5 stars / This item',
    headline: 'So cute and really well made.',
    body: 'So cute and really well made.',
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
    scoreLabel: '5 out of 5 stars / This item',
    headline: 'Bought this as a gift for my husband who works at Apple.',
    body:
      'Bought this as a gift for my husband who works at Apple. He is a very impressed by the detail put into the design and build. Shipping time was somewhat of a mystery as we are located less than 25 miles from the shipping facility and it took more than a week.',
    response:
      "Listing review by Christine\nHi Christine, thank you so much for sharing this — and please tell your husband I'm really glad the little Mac-style clock won him over. I put a lot of care into the tiny details, so it means a lot hearing that someone from Apple noticed and enjoyed the design. The shipping delay is honestly a bit strange, and I'm sorry it took longer than it should have, especially when you're so close. Sometimes the carrier holds a package at a hub for a few days, but I know that doesn't make it any less confusing. If you ever need a matching piece or want a different retro style for his desk, just let me know. I'd love to help you put together something fun for him.",
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
    scoreLabel: '5 out of 5 stars / This item',
    headline: 'My order shipped out on time and arrived in great condition.',
    body:
      'My order shipped out on time and arrived in great condition. The clocks were a gift and my family loved them. They seem really well made and work great.',
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
          : 'relative overflow-hidden rounded-[32px] border border-black/10 bg-white/80 p-6 sm:p-12 shadow-[0_35px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl'
      }
    >
      {!isDashboard && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white to-[#ecf2ff]"
          >
            <div className="absolute inset-px rounded-[30px] border border-white/30" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#c1d4ff] opacity-50 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#fdecc8] opacity-50 blur-3xl"
          />
        </>
      )}

      <div className="relative z-10 space-y-10">
        <motion.div
          {...getFadeMotion()}
          className={
            isDashboard
              ? 'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'
              : 'flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'
          }
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
              Seller Love
            </p>
            <h2
              className={
                isDashboard
                  ? 'text-2xl font-semibold text-gray-900'
                  : 'text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-gray-900'
              }
            >
              Collectors keep sending 5 star notes
            </h2>
            <p
              className={
                isDashboard
                  ? 'text-sm text-gray-600 mt-2 max-w-2xl'
                  : 'text-base text-gray-600 mt-3 max-w-2xl'
              }
            >
              Real Etsy buyers share how the Hello1984 desk clock feels in their homes. Each review
              highlights the precise build, fast communication, and the responsive follow up from Aleks.
            </p>
          </div>
          <div className={isDashboard ? 'sm:text-right' : 'lg:text-right'}>
            <p className="text-sm font-medium text-gray-600">Average rating</p>
            <div className="flex items-center gap-2 justify-start lg:justify-end">
              <div className="text-3xl font-semibold text-gray-900">5.0</div>
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-4 w-4" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Verified Etsy reviews</p>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              {...getCardMotion(index)}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: isDashboard ? -4 : -8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
              }
              className={
                isDashboard
                  ? 'rounded-2xl border border-black/10 bg-white/90 p-5 shadow-[0_15px_40px_rgba(15,23,42,0.06)] space-y-4'
                  : 'rounded-2xl border border-black/5 bg-white/95 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] space-y-4'
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-gray-500">
                    {review.scoreLabel}
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-2">{review.customer}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex text-amber-500 shrink-0">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <StarIcon key={starIndex} className="h-4 w-4" />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">{review.headline}</p>
                <p className="text-sm text-gray-700 leading-relaxed mt-2">{review.body}</p>
              </div>

              {review.media && review.media.length > 0 && (
                <div className={`grid gap-3 ${review.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {review.media.map((mediaItem) => (
                    <div
                      key={mediaItem.file}
                      className="relative aspect-square overflow-hidden rounded-xl border border-black/5 bg-gray-100"
                    >
                      <Image
                        src={`/${mediaItem.file}`}
                        alt={mediaItem.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-xl border border-black/5 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Response from Aleks
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-line">{review.response}</p>
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
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#e9edf5] via-white to-[#f5f6fa]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_60%)]"
      />
      <div className="relative max-w-6xl mx-auto">{content}</div>
    </section>
  )
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-current" {...props}>
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l1.578 3.794a1 1 0 0 0 .84.61l4.103.288c1.196.084 1.686 1.59.77 2.338l-3.117 2.56a1 1 0 0 0-.329 1.045l.979 3.982c.285 1.162-.964 2.062-1.96 1.45l-3.52-2.16a1 1 0 0 0-1.04 0l-3.52 2.16c-.996.612-2.245-.288-1.96-1.45l.979-3.982a1 1 0 0 0-.329-1.045l-3.117-2.56c-.917-.749-.427-2.254.77-2.338l4.102-.288a1 1 0 0 0 .841-.61z" />
    </svg>
  )
}
