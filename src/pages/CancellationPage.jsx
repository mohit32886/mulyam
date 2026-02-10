import { Layout } from '../components/layout'
import { XCircle, Clock, CheckCircle, Truck, CreditCard, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui'

function CancellationPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Cancellation Policy
          </h1>
          <p className="mt-4 text-gray-600">
            Changed your mind? We get it — here's how cancellations work.
          </p>
        </div>
      </section>

      {/* Key Info */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Before Dispatch</h3>
              <p className="text-gray-600 text-sm mt-2">
                Cancellations accepted — just reach out quickly!
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">After Dispatch</h3>
              <p className="text-gray-600 text-sm mt-2">
                Cancellations not possible once shipped
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Info */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {/* When Can You Cancel */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-tan" />
                When Can You Cancel?
              </h3>
              <p className="mt-3 text-gray-600">
                Orders can be cancelled <span className="font-medium">before dispatch only</span>.
              </p>
              <p className="mt-2 text-gray-600">
                Once your order is packed and handed over to our courier partner,
                cancellation is no longer possible.
              </p>
              <p className="mt-3 text-gray-500 text-sm italic">
                The jewellery has already started its journey to you!
              </p>
            </div>

            {/* How to Cancel */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                How to Cancel
              </h3>
              <p className="mt-3 text-gray-600">To cancel an order:</p>
              <ol className="mt-2 space-y-2 text-gray-600 list-decimal list-inside">
                <li>Contact us via WhatsApp or Email as soon as possible</li>
                <li>Share your <span className="font-medium">Order ID</span> and reason for cancellation</li>
                <li>We'll confirm if cancellation is still possible</li>
              </ol>
              <p className="mt-3 text-gray-500 text-sm">
                The sooner you reach out, the better — we process orders quickly!
              </p>
            </div>

            {/* After Dispatch */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-coral" />
                What If My Order Is Already Shipped?
              </h3>
              <p className="mt-3 text-gray-600">
                If your order has been dispatched, you'll need to wait for delivery
                and then initiate a return (if eligible) as per our Return Policy.
              </p>
              <p className="mt-2 text-gray-500 text-sm italic">
                We can't intercept packages mid-journey — as much as we wish we could!
              </p>
            </div>

            {/* Refund for Cancellation */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                Refund for Cancelled Orders
              </h3>
              <p className="mt-3 text-gray-600">
                If your cancellation is approved (before dispatch):
              </p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• Full refund will be initiated within <span className="font-medium">24–48 hours</span></li>
                <li>• Amount will be credited to your original payment method</li>
                <li>• Bank processing may take <span className="font-medium">5–7 business days</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-coral">
              <h3 className="font-display font-semibold text-lg">
                Need to Cancel an Order?
              </h3>
              <p className="mt-3 text-gray-600">
                Act fast! Reach out to us right away.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:founders@mulyamjewels.com" className="text-coral hover:underline">
                    founders@mulyamjewels.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">WhatsApp:</span> Tap the icon and message us with your Order ID.
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
            Need to Cancel Quickly?
          </h2>
          <p className="mt-2 text-white/70">
            Message us right away — we'll do our best to help.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20need%20to%20cancel%20my%20order."
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

export default CancellationPage
