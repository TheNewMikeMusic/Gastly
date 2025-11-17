import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Maclock</h3>
            <p className="text-background/80 text-sm leading-relaxed mb-4 max-w-md">
              A beautifully reimagined digital clock that brings the warmth of 1980s computing into your modern workspace. Every pixel carefully crafted, every detail thoughtfully considered.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <p className="text-background/60 text-xs mt-4 leading-relaxed">
              Not affiliated with Apple Inc. Maclock is an independent product.
            </p>
          </div>
        </div>
        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
          <p>© {currentYear} Maclock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

