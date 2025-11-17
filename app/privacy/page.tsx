import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              We collect information necessary to process your orders and provide customer support. 
              This includes your name, email address, shipping address, and payment information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payment Processing</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              All payments are processed securely through Stripe. We do not store your full payment 
              card details. Stripe handles all payment data in compliance with PCI DSS standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              We use your data solely for order processing, shipping, and customer communication. 
              We do not sell or share your personal information with third parties except as 
              necessary to fulfill your orders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              We use essential cookies for authentication and session management. 
              We do not use tracking cookies or third-party analytics without your consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              You have the right to access, update, or delete your personal information at any time. 
              Contact us at support@maclock.com to exercise these rights.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

