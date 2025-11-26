import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ManualPage } from '@/components/ManualPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Manual - Hello1984',
  description: 'Everything you need to know about setting up and using your Hello 1984 clock.',
}

export default function ManualPageRoute() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <ManualPage />
      </main>
      <Footer />
    </>
  )
}

