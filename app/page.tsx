import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { TrustStrip } from '@/components/TrustStrip'
import { NarrativeBlocks } from '@/components/NarrativeBlocks'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { Gallery } from '@/components/Gallery'
import { SellerReviews } from '@/components/SellerReviews'
import { SpecStrip } from '@/components/SpecStrip'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Hello1984 - Retro Macintosh-style Digital Clock',
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
        alt: 'Hello1984 retro hello screen',
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
      <main className="page-stack relative overflow-hidden">
        <div className="page-stack__glow page-stack__glow--one" aria-hidden="true" />
        <div className="page-stack__glow page-stack__glow--two" aria-hidden="true" />
        <div className="relative z-10 space-y-0">
          <Hero />
          <div className="section-ambient">
            <TrustStrip />
          </div>
          <div className="section-ambient">
            <NarrativeBlocks />
          </div>
          <div className="section-ambient">
            <FeaturesGrid />
          </div>
          <div className="section-ambient">
            <Gallery />
          </div>
          <div className="section-ambient">
            <SellerReviews />
          </div>
          <SpecStrip />
          <div className="section-ambient">
            <FAQ />
          </div>
        </div>
      </main>
      <div className="section-ambient section-ambient--footer">
        <Footer />
      </div>
    </>
  )
}
