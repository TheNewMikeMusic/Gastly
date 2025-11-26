import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { TrustStrip } from '@/components/TrustStrip'
import { ProductSpinVideo } from '@/components/ProductSpinVideo'
import { NarrativeBlocks } from '@/components/NarrativeBlocks'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { SellerReviews } from '@/components/SellerReviews'
import { SpecStrip } from '@/components/SpecStrip'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
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
          <ErrorBoundary
            fallback={
              <section className="w-full overflow-hidden bg-[#f6f7fb] py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <p className="text-gray-500">产品旋转组件暂时无法加载</p>
                </div>
              </section>
            }
          >
            <ProductSpinVideo />
          </ErrorBoundary>
          <div className="section-ambient">
            <ErrorBoundary
              fallback={
                <section className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    <div className="glass-card rounded-2xl p-5 sm:p-6 text-center">
                      <p className="text-sm text-gray-600">信任卡片暂时无法加载</p>
                    </div>
                  </div>
                </section>
              }
            >
              <TrustStrip />
            </ErrorBoundary>
          </div>
          <div className="section-ambient">
            <NarrativeBlocks />
          </div>
          <div className="section-ambient">
            <FeaturesGrid />
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
