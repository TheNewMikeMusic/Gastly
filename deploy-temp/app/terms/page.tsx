import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen page-content px-4 sm:px-6 lg:px-8 pb-24 bg-white safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Terms of Service</h1>
          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            Please read these terms carefully before making a purchase. By purchasing from Hello1984, you agree to these terms.
          </p>
          
          <div className="space-y-6">
            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Returns & Refunds</h2>
              <p className="text-gray-700 leading-relaxed">
                We offer a 30-day return policy for unused items in original packaging. 
                Refunds will be processed within 5-7 business days after we receive the returned item.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Warranty</h2>
              <p className="text-gray-700 leading-relaxed">
                All products come with a 1-year limited warranty covering manufacturing defects. 
                Warranty does not cover damage from misuse or accidents.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Shipping</h2>
              <p className="text-gray-700 leading-relaxed">
                Shipping times vary by location. We ship worldwide and provide tracking information 
                for all orders. Free shipping available for orders over $200.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                Hello1984 is an independent product and is not affiliated with, endorsed by, 
                or associated with Apple Inc. All product names and trademarks are the property 
                of their respective owners.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

