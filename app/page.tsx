import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { NarrativeBlocks } from '@/components/NarrativeBlocks'
import { Gallery } from '@/components/Gallery'
import { SpecStrip } from '@/components/SpecStrip'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Maclock - Retro Macintosh-style Digital Clock',
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: '/maclock_hello_retro_apple_style.webp',
        width: 1200,
        height: 630,
        alt: 'Maclock retro hello screen',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/maclock_hello_retro_apple_style.webp'],
  },
}

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <FeaturesGrid />
        <NarrativeBlocks />
        <Gallery />
        <SpecStrip />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

