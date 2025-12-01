import { Metadata } from 'next'

export const siteConfig = {
  name: 'Gastly Humidifier 2.1',
  description: 'A ghost-type desktop humidifier that brings purple mist to your workspace. Perfect companion for late-night gaming, coding, and relaxation.',
  url: process.env.NEXT_PUBLIC_URL || 'https://38.175.195.104',
}

// Check if Clerk is properly configured
export function isClerkConfigured(): boolean {
  if (typeof window === 'undefined') {
    // Server-side check
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    return !!(
      publishableKey && 
      publishableKey !== 'pk_test_dummy' && 
      !publishableKey.includes('你的Clerk') &&
      !publishableKey.includes('placeholder') &&
      (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))
    )
  } else {
    // Client-side check
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    return !!(
      publishableKey && 
      publishableKey !== 'pk_test_dummy' && 
      !publishableKey.includes('你的Clerk') &&
      !publishableKey.includes('placeholder') &&
      (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))
    )
  }
}

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/Gastly/Front.png',
        width: 1200,
        height: 630,
        alt: 'Gastly Humidifier 2.1',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

