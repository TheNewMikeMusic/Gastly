'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const trustItems = [
  {
    icon: 'price',
    title: 'Limited Time Offer',
    description: 'One-time payment, no subscription fees. Taxes calculated at checkout.',
  },
  {
    icon: 'truck',
    title: 'Global Delivery',
    description: 'Tracked shipping to 40+ countries with carbon-neutral carriers.',
  },
  {
    icon: 'shield',
    title: '12-Month Warranty',
    description: 'Hardware repairs and replacements handled by our in-house team.',
  },
]

const iconMap: Record<string, JSX.Element> = {
  price: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"
        fill="currentColor"
      />
    </svg>
  ),
  truck: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 3h15v13H1zM16 8h4l3 4v3h-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="5" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  return: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7v6h6M21 17v-6h-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 13l4-4 4 4M21 11l-4 4-4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export function TrustStrip() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <motion.section
      ref={sectionRef as React.RefObject<HTMLElement>}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion || isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16">
        {trustItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-center flex-1 max-w-[280px] sm:max-w-none"
          >
            {/* Icon */}
            <div className="mb-4 flex items-center justify-center">
              <div className="text-ghost-purple-primary">
                {iconMap[item.icon]}
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-apple-title font-display mb-2 text-ghost-text-primary">
              {item.title}
            </h3>
            
            {/* Description */}
            <p className="text-apple-body font-body text-ghost-text-secondary">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
