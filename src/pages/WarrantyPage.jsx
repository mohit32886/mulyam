import { Layout } from '../components/layout'
import { Shield, CheckCircle, XCircle, Clock, Wrench, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui'
import { PageSEO, pageMeta } from '../seo'

function WarrantyPage() {
  return (
    <Layout>
      <PageSEO
        title={pageMeta.warranty.title}
        description={pageMeta.warranty.description}
        canonical="/warranty"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Warranty Policy
          </h1>
          <p className="mt-4 text-gray-600">
            We stand behind the quality of what we make.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            Every Mulyam piece is crafted with care — and backed by our promise to you.
          </p>
        </div>
      </section>

      {/* Warranty Highlight */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-tan/10 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-tan/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-tan" />
            </div>
            <h2 className="font-display font-bold text-3xl mt-4 text-dark">
              6-Month Warranty
            </h2>
            <p className="mt-2 text-gray-600 max-w-xl mx-auto">
              All Mulyam jewellery comes with a 6-month warranty against manufacturing defects from the date of delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {/* What's Covered */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                What's Covered
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Discoloration under normal use (not caused by external factors)</li>
                <li>• Clasp or closure failure due to manufacturing issues</li>
                <li>• Detachment of stones or elements (due to faulty setting)</li>
                <li>• Structural breakage not caused by misuse or accidents</li>
              </ul>
            </div>

            {/* What's NOT Covered */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                What's NOT Covered
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Damage caused by water, sweat, perfume, or chemical exposure</li>
                <li>• Scratches, dents, or wear from regular use</li>
                <li>• Improper storage or handling</li>
                <li>• Damage due to accidents or external force</li>
                <li>• Loss of jewellery or components</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                Basically, we've got you if it's on us — but not if it's an everyday oops.
              </p>
            </div>

            {/* How to Claim */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-tan" />
                How to Claim Warranty
              </h3>
              <p className="mt-3 text-gray-600">To raise a warranty claim:</p>
              <ol className="mt-2 space-y-2 text-gray-600 list-decimal list-inside">
                <li>Contact us via email or WhatsApp</li>
                <li>Share your <span className="font-medium">Order ID</span> and clear photos/videos of the issue</li>
                <li>We'll review and respond within <span className="font-medium">24–48 hours</span></li>
              </ol>
              <p className="mt-3 text-gray-600">
                If eligible, we'll offer a <span className="font-medium">repair, replacement, or store credit</span> — whichever makes the most sense.
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Warranty Timeline
              </h3>
              <p className="mt-3 text-gray-600">
                Warranty is valid for <span className="font-medium">6 months from the date of delivery</span>.
              </p>
              <p className="mt-2 text-gray-500 text-sm italic">
                We recommend keeping your order confirmation handy for reference.
              </p>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg">Important</h3>
              <p className="mt-3 text-gray-700">
                We strongly recommend following our Care Guide to keep your jewellery
                in top shape and extend its shine.
              </p>
              <p className="mt-2 text-gray-700">
                A little love goes a long way — just like good jewellery.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-coral">
              <h3 className="font-display font-semibold text-lg">
                Need to Raise a Claim?
              </h3>
              <p className="mt-3 text-gray-600">
                We're here to help — no long forms, no drama.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:founders@mulyamjewels.com" className="text-coral hover:underline">
                    founders@mulyamjewels.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">WhatsApp:</span> Tap on the WhatsApp icon and message us with your Order ID.
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
            Have a Warranty Question?
          </h2>
          <p className="mt-2 text-white/70">
            We're just a message away.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20have%20a%20question%20about%20warranty."
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

export default WarrantyPage
