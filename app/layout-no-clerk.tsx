import type { Metadata } from 'next'
import './globals.css'
import { defaultMetadata } from '@/lib/config'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = defaultMetadata

// 临时禁用 Clerk - 如果不需要认证功能
// import { ClerkProvider } from '@clerk/nextjs'
// const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 临时禁用 ClerkProvider
    // <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/icon.svg" />
        </head>
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    // </ClerkProvider>
  )
}





