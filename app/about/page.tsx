import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { AboutPage } from '@/components/AboutPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Hello1984',
  description: 'A limited-run desktop clock built by a small hardware studio in California.',
}

export default function AboutPageRoute() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <AboutPage />
      </main>
      <Footer />
    </>
  )
}

