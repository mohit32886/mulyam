import { Layout } from '../components/layout'
import { Package, Truck, MapPin, Clock, AlertCircle, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui'

function ShippingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Shipping & Delivery
          </h1>
          <p className="mt-4 text-gray-600">
            Because ordering jewellery online should feel exciting — not stressful.
          </p>
        </div>
      </section>

      {/* Shipping Highlights */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-tan/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-tan" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Pan India Shipping</h3>
              <p className="text-gray-600 text-sm mt-2">
                We currently ship across India
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">1-3 Days Processing</h3>
              <p className="text-gray-600 text-sm mt-2">
                Each piece is checked & packed with care
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">3-7 Days Delivery</h3>
              <p className="text-gray-600 text-sm mt-2">
                Good things are worth waiting for
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Info */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {/* Processing Time */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-tan" />
                Processing Time
              </h3>
              <p className="mt-3 text-gray-600">
                Once you place an order, we take <span className="font-medium">1–3 business days</span> to
                process and pack it. Each piece is checked, packed securely, and prepared for dispatch.
              </p>
              <p className="mt-2 text-gray-600">
                You'll receive a shipping confirmation message/email once your order leaves us.
              </p>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Delivery Timeline
              </h3>
              <p className="mt-3 text-gray-600">
                After dispatch, delivery usually takes <span className="font-medium">3–7 business days</span>,
                depending on your location.
              </p>
              <p className="mt-2 text-gray-500 text-sm italic">
                Remote areas may take slightly longer — we appreciate your patience.
              </p>
            </div>

            {/* Shipping Charges */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg">Shipping Charges</h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Standard shipping charges (if applicable) will be clearly shown at checkout</li>
                <li>• Any ongoing free shipping offers will be mentioned on the website or product pages</li>
              </ul>
              <p className="mt-3 font-medium text-dark">No surprise fees. Everrrrr.</p>
            </div>

            {/* Order Tracking */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg">Order Tracking</h3>
              <p className="mt-3 text-gray-600">Once shipped, you'll receive:</p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>• A tracking link to follow your order</li>
                <li>• Updates from our delivery partners until it reaches you</li>
              </ul>
              <p className="mt-3 text-gray-500 text-sm italic">
                If tracking hasn't updated for a while — don't panic. Couriers sometimes take a nap.
                We're happy to check for you.
              </p>
            </div>

            {/* Delays */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Delays & Unexpected Situations
              </h3>
              <p className="mt-3 text-gray-600">
                While we do our best to deliver on time, delays may occur due to:
              </p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• Weather conditions</li>
                <li>• Courier partner issues</li>
                <li>• Festivals, strikes, or natural events</li>
              </ul>
              <p className="mt-3 text-gray-600">
                In such cases, we'll keep you informed and support you until delivery is completed.
              </p>
            </div>

            {/* Address Issues */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg">Incorrect Address / Failed Delivery</h3>
              <p className="mt-3 text-gray-600">
                Please double-check your shipping details before placing the order.
              </p>
              <p className="mt-2 text-gray-600">If an order is:</p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• Returned due to an incorrect address</li>
                <li>• Unclaimed or refused at delivery</li>
              </ul>
              <p className="mt-2 text-gray-600 font-medium">Re-shipping charges may apply.</p>
            </div>

            {/* Damaged Package */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-coral">
              <h3 className="font-display font-semibold text-lg">Damaged Package on Arrival</h3>
              <p className="mt-3 text-gray-600">If your package looks tampered or damaged:</p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• Please <span className="font-medium">do not accept the delivery</span></li>
                <li>• Contact us immediately with photos/videos</li>
                <li>• For easy resolutions, please take a video of your unboxing</li>
              </ul>
              <p className="mt-3 text-gray-600 font-medium">We'll take it from there.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-dark text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl">
            Still Have Questions?
          </h2>
          <p className="mt-2 text-white/70">
            Our support team is just a message away.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20have%20a%20question%20about%20shipping."
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

export default ShippingPage
