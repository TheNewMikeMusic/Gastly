'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

const galleryImages = [
  { prefix: 'maclock_hello_retro_dawn_apple_style', alt: 'Maclock at dawn' },
  { prefix: 'maclock_hello_retro_apple_style', alt: 'Maclock retro display' },
  { prefix: 'maclock_boot_smile_features_apple_style', alt: 'Maclock boot features' },
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
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Gallery
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {galleryImages.map((image, index) => (
              <motion.button
                key={image.prefix}
                initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, scale: 0.9 }}
                animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedImage(index)}
                className="glass rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 border border-black/5"
                aria-label={`View ${image.alt}`}
              >
                <div className="relative aspect-[3/4]">
                  <OptimizedImage
                    prefix={image.prefix}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                    alt={image.alt}
                  />
                </div>
              </motion.button>
            ))}
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
          <div className="relative max-w-2xl w-full aspect-[3/4]">
            <OptimizedImage
              prefix={galleryImages[selectedImage].prefix}
              fill
              sizes="100vw"
              className="object-contain"
              alt={galleryImages[selectedImage].alt}
            />
          </div>
        </div>
      )}
    </>
  )
}

