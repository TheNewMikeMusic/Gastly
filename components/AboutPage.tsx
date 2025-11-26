'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const aboutSections = [
  {
    title: 'Our Story',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="currentColor"/>
      </svg>
    ),
    content: [
      'Hello1984 is a limited-run Macintosh-style alarm clock from a small hardware studio in California. We obsess over tactility, not telemetry, and every unit is hand-finished before it leaves the lab.',
      'Inspired by the original Macintosh 128K, Hello1984 brings the warmth of 1980s desktop computing into a tiny, dependable clock. The proportions, pixel grid, and details are all tuned to feel instantly familiar yet quietly new.',
    ],
  },
  {
    title: 'Our Philosophy',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
      </svg>
    ),
    content: [
      'We believe in thoughtful design and intentional craftsmanship. In a world of disposable, data-hungry gadgets, we make objects that are built to last and designed to feel calm in daily use.',
      'From the pixel smile to the under-chassis brightness wheel, Hello1984 rebuilds the small Macintosh rituals so you don\'t just check the time — you boot it up, dial it in, and let it glow.',
    ],
  },
  {
    title: 'Our Studio',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    content: [
      'Based in Studio 128, San Francisco, we\'re a small team of designers, engineers, and makers with a shared love of retro computing and modern craft.',
      'Each Hello1984 clock is assembled, calibrated, and tested by hand. We take care to honor the past while embracing the future, one small batch at a time.',
    ],
  },
]

export function AboutPage() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 })

  return (
    <>
      <section
        ref={sectionRef}
        className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-[600px] h-[600px] blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 sm:mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#424245] hover:text-[#1d1d1f] transition-colors duration-200 ease-apple-standard group"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-200 group-hover:-translate-x-1"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm sm:text-base font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20 sm:mb-24 lg:mb-28"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 text-[#1d1d1f] tracking-[-0.022em] leading-[1.08]">
              About Us
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#424245] max-w-3xl mx-auto leading-[1.4] tracking-[-0.011em] font-normal">
              A small hardware studio creating quietly obsessive objects for everyday life.
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {aboutSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
                animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-black/[0.06] overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div 
                    className="absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
                    }}
                  />
                  
                  {/* Icon */}
                  <div className="mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] group-hover:bg-[#e8e8ed] transition-colors duration-300">
                      {section.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1d1d1f] tracking-[-0.022em] leading-[1.08] mb-6 sm:mb-8">
                    {section.title}
                  </h2>

                  {/* Content */}
                  <div className="space-y-5 sm:space-y-6">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-lg sm:text-xl lg:text-2xl text-[#424245] leading-[1.6] tracking-[-0.011em] font-normal"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
            animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: aboutSections.length * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-20 sm:mt-24 lg:mt-28"
          >
            <div className="relative bg-gradient-to-br from-[#f5f5f7] to-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 lg:p-12 border border-black/[0.06] overflow-hidden">
              {/* Decorative elements */}
              <div 
                className="absolute top-0 right-0 w-96 h-96 blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 122, 255, 0.1) 0%, transparent 70%)',
                }}
              />
              
              <div className="relative z-10 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1d1d1f] text-white mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.022em]">
                  Get in Touch
                </h2>
                <p className="text-lg sm:text-xl text-[#424245] leading-[1.6] max-w-2xl mx-auto">
                  Have questions or want to learn more? We&apos;d love to hear from you.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#1d1d1f] text-white px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-medium hover:bg-[#424245] transition-all duration-300 ease-apple-standard touch-manipulation shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-100"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

