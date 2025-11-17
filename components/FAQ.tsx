'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

const faqs = [
  {
    question: 'How long does shipping take?',
    answer:
      'Maclock ships from California within 7-10 business days of purchase. Delivery to North America typically takes 3-5 days, while Europe and Asia arrive in 8-12 days. Every order receives a tracked, carbon-neutral shipment.',
  },
  {
    question: 'What exactly is in the box?',
    answer:
      "You'll receive the Maclock unit, a 2 m braided USB-C cable, a microfiber cloth, and a quick-start guide that walks through the startup ritual. A USB-C power adapter is not included so you can use the one you already trust.",
  },
  {
    question: 'How do power and settings work?',
    answer:
      "Maclock runs on standard 5V USB-C power and consumes less than 2W. A real-time clock backup preserves the time, alarms, and brightness even if you unplug it, so there's no setup dance each day.",
  },
  {
    question: 'Is there an app?',
    answer:
      'No apps, subscriptions, or Bluetooth pairing. Every control lives on the device—anodized buttons for alarms, a physical dimmer, and a rear menu toggle. It feels analog on purpose.',
  },
  {
    question: 'Is this officially licensed?',
    answer:
      "Maclock is an independent homage built by a small team of hardware designers. We aren't affiliated with Apple Inc. The wordmarks and rituals are original interpretations inspired by the Macintosh spirit.",
  },
  {
    question: 'What if something goes wrong?',
    answer:
      "We provide a 12-month hardware warranty plus 30-day returns. If a component fails, we'll repair or replace it. If the clock doesn't fit your space, send it back in its original packaging for a full refund.",
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
            Frequently asked questions
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
              className="glass-card rounded-2xl p-6 cursor-pointer focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2"
            >
              <summary className="font-semibold text-lg text-gray-900 list-none flex items-center justify-between hover:text-gray-700 transition-colors">
                <span>{faq.question}</span>
                <span className="text-gray-600 text-2xl leading-none" aria-hidden="true">
                  {openIndex === index ? '\u2212' : '+'}
                </span>
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}
