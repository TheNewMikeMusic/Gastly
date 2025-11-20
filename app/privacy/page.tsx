import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen page-content px-4 sm:px-6 lg:px-8 pb-24 bg-white safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          
          <div className="space-y-6">
            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Collection</h2>
              <p className="text-gray-700 leading-relaxed">
                We collect information necessary to process your orders and provide customer support. 
                This includes your name, email address, shipping address, and payment information.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Payment Processing</h2>
              <p className="text-gray-700 leading-relaxed">
                All payments are processed securely through Stripe. We do not store your full payment 
                card details. Stripe handles all payment data in compliance with PCI DSS standards.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Usage</h2>
              <p className="text-gray-700 leading-relaxed">
                We use your data solely for order processing, shipping, and customer communication. 
                We do not sell or share your personal information with third parties except as 
                necessary to fulfill your orders.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We use essential cookies for authentication and session management. 
                We do not use tracking cookies or third-party analytics without your consent.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                Contact us at <a href="mailto:support@hello1984.com" className="text-gray-900 hover:text-gray-700 underline transition-colors">support@hello1984.com</a> to exercise these rights.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

