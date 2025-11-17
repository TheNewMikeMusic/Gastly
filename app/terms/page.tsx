import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Returns & Refunds</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              We offer a 30-day return policy for unused items in original packaging. 
              Refunds will be processed within 5-7 business days after we receive the returned item.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Warranty</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              All products come with a 1-year limited warranty covering manufacturing defects. 
              Warranty does not cover damage from misuse or accidents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              Shipping times vary by location. We ship worldwide and provide tracking information 
              for all orders. Free shipping available for orders over $200.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              Maclock is an independent product and is not affiliated with, endorsed by, 
              or associated with Apple Inc. All product names and trademarks are the property 
              of their respective owners.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

