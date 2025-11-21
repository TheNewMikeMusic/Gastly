import { Metadata } from 'next'

export const siteConfig = {
  name: 'Hello1984',
  description: 'A beautifully crafted retro Macintosh-style digital clock. Pixel-perfect nostalgia meets modern craftsmanship.',
  url: process.env.NEXT_PUBLIC_URL || 'https://hello1984.com',
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
}

