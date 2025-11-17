'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const narratives = [
  {
    title: 'Pixel-Perfect Nostalgia',
    description: 'Every pixel has been carefully placed to recreate the authentic look and feel of early Macintosh displays. The Maclock doesn\'t just mimic retro aesthetics—it captures the spirit of an era when computing felt personal, approachable, and full of possibility. The warm glow of the display, the precise typography, and the thoughtful animations all work together to create an experience that feels both familiar and fresh.',
    prefix: 'maclock_pixel_perfect_detail_apple_clean.jpg.webp',
    imageLeft: true,
  },
  {
    title: '1984 Reimagined',
    description: 'The original Macintosh 128K changed how people thought about personal computing. It wasn\'t just a machine—it was a statement about making technology accessible and delightful. The Maclock carries forward this philosophy, reimagining the iconic design language for a new generation. Built with modern components and thoughtful engineering, it honors the past while meeting today\'s standards for reliability and performance.',
    prefix: 'maclock_1984_design_reimagined_apple_style',
    imageLeft: false,
  },
]

export function NarrativeBlocks() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
      <div className="flex-1 relative aspect-[3/4] image-container-text">
        <OptimizedImage
          prefix={narrative.prefix}
          fill
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt={`Maclock ${narrative.title.toLowerCase()}`}
        />
      </div>
      <div className="flex-1 space-y-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{narrative.title}</h2>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">{narrative.description}</p>
      </div>
    </motion.div>
  )
}

