'use client'

import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { createEnterAnimation, EASE_APPLE } from '@/lib/animations'

const specs = [
  {
    category: 'Dimensions',
    items: [
      { label: 'Size', value: '15 × 20 cm' },
    ],
  },
  {
    category: 'Power',
    items: [
      { label: 'Plug Type', value: 'USB' },
      { label: 'Power Input', value: '5V / 1A' },
    ],
  },
  {
    category: 'Water',
    items: [
      { label: 'Tank Capacity', value: '15 ml' },
      { label: 'Spray Duration', value: '1–2 hours (per refill)' },
    ],
  },
  {
    category: 'Package Contents',
    items: [
      { label: '', value: '1 × Gastly Humidifier 2.1' },
      { label: '', value: '1 × User Manual' },
      { label: '', value: '1 × USB Charging/Power Cable' },
    ],
  },
]

export function SpecStrip() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="section-spec py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      style={{ scrollMarginTop: 'calc(4rem + env(safe-area-inset-top))' }}
    >
      <SectionBackground variant="subtle" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          {...createEnterAnimation('title', 0)}
          initial={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('title', 0).initial}
          animate={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('title', 0).animate}
          transition={prefersReducedMotion ? {} : createEnterAnimation('title', 0).transition}
          className="text-center mb-20 sm:mb-24 lg:mb-28"
        >
          <h2 className="text-apple-display font-display mb-4 sm:mb-6 text-ghost-text-primary">
            Specifications
          </h2>
          <p className="text-apple-subtitle font-body text-ghost-text-secondary max-w-3xl mx-auto">
            Everything you need to know about size, power, and what's in the box.
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {specs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              {...createEnterAnimation('card', categoryIndex, 'card')}
              initial={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('card', categoryIndex, 'card').initial}
              animate={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('card', categoryIndex, 'card').animate}
              transition={prefersReducedMotion ? {} : createEnterAnimation('card', categoryIndex, 'card').transition}
              className="group relative bg-ghost-bg-card rounded-2xl p-6 sm:p-8 shadow-glass-dark hover:shadow-glass-dark-hover transition-all duration-300 border border-ghost-purple-primary/30 overflow-hidden"
              style={{
                transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
              }}
            >
              {/* Decorative gradient overlay */}
              <div 
                className="absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
                }}
              />
              <h3 className="relative z-10 text-apple-title-sm font-display mb-4 text-ghost-text-primary border-b border-ghost-purple-primary/20 pb-2">
                {category.category}
              </h3>
              <div className="relative z-10 space-y-3">
                {category.items.map((spec, index) => (
                  <div key={spec.label || index}>
                    {spec.label && (
                      <div className="text-apple-footnote font-body text-ghost-text-muted mb-1">{spec.label}</div>
                    )}
                    <div className="text-apple-caption font-body text-ghost-text-secondary">{spec.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
