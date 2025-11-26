'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { ImageViewer } from '@/components/ImageViewer'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'

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

export function Gallery() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
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
        id="gallery"
        className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Apple Style */}
          <motion.div
            initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 sm:mb-20 lg:mb-24"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 text-[#1d1d1f] tracking-[-0.022em] leading-[1.08]">
              User Manual
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#424245] max-w-3xl mx-auto leading-[1.4] tracking-[-0.011em] font-light">
              Everything you need to know about setting up and using your Hello 1984 clock.
            </p>
          </motion.div>

          {/* Manual Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
            {manualImages.map((image, index) => {
              const isExpanded = expandedIndex === index
              
              return (
                <motion.div
                  key={image.prefix}
                  initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
                  animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: index * 0.15, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="group relative"
                >
                  {/* Card Container */}
                  <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-black/[0.06]">
                    {/* Card Header */}
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8 text-left focus:outline-none focus:ring-2 focus:ring-[#007aff]/40 focus:ring-offset-2 rounded-t-[2rem] sm:rounded-t-[2.5rem] hover:bg-[#f5f5f7] transition-colors duration-300 touch-manipulation min-h-[72px] sm:min-h-[88px]"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? `Collapse ${image.title}` : `Expand ${image.title}`}
                    >
                      <div className="flex-1 pr-3">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                          {image.title}
                        </h3>
                        <p className="text-[#6e6e73] text-sm sm:text-base md:text-lg font-light leading-relaxed mt-1 sm:hidden">
                          {image.description}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-shrink-0"
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#e8e8ed] transition-colors duration-300">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-[#1d1d1f] sm:w-5 sm:h-5"
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    </button>

                    {/* Description for desktop */}
                    <div className="hidden sm:block px-8 pb-6">
                      <p className="text-[#6e6e73] text-lg font-light leading-relaxed">
                        {image.description}
                      </p>
                    </div>

                    {/* Collapsible Image Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-2">
                            <div className="relative w-full bg-[#f5f5f7] rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 md:p-6 overflow-hidden">
                              {/* Image Container */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleImageClick(index)
                                }}
                                className="relative w-full cursor-pointer touch-manipulation active:opacity-90 transition-opacity group"
                                style={{ aspectRatio: '3/4' }}
                                onTouchStart={(e) => {
                                  // Prevent card collapse when tapping image
                                  e.stopPropagation()
                                }}
                                aria-label={`View ${image.title}`}
                              >
                                <OptimizedImage
                                  prefix={image.prefix}
                                  fill
                                  fit="contain"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                                  alt={image.alt}
                                  priority={index === 0}
                                  className="object-contain"
                                />
                                {/* View overlay hint */}
                                <div className="absolute inset-0 flex items-end justify-center pb-3 sm:hidden pointer-events-none">
                                  <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                                    <p className="text-white text-xs font-medium flex items-center gap-1.5">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v4M15 3l-6 6M15 3v4h4M3 15h4a2 2 0 0 1 2-2V9M3 15l6-6M3 15v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      <span>Tap to view</span>
                                    </p>
                                  </div>
                                </div>
                                {/* Desktop hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-xl flex items-center justify-center pointer-events-none sm:flex hidden">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1d1d1f]">
                                      <path d="M15 3h4a2 2 0 0 1 2 2v4M15 3l-6 6M15 3v4h4M3 15h4a2 2 0 0 1 2-2V9M3 15l6-6M3 15v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
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
