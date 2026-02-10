import { Layout } from '../components/layout'
import { Sparkles, Droplets, Wind, Moon, AlertTriangle, Heart, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui'

function CareGuidePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Product Care Guide
          </h1>
          <p className="mt-4 text-gray-600">
            A little love goes a long way — and so does good jewellery.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            Follow these simple tips to keep your Mulyam pieces shining for longer.
          </p>
        </div>
      </section>

      {/* Care Tips Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Avoid Water */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Avoid Water & Moisture</h3>
              <p className="mt-2 text-gray-600">
                Remove your jewellery before showering, swimming, or washing hands.
                Moisture can affect the finish over time.
              </p>
            </div>

            {/* Perfume & Chemicals */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Wind className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Apply Perfume First</h3>
              <p className="mt-2 text-gray-600">
                Let perfumes, lotions, and sprays dry completely before putting on
                your jewellery. Chemicals can cause discoloration.
              </p>
            </div>

            {/* Storage */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Moon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Store It Right</h3>
              <p className="mt-2 text-gray-600">
                Keep your pieces in a cool, dry place — ideally in a pouch or box.
                Avoid leaving them exposed to air and humidity.
              </p>
            </div>

            {/* Remove During Activity */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-4">Remove During Activities</h3>
              <p className="mt-2 text-gray-600">
                Take off jewellery before workouts, sleeping, cooking, or any
                activity that involves sweat or physical contact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cleaning Section */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-tan" />
              <h2 className="font-display font-semibold text-xl">How to Clean Your Jewellery</h2>
            </div>
            <div className="mt-4 space-y-3 text-gray-600">
              <p>
                <span className="font-medium">For a quick clean:</span> Use a soft,
                dry cloth to gently wipe away any dust or fingerprints.
              </p>
              <p>
                <span className="font-medium">For a deeper clean:</span> Dampen a soft
                cloth with a little water (no soap), wipe gently, and dry immediately.
              </p>
              <p className="text-gray-500 text-sm italic">
                Avoid using harsh chemicals, alcohol-based cleaners, or abrasive materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display font-semibold text-2xl text-center mb-8">
            Quick Do's & Don'ts
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Do's */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg text-green-700">Do's</h3>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Store in a dry, airtight pouch or box
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Put on jewellery last, after dressing up
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Wipe gently with a soft cloth after wearing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Handle with care — it's precious!
                </li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-display font-semibold text-lg text-red-700">Don'ts</h3>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Don't expose to water, sweat, or humidity
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Don't spray perfume directly on jewellery
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Don't sleep, shower, or exercise wearing it
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Don't use chemical cleaners or rough cloths
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-12 md:py-16 bg-tan/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Heart className="w-10 h-10 text-coral mx-auto" />
          <h2 className="font-display font-semibold text-xl mt-4">
            Why Care Matters
          </h2>
          <p className="mt-3 text-gray-600">
            With the right care, your Mulyam jewellery can stay beautiful for years.
            Think of it as a small daily ritual — one that keeps your sparkle intact.
          </p>
          <p className="mt-2 text-gray-500 text-sm italic">
            Treat it well, and it'll return the favour.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-dark text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl">
            Have Care Questions?
          </h2>
          <p className="mt-2 text-white/70">
            We're happy to help you keep your jewellery shining.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20have%20a%20question%20about%20jewellery%20care."
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

export default CareGuidePage
