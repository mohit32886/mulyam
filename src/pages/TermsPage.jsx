import { Layout } from '../components/layout'
import { FileText, ShoppingBag, CreditCard, Truck, RotateCcw, Shield, Scale, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui'
import { PageSEO, pageMeta } from '../seo'

function TermsPage() {
  return (
    <Layout>
      <PageSEO
        title={pageMeta.terms.title}
        description={pageMeta.terms.description}
        canonical="/terms"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-gray-600">
            Welcome to Mulyam. By accessing or using our website and placing an order,
            you agree to be bound by the following Terms & Conditions.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            Please read them carefully before making a purchase.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {/* General */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-tan" />
                General
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• All products and content on this website are owned by Mulyam</li>
                <li>• We reserve the right to update these terms at any time without prior notice</li>
                <li>• Continued use of the website implies acceptance of the latest terms</li>
              </ul>
            </div>

            {/* Products & Orders */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-tan" />
                Products & Orders
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Product images are for reference; slight variations in color or finish are natural</li>
                <li>• Prices are subject to change and may vary during sales or promotional periods</li>
                <li>• All orders are subject to product availability</li>
                <li>• We reserve the right to cancel orders if pricing errors occur</li>
              </ul>
            </div>

            {/* Payments */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                Payments
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• We accept secure online payments via UPI, cards, and net banking</li>
                <li>• All prices are listed in INR and inclusive of applicable taxes</li>
                <li>• Payment must be completed at checkout to confirm the order</li>
              </ul>
            </div>

            {/* Shipping */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Shipping
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Shipping timelines are estimates and may vary by location</li>
                <li>• Mulyam is not responsible for delays caused by courier partners or external factors</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                For full shipping details, see our Shipping Policy.
              </p>
            </div>

            {/* Returns & Refunds */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-coral" />
                Returns & Refunds
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Returns and exchanges are accepted within <span className="font-medium">4 days of delivery</span></li>
                <li>• Products must be unused, unworn, and in original packaging</li>
                <li>• Sale items, customized pieces, and items damaged due to misuse are non-returnable</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                See our Return Policy for full terms.
              </p>
            </div>

            {/* Warranty */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-tan" />
                Warranty
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• We offer a <span className="font-medium">6-month warranty</span> on manufacturing defects</li>
                <li>• Warranty does not cover damage due to wear, water, chemicals, or improper care</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg">
                Intellectual Property
              </h3>
              <p className="mt-3 text-gray-600">
                All content, including text, images, designs, and branding, is the sole property
                of Mulyam. Unauthorized use is prohibited.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-gray-500" />
                Limitation of Liability
              </h3>
              <p className="mt-3 text-gray-600">
                Mulyam is not liable for any indirect or incidental damages arising from the
                use of our products or services.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg">
                Governing Law
              </h3>
              <p className="mt-3 text-gray-600">
                These terms are governed by the laws of India. Any disputes shall be
                subject to the jurisdiction of Indian courts.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-coral">
              <h3 className="font-display font-semibold text-lg">
                Questions?
              </h3>
              <p className="mt-3 text-gray-600">
                If you have any questions about these terms, feel free to reach out.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:founders@mulyamjewels.com" className="text-coral hover:underline">
                    founders@mulyamjewels.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">WhatsApp:</span> Click the icon on the website to message us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-dark text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl">
            Need Clarification?
          </h2>
          <p className="mt-2 text-white/70">
            We're happy to answer any questions about our terms.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20have%20a%20question%20about%20your%20terms."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6"
          >
            <Button variant="coral" size="lg">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  )
}

export default TermsPage
