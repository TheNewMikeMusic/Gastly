'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const narratives = [
  {
    title: 'Pixel-Perfect Nostalgia',
    description: 'Every pixel carefully crafted to evoke the warmth of classic computing. The Maclock brings back the charm of 1980s design with modern precision and reliability.',
    prefix: 'maclock_pixel_perfect_detail_apple_clean.jpg.webp',
    imageLeft: true,
  },
  {
    title: '1984 Reimagined',
    description: 'Inspired by the revolutionary Macintosh 128K, reimagined for today. A timeless design that honors the past while embracing the future.',
    prefix: 'maclock_1984_design_reimagined_apple_style',
    imageLeft: false,
  },
]

export function NarrativeBlocks() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-24">
        {narratives.map((narrative, index) => (
          <NarrativeBlock
            key={narrative.prefix}
            narrative={narrative}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  )
}

function NarrativeBlock({
  narrative,
  index,
  prefersReducedMotion,
}: {
  narrative: typeof narratives[0]
  index: number
  prefersReducedMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${narrative.imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
    >
      <div className="flex-1 relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-black/5 image-container">
        <OptimizedImage
          prefix={narrative.prefix}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className=""
        />
      </div>
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{narrative.title}</h2>
        <p className="text-lg text-foreground/80 leading-relaxed">{narrative.description}</p>
      </div>
    </motion.div>
  )
}

