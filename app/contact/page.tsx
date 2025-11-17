import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          
          <div className="glass rounded-lg p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <a
                href="mailto:support@maclock.com"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                support@maclock.com
              </a>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Response Time</h2>
              <p className="text-foreground/70">
                We typically respond within 24-48 hours during business days.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Support Hours</h2>
              <p className="text-foreground/70">
                Monday - Friday, 9 AM - 5 PM PST
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

