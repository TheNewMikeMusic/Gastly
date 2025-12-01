import type { Metadata } from 'next'
import './globals.css'
import { defaultMetadata } from '@/lib/config'
import { Analytics } from '@/components/Analytics'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = defaultMetadata

// Conditional Clerk support - same logic as middleware.ts
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = publishableKey && 
  publishableKey !== 'pk_test_dummy' && 
  !publishableKey.includes('你的Clerk') &&
  !publishableKey.includes('placeholder') &&
  (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&family=Fredoka+One&display=swap" 
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon.svg" />
      </head>
      <body className="bg-ghost-bg-page text-ghost-text-primary">
        {children}
        <Analytics />
      </body>
    </html>
  )

  // Always provide ClerkProvider to avoid hook errors
  // Use actual key if configured, otherwise use a placeholder that will be handled by components
  const keyToUse = isClerkConfigured ? publishableKey! : 'pk_test_00000000000000000000000000000000'
  
  // Explicitly set frontendApi to use Clerk's default domain if custom domain is not configured
  // This prevents ERR_CONNECTION_CLOSED errors when custom domain is not properly set up
  const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API
  
  return (
    <ClerkProvider 
      publishableKey={keyToUse}
      {...(clerkFrontendApi && { frontendApi: clerkFrontendApi })}
    >
      {content}
    </ClerkProvider>
  )
}
