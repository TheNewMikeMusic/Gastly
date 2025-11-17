'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

const faqs = [
  {
    question: 'Shipping & Tax',
    answer: 'We ship worldwide. Shipping costs and taxes are calculated at checkout based on your location. Free shipping available for orders over $200.',
  },
  {
    question: 'Warranty',
    answer: 'All Maclock devices come with a 1-year limited warranty covering manufacturing defects. Contact us within the warranty period for support.',
  },
  {
    question: 'Battery',
    answer: 'Maclock is USB-C powered and does not include a battery. It requires a standard USB-C power adapter (not included).',
  },
  {
    question: 'Affiliation',
    answer: 'Maclock is an independent product and is not affiliated with, endorsed by, or associated with Apple Inc. All product names and trademarks are the property of their respective owners.',
  },
]

export function FAQ() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-16 text-foreground"
        >
          FAQ
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              open={openIndex === index}
              onToggle={(e) => {
                setOpenIndex(e.currentTarget.open ? index : null)
              }}
              className="glass rounded-lg p-6 cursor-pointer focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2"
            >
              <summary className="font-semibold text-lg text-foreground list-none flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="text-foreground/60">{openIndex === index ? '−' : '+'}</span>
              </summary>
              <p className="mt-4 text-foreground/70 leading-relaxed">{faq.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}

