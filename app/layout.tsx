import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { defaultMetadata } from '@/lib/config'
import { Analytics } from '@/components/Analytics'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = defaultMetadata

import { ClerkProvider } from '@clerk/nextjs'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" className={inter.variable}>
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
