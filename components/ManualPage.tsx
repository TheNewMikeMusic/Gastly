'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { ImageViewer } from '@/components/ImageViewer'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'

const manualImages = [
  {
    prefix: 'Hello1084/retro-mac-clock-user-manual-hello1984-alarm-power-screen-stickers.png',
    alt: 'Maclock user manual showing Hello1984 features, alarm, power, screen and stickers',
    title: 'Getting Started',
    description: 'Learn how to set up your Hello 1984 clock and explore its features.',
  },
  {
    prefix: 'Hello1084/retro-mac-clock-user-manual-buttons-backlight-time-setting-alarm-setting.png',
    alt: 'Maclock user manual showing buttons, backlight, time setting and alarm setting',
    title: 'Controls & Settings',
    description: 'Master all controls, customize settings, and configure alarms.',
  },
]

export function ManualPage() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 })
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const handleImageClick = (index: number) => {
    setViewerIndex(index)
  }

  const handleNext = () => {
    if (viewerIndex !== null && viewerIndex < manualImages.length - 1) {
      setViewerIndex(viewerIndex + 1)
    }
  }

  const handlePrev = () => {
    if (viewerIndex !== null && viewerIndex > 0) {
      setViewerIndex(viewerIndex - 1)
    }
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
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
            className="text-center mb-16 sm:mb-20 lg:mb-24"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 text-[#1d1d1f] tracking-[-0.022em] leading-[1.08]">
              User Manual
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#424245] max-w-3xl mx-auto leading-[1.4] tracking-[-0.011em] font-light">
              Everything you need to know about setting up and using your Hello 1984 clock.
            </p>
          </motion.div>

          {/* Manual Cards - Full Width */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-16 max-w-6xl mx-auto">
            {manualImages.map((image, index) => (
              <motion.div
                key={image.prefix}
                initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
                animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                {/* Card Container */}
                <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-black/[0.06]">
                  {/* Card Header */}
                  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 sm:p-8 md:p-10">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.02em] mb-2">
                        {image.title}
                      </h2>
                      <p className="text-[#6e6e73] text-base sm:text-lg md:text-xl font-light leading-relaxed">
                        {image.description}
                      </p>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="px-6 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10">
                    <button
                      onClick={() => handleImageClick(index)}
                      className="relative w-full cursor-pointer touch-manipulation active:opacity-90 transition-opacity group"
                      style={{ aspectRatio: '3/4' }}
                      aria-label={`View ${image.title}`}
                    >
                      <div className="relative w-full h-full bg-[#f5f5f7] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
                        <OptimizedImage
                          prefix={image.prefix}
                          fill
                          fit="contain"
                          sizes="(max-width: 768px) 100vw, 896px"
                          alt={image.alt}
                          priority={index === 0}
                          className="object-contain p-4 sm:p-6 md:p-8"
                        />
                      </div>
                      {/* View overlay hint */}
                      <div className="absolute inset-0 flex items-end justify-center pb-4 sm:hidden pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                          <p className="text-white text-xs font-medium flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M15 3h4a2 2 0 0 1 2 2v4M15 3l-6 6M15 3v4h4M3 15h4a2 2 0 0 1 2-2V9M3 15l6-6M3 15v-4h4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>Tap to view</span>
                          </p>
                        </div>
                      </div>
                      {/* Desktop hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center pointer-events-none sm:flex hidden">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#1d1d1f]">
                            <path
                              d="M15 3h4a2 2 0 0 1 2 2v4M15 3l-6 6M15 3v4h4M3 15h4a2 2 0 0 1 2-2V9M3 15l6-6M3 15v-4h4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Viewer Modal */}
      {viewerIndex !== null && (
        <ImageViewer
          images={manualImages.map((img) => ({
            prefix: img.prefix,
            alt: img.alt,
            title: img.title,
          }))}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNext={viewerIndex < manualImages.length - 1 ? handleNext : undefined}
          onPrev={viewerIndex > 0 ? handlePrev : undefined}
        />
      )}
    </>
  )
}

