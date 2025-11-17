'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const trustItems = [
  {
    icon: '💰',
    title: '$299',
    description: 'One-time payment. No subscriptions.',
  },
  {
    icon: '🚚',
    title: 'Free Shipping',
    description: 'Worldwide delivery included.',
  },
  {
    icon: '🛡️',
    title: '1-Year Warranty',
    description: 'Coverage for manufacturing defects.',
  },
  {
    icon: '↩️',
    title: '30-Day Returns',
    description: 'Full refund if not satisfied.',
  },
]

export function TrustStrip() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


