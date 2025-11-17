'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const narratives = [
  {
    title: 'The startup ritual returns.',
    description:
      'Maclock still greets you with the smiling face, floppy disk, and gentle fade that made the first Macintosh feel alive—now tuned to modern hardware so it happens in seconds.',
    prefix: 'maclock_boot_smile_feature_grid_apple_style',
    alt: 'Maclock showing the smiling Macintosh boot screen beside the system disk animation',
    imageLeft: true,
  },
  {
    title: 'Industrial warmth for 2025 desks.',
    description:
      'A bead-blasted shell, satin lens, and USB-C core feel intentional alongside modern tablets and notebooks while keeping the original Macintosh proportions intact.',
    prefix: 'maclock_1984_design_reimagined_apple_style',
    alt: 'Maclock hardware profile highlighting the vented rear case and curved display glass',
    imageLeft: false,
  },
]

export function NarrativeBlocks() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f8f9fb]">
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
      className={`flex flex-col ${narrative.imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center`}
    >
      <div className="flex-1 relative aspect-[3/4] image-container-text">
        <OptimizedImage
          prefix={narrative.prefix}
          fill
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt={narrative.alt}
        />
      </div>
      <div className="flex-1 space-y-6 lg:px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Chapter {index + 1}</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{narrative.title}</h2>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">{narrative.description}</p>
      </div>
    </motion.div>
  )
}
