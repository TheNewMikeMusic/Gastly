'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const specs = [
  { label: 'Dimensions', value: '8.5" × 5.5" × 2"' },
  { label: 'Display', value: 'High-contrast LCD' },
  { label: 'Backlight', value: 'Adjustable brightness' },
  { label: 'Power', value: 'USB-C powered' },
  { label: 'Modes', value: 'Clock, Alarm, Timer' },
]

export function SpecStrip() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-foreground text-background"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 lg:gap-12"
        >
          {specs.map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="text-center"
            >
              <div className="text-sm opacity-80 mb-1">{spec.label}</div>
              <div className="text-lg font-semibold">{spec.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

