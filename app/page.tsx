import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { TrustStrip } from '@/components/TrustStrip'
import { NarrativeBlocks } from '@/components/NarrativeBlocks'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { SpecStrip } from '@/components/SpecStrip'
import { Footer } from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { BackgroundMusic } from '@/components/BackgroundMusic'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

// 懒加载非关键组件
const ProductSpinVideo = dynamic(
  () => import('@/components/ProductSpinVideo').then((mod) => ({ default: mod.ProductSpinVideo })),
  {
    loading: () => (
      <section className="w-full overflow-hidden bg-ghost-bg-section py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-ghost-text-secondary">加载中...</p>
        </div>
      </section>
    ),
    ssr: false,
  }
)

const LifestyleScenarios = dynamic(
  () => import('@/components/LifestyleScenarios').then((mod) => ({ default: mod.LifestyleScenarios })),
  {
    ssr: true,
  }
)

const SellerReviews = dynamic(
  () => import('@/components/SellerReviews').then((mod) => ({ default: mod.SellerReviews })),
  {
    ssr: true,
  }
)

const FAQ = dynamic(
  () => import('@/components/FAQ').then((mod) => ({ default: mod.FAQ })),
  {
    ssr: true,
  }
)

export const metadata: Metadata = {
  title: 'Gastly Humidifier 2.1 - Ghost-Type Desktop Humidifier',
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: '/Gastly/Banner.webp',
        width: 1200,
        height: 630,
        alt: 'Gastly Humidifier 2.1',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/Gastly/Banner.webp'],
  },
}

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="page-stack relative overflow-hidden page-transition">
        <div className="page-stack__glow page-stack__glow--one" aria-hidden="true" />
        <div className="page-stack__glow page-stack__glow--two" aria-hidden="true" />
        {/* 全局网格背景 */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <div className="relative z-10 space-y-0">
          <Hero />
          <ErrorBoundary
            fallback={
              <section className="w-full overflow-hidden bg-ghost-bg-section py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <p className="text-ghost-text-secondary">产品旋转组件暂时不可用</p>
                </div>
              </section>
            }
          >
            <ProductSpinVideo />
          </ErrorBoundary>
          <div className="section-ambient section-ambient--compact-bottom">
            <ErrorBoundary
              fallback={
                <section className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    <div className="glass-card rounded-2xl p-5 sm:p-6 text-center">
                      <p className="text-sm text-gray-600">Trust cards temporarily unavailable</p>
                    </div>
                  </div>
                </section>
              }
            >
              <TrustStrip />
            </ErrorBoundary>
          </div>
          <div className="section-ambient section-ambient--compact-top">
            <NarrativeBlocks />
          </div>
          <div className="section-ambient section-ambient--compact-bottom">
            <FeaturesGrid />
          </div>
          <div className="section-ambient">
            <LifestyleScenarios />
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
      <BackgroundMusic />
    </>
  )
}
