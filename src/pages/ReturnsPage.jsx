import { Layout } from '../components/layout'
import { RotateCcw, Clock, CheckCircle, XCircle, CreditCard, MessageCircle, Camera } from 'lucide-react'
import { Button } from '../components/ui'
import { PageSEO, pageMeta } from '../seo'

function ReturnsPage() {
  return (
    <Layout>
      <PageSEO
        title={pageMeta.returns.title}
        description={pageMeta.returns.description}
        canonical="/returns"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Return, Exchange & Refund Policy
          </h1>
          <p className="mt-4 text-gray-600">
            Because good jewellery deserves good vibes.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            At Mulyam, every piece is made to add a little sparkle to your everyday.
            But if something doesn't feel just right, we've got you covered — quickly and clearly.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-tan/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-tan" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">4-Day Window</h3>
              <p className="text-gray-600 text-sm mt-2">
                Return or exchange within 4 days of delivery
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">5-7 Day Refunds</h3>
              <p className="text-gray-600 text-sm mt-2">
                Approved refunds processed quickly
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-coral/20 rounded-full flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-coral" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Easy Exchanges</h3>
              <p className="text-gray-600 text-sm mt-2">
                Subject to availability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Info */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {/* Return Window */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-tan" />
                Return & Exchange Window
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• We accept returns or exchanges within <span className="font-medium">4 days of delivery</span></li>
                <li>• The product must be <span className="font-medium">unused, unworn, and in its original condition</span>, with all original packaging intact</li>
                <li>• Jewellery is delicate — please try it gently. Love at first wear matters.</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                Requests raised after 4 days of delivery won't be eligible.
              </p>
            </div>

            {/* Eligible Cases */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                When Can You Return or Exchange?
              </h3>
              <p className="mt-3 text-gray-600">You're eligible if:</p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• You received a <span className="font-medium">damaged or defective product</span></li>
                <li>• You received the <span className="font-medium">wrong item</span></li>
                <li>• The order is <span className="font-medium">missing something</span></li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
                <Camera className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Please reach out within 48 hours of delivery with clear photos or a short video
                  so we can fix things faster (and fairer).
                </p>
              </div>
            </div>

            {/* Not Eligible */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                What Can't Be Returned?
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Products purchased during <span className="font-medium">sales or special offers</span></li>
                <li>• Items damaged due to <span className="font-medium">wear & tear, water exposure, or improper storage</span></li>
                <li>• Customized or personalized pieces (if applicable)</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                Once worn, it's yours forever — kind of like love, but shinier!
              </p>
            </div>

            {/* Refunds */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                Refunds
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Once we receive and inspect the product, we'll update you on approval</li>
                <li>• Approved refunds are processed within <span className="font-medium">5–7 business days</span></li>
                <li>• Refunds will be credited to the <span className="font-medium">original payment method</span></li>
              </ul>
              <p className="mt-3 text-gray-600">
                <span className="font-medium">Shipping charges are non-refundable</span>, unless the mistake was ours
                (we own up when we slip).
              </p>
            </div>

            {/* Exchanges */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-tan" />
                Exchanges
              </h3>
              <p className="mt-3 text-gray-600">
                Exchanges depend on product availability.
              </p>
              <p className="mt-2 text-gray-600">If your preferred piece is unavailable, you can choose:</p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• A <span className="font-medium">store credit</span>, or</li>
                <li>• A <span className="font-medium">refund</span> (as per eligibility)</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                Because sometimes your second choice deserves a first chance.
              </p>
            </div>

            {/* How to Reach */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-coral">
              <h3 className="font-display font-semibold text-lg">How to Reach Us</h3>
              <p className="mt-3 text-gray-600">
                Raising a request is easy — no long forms, no drama.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:founders@mulyamjewels.com" className="text-coral hover:underline">
                    founders@mulyamjewels.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">WhatsApp:</span> Tap on the WhatsApp icon and message us with the details.
                </p>
              </div>
              <p className="mt-3 text-gray-600 text-sm">
                Please share your <span className="font-medium">Order ID</span> along with photos/videos for quicker support.
              </p>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg">A Few Important Notes</h3>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li>• We strongly recommend <span className="font-medium">recording an unboxing video</span> — it helps us resolve issues smoothly</li>
                <li>• Mulyam reserves the right to approve or decline requests that don't meet policy conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-dark text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl">
            Need to Initiate a Return?
          </h2>
          <p className="mt-2 text-white/70">
            We're here to help make it smooth and simple.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20need%20help%20with%20a%20return%20or%20exchange."
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

export default ReturnsPage
