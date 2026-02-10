import { Layout } from '../components/layout'
import { Users, Gift, Percent, Camera, Heart, Star, MessageCircle, Instagram } from 'lucide-react'
import { Button } from '../components/ui'

function CollaborationsPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-brand-gradient text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white">
            Collaborate With Mulyam
          </h1>
          <p className="mt-4 text-white/90">
            Love jewellery? Love creating content? Let's work together.
          </p>
          <p className="mt-2 text-white/70 text-sm">
            We're always looking for creators who share our love for everyday elegance.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display font-semibold text-2xl text-center mb-8">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-tan/20 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-tan" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Free Products</h3>
              <p className="text-gray-600 text-sm mt-2">
                Receive complimentary Mulyam pieces for your content
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-coral/20 rounded-full flex items-center justify-center">
                <Percent className="w-6 h-6 text-coral" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Exclusive Discounts</h3>
              <p className="text-gray-600 text-sm mt-2">
                Special codes to share with your audience
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Feature Opportunities</h3>
              <p className="text-gray-600 text-sm mt-2">
                Get featured on our social media and website
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-semibold text-2xl text-center mb-8">
            Who We're Looking For
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-tan" />
                Content Creators
              </h3>
              <p className="mt-3 text-gray-600">
                If you create lifestyle, fashion, or beauty content and love accessorizing,
                we'd love to hear from you. Quality over quantity — we value authentic creators
                with engaged audiences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Micro & Nano Influencers
              </h3>
              <p className="mt-3 text-gray-600">
                Big following isn't everything. We love working with smaller creators who
                have genuine connections with their followers. If your audience trusts you,
                that's what matters most.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-coral" />
                Jewellery Enthusiasts
              </h3>
              <p className="mt-3 text-gray-600">
                Already a Mulyam customer who loves our pieces? Share your genuine experience
                and become part of our creator community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-semibold text-2xl text-center mb-8">
            How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-tan text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-dark">Reach Out</h3>
                <p className="text-gray-600 mt-1">
                  Send us a message on WhatsApp or Instagram with a brief intro and links to your profiles.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-tan text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-dark">We Review</h3>
                <p className="text-gray-600 mt-1">
                  Our team will check out your content and see if we're a good fit for each other.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-tan text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-dark">Collaborate</h3>
                <p className="text-gray-600 mt-1">
                  If selected, we'll discuss the collaboration details and send you some sparkle!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-tan text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-dark">Create & Share</h3>
                <p className="text-gray-600 mt-1">
                  Create authentic content, share with your audience, and shine together!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-amber-50 p-6 rounded-lg">
            <h3 className="font-display font-semibold text-lg">A Quick Note</h3>
            <p className="mt-3 text-gray-700">
              We receive many collaboration requests, so we can't partner with everyone.
              But don't let that stop you from reaching out — we review every message
              and appreciate your interest in Mulyam!
            </p>
            <p className="mt-2 text-gray-600 text-sm italic">
              Authenticity is key. We don't work with accounts that buy followers or engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-dark text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl">
            Ready to Collaborate?
          </h2>
          <p className="mt-2 text-white/70">
            Drop us a message — let's create something beautiful together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a
              href="https://wa.me/919523882449?text=Hi!%20I'm%20interested%20in%20collaborating%20with%20Mulyam."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="coral" size="lg">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </Button>
            </a>
            <a
              href="https://instagram.com/mulyam_jewels"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Instagram className="w-5 h-5" />
                DM on Instagram
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default CollaborationsPage
