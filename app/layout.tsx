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
    <ClerkProvider 
      publishableKey={publishableKey}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en" className="light">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
          <meta name="color-scheme" content="light" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/icon.svg" />
          {/* 预加载Hero图片 */}
          <link
            rel="preload"
            href="/maclock_hello_retro_apple_style.webp"
            as="image"
            fetchPriority="high"
          />
        </head>
        <body className="bg-white">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
