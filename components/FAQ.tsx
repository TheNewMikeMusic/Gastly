'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

const faqs = [
  {
    question: 'Shipping & Tax',
    answer: 'We ship worldwide to most countries. Shipping costs and applicable taxes are calculated automatically at checkout based on your delivery address. Free shipping is available for orders over $200 to select regions. Delivery typically takes 7-14 business days for international orders, and 3-5 business days for domestic shipments. You\'ll receive a tracking number once your order ships.',
  },
  {
    question: 'Warranty & Support',
    answer: 'Every Maclock comes with a comprehensive 1-year limited warranty that covers manufacturing defects and component failures under normal use. If you experience any issues within the warranty period, contact our support team and we\'ll work with you to resolve the problem, including repair or replacement if necessary. Our support team is responsive and committed to ensuring your satisfaction.',
  },
  {
    question: 'Power Requirements',
    answer: 'The Maclock is powered via USB-C and does not include an internal battery. This design choice ensures consistent performance and eliminates battery replacement concerns. A 6-foot USB-C cable is included with your purchase. You\'ll need a standard USB-C power adapter (5V, 1A minimum), which is not included but can be found at most electronics retailers. The device consumes less than 2 watts during normal operation.',
  },
  {
    question: 'Compatibility & Setup',
    answer: 'The Maclock operates independently and doesn\'t require a computer or smartphone connection. All settings, including time, alarms, and brightness, are controlled directly on the device using the physical controls. The interface is intuitive and designed to be immediately usable without any setup software or apps.',
  },
  {
    question: 'Design & Authenticity',
    answer: 'Maclock is an independent product created by enthusiasts who appreciate the design heritage of early personal computing. It is not affiliated with, endorsed by, or associated with Apple Inc. The design pays homage to the original Macintosh 128K while incorporating modern components and engineering. All product names, logos, and trademarks mentioned are the property of their respective owners.',
  },
  {
    question: 'Returns & Refunds',
    answer: 'We offer a 30-day return policy for unused items in their original packaging. If you\'re not completely satisfied with your Maclock, contact us within 30 days of delivery to initiate a return. Once we receive the returned item and verify its condition, we\'ll process a full refund to your original payment method. Return shipping costs are the responsibility of the customer unless the item is defective or incorrect.',
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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about the Maclock, from shipping and setup to warranty and returns.
          </p>
        </motion.div>

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
              className="glass-card rounded-lg p-6 cursor-pointer focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2"
            >
              <summary className="font-semibold text-lg text-gray-900 list-none flex items-center justify-between hover:text-gray-700 transition-colors">
                <span>{faq.question}</span>
                <span className="text-gray-600 text-2xl leading-none">{openIndex === index ? '−' : '+'}</span>
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}

