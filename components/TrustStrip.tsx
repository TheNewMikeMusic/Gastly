'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const trustItems = [
  {
    icon: 'price',
    title: 'From $299',
    description: 'One-time payment. Taxes calculated at checkout—no subscriptions, ever.',
  },
  {
    icon: 'truck',
    title: 'Global delivery',
    description: 'Tracked shipping to 40+ countries with carbon-neutral carriers.',
  },
  {
    icon: 'shield',
    title: '12-month warranty',
    description: 'Hardware repairs and replacements handled by our in-house team.',
  },
  {
    icon: 'return',
    title: '30-day returns',
    description: "Try Hello1984 at home. If it's not love, send it back for a full refund.",
  },
]

const iconMap: Record<string, JSX.Element> = {
  price: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M12 9h8a3 3 0 0 1 3 3v8.8a3 3 0 0 1-.88 2.12l-6.33 6.33a1.5 1.5 0 0 1-2.12 0l-6.8-6.8a1.5 1.5 0 0 1 0-2.12L14 9Z"
        stroke="#0f172a"
        strokeWidth="1.5"
        fill="rgba(15,23,42,0.04)"
      />
      <circle cx="20.5" cy="13.5" r="1.5" fill="#0f172a" />
    </svg>
  ),
  truck: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M5 12h14v12H5zM19 15h6l3 4v5h-9"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11" cy="24" r="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
    </svg>
  ),
  shield: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M18 6 9 9v7c0 5.52 3.21 10.58 9 13 5.79-2.42 9-7.48 9-13V9l-9-3Z"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(15,23,42,0.03)"
      />
      <path d="m13.5 18.5 2.5 2.5 5-5" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  return: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M11 15H7V8h7v4"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 24h11a5 5 0 0 0 0-10h-9"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
}

export function TrustStrip() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section ref={sectionRef} className="py-14 px-4 sm:px-6 lg:px-8 bg-[#edeff2]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {trustItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={prefersReducedMotion ? {} : { y: -6 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="mb-3 flex justify-center lg:justify-start">
              {iconMap[item.icon]}
            </div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
