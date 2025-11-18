'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

const galleryImages = [
  {
    prefix: 'maclock_boot_smile_features_apple_style',
    alt: 'Maclock beside a stack of books on a bedside table showing the smiling boot screen',
    title: 'Nightstand storyteller',
    description:
      'Dial back the backlight for sleep hygiene, then tap the alarm rocker for a gentle wake. The glow is calm, not clinical.',
  },
]

export function Gallery() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <>
      <section
        ref={sectionRef}
        id="gallery"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f8f9fb]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 tracking-[-0.022em] leading-[1.08]">
              Designed for Your Space
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em]">
              The Maclock adapts to your environment, whether it&rsquo;s a morning desk setup, a living room display, or a bedside companion.
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.prefix}
                initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 24 }}
                animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <motion.button
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 overflow-hidden"
                  aria-label={`View ${image.alt}`}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <OptimizedImage
                      prefix={image.prefix}
                      fill
                      fit="contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      alt={image.alt}
                    />
                  </div>
                </motion.button>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 tracking-[-0.02em] leading-[1.1]">{image.title}</h3>
                  <p className="text-sm text-gray-600 leading-[1.6] tracking-[-0.011em]">{image.description}</p>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for image preview */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Close preview"
          >
            ×
          </button>
          <div className="relative max-w-2xl w-full aspect-[3/4] image-container-text bg-white/95 p-4">
            <OptimizedImage
              prefix={galleryImages[selectedImage].prefix}
              fill
              fit="contain"
              sizes="100vw"
              alt={galleryImages[selectedImage].alt}
            />
          </div>
        </div>
      )}
    </>
  )
}
