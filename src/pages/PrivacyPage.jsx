import { Layout } from '../components/layout'
import { Shield, Database, Share2, Lock, UserCheck, Cookie, RefreshCw, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui'
import { PageSEO, pageMeta } from '../seo'

function PrivacyPage() {
  return (
    <Layout>
      <PageSEO
        title={pageMeta.privacy.title}
        description={pageMeta.privacy.description}
        canonical="/privacy"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Privacy Policy
          </h1>
          <p className="mt-4 text-gray-600">
            At Mulyam, your trust is as precious as the jewellery we create.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            This Privacy Policy explains how we collect, use, and protect your information
            when you visit our website or place an order.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {/* Information We Collect */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-tan" />
                Information We Collect
              </h3>
              <p className="mt-3 text-gray-600">When you interact with us, we may collect:</p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• <span className="font-medium">Personal details:</span> Name, phone number, email, shipping address</li>
                <li>• <span className="font-medium">Order info:</span> Product choices, payment method used</li>
                <li>• <span className="font-medium">Communication:</span> Messages exchanged via WhatsApp, email, or social media</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                We only collect what's necessary to process your order and improve your experience.
              </p>
            </div>

            {/* How We Use It */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                How We Use Your Information
              </h3>
              <p className="mt-3 text-gray-600">We use your information to:</p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• Process and ship your orders</li>
                <li>• Communicate updates, offers, and support</li>
                <li>• Improve our products and website experience</li>
                <li>• Handle returns, exchanges, or queries</li>
              </ul>
            </div>

            {/* Sharing Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5 text-coral" />
                Sharing Your Information
              </h3>
              <p className="mt-3 text-gray-600">
                We do <span className="font-medium">not sell or rent</span> your personal data.
              </p>
              <p className="mt-2 text-gray-600">We may share limited info with:</p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• Logistics partners (for delivery)</li>
                <li>• Payment gateways (for secure transactions)</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                All third parties are bound by confidentiality.
              </p>
            </div>

            {/* Data Security */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                Data Security
              </h3>
              <p className="mt-3 text-gray-600">
                We take reasonable steps to protect your data. However, no system is 100% secure,
                and we encourage safe browsing practices on your end too.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-tan" />
                Your Rights
              </h3>
              <p className="mt-3 text-gray-600">You can:</p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• Request access to your data</li>
                <li>• Ask us to correct or delete your information</li>
                <li>• Opt out of promotional messages at any time</li>
              </ul>
              <p className="mt-3 text-gray-600">
                Just reach out to us via email or WhatsApp — we're happy to help.
              </p>
            </div>

            {/* Cookies */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Cookie className="w-5 h-5 text-amber-500" />
                Cookies
              </h3>
              <p className="mt-3 text-gray-600">
                We may use cookies to enhance your browsing experience. You can manage or
                disable cookies via your browser settings.
              </p>
            </div>

            {/* Updates */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-gray-500" />
                Updates to This Policy
              </h3>
              <p className="mt-3 text-gray-600">
                This policy may be updated from time to time. Any changes will be reflected
                on this page.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-coral">
              <h3 className="font-display font-semibold text-lg">
                Questions About Your Privacy?
              </h3>
              <p className="mt-3 text-gray-600">
                We're here to answer any concerns you may have.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:founders@mulyamjewels.com" className="text-coral hover:underline">
                    founders@mulyamjewels.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">WhatsApp:</span> Tap on the WhatsApp icon and message us directly.
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
            Have Privacy Concerns?
          </h2>
          <p className="mt-2 text-white/70">
            Your trust matters to us. Reach out anytime.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20have%20a%20question%20about%20privacy."
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

export default PrivacyPage
