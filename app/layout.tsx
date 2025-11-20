import type { Metadata } from 'next'
import './globals.css'
import { defaultMetadata } from '@/lib/config'
import { Analytics } from '@/components/Analytics'

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
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        </head>
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
