import { Layout } from '../components/layout'
import { Button } from '../components/ui'
import { MessageCircle, Instagram, Mail, MapPin, Clock } from 'lucide-react'

function ContactPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Get in Touch
          </h1>
          <p className="mt-4 text-gray-600">
            We'd love to hear from you! Reach out with questions, feedback, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919523882449?text=Hi!%20I'd%20like%20to%20get%20in%20touch%20with%20Mulyam%20Jewels."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-8 rounded-lg border border-gray-200 hover:border-coral hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display font-semibold text-xl">Chat on WhatsApp</h3>
              <p className="text-gray-600 mt-2">
                Fastest way to reach us! Get instant support and place orders directly.
              </p>
              <p className="text-coral font-medium mt-4">+91 95238 82449</p>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/mulyam_jewels"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-8 rounded-lg border border-gray-200 hover:border-coral hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                <Instagram className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-display font-semibold text-xl">Follow on Instagram</h3>
              <p className="text-gray-600 mt-2">
                New arrivals, styling tips, and behind-the-scenes moments.
              </p>
              <p className="text-coral font-medium mt-4">@mulyam_jewels</p>
            </a>

            {/* Email */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-display font-semibold text-xl">Email Us</h3>
              <p className="text-gray-600 mt-2">
                For partnerships, bulk orders, or detailed inquiries.
              </p>
              <p className="text-coral font-medium mt-4">hello@mulyamjewels.com</p>
            </div>

            {/* Location */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-tan" />
              </div>
              <h3 className="font-display font-semibold text-xl">Based In</h3>
              <p className="text-gray-600 mt-2">
                Proudly designed and shipped from India.
              </p>
              <p className="text-coral font-medium mt-4">India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-tan" />
            <h2 className="font-display font-semibold text-xl">Support Hours</h2>
          </div>
          <p className="text-gray-600">
            Monday - Saturday: 10:00 AM - 7:00 PM IST
          </p>
          <p className="text-gray-600 mt-1">
            Sunday: Closed
          </p>
          <p className="text-gray-500 text-sm mt-4">
            WhatsApp messages are responded to within 2-4 hours during business hours.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl">
            Ready to Start Shopping?
          </h2>
          <p className="mt-2 text-gray-600">
            Explore our collections and find your perfect piece.
          </p>
          <div className="mt-6">
            <a
              href="https://wa.me/919523882449?text=Hi!%20I'm%20interested%20in%20browsing%20Mulyam%20Jewels."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="coral" size="lg">
                <MessageCircle className="w-5 h-5" />
                Start Chatting
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default ContactPage
