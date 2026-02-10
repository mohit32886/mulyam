import { Link } from 'react-router-dom'
import { Layout } from '../components/layout'
import { Button } from '../components/ui'
import { Heart, Shield, Sparkles, Users, Droplets, Gem, CheckCircle } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Quality First',
    description:
      'Every piece is crafted with premium 18K gold plating on stainless steel, ensuring lasting beauty and durability.',
  },
  {
    icon: Heart,
    title: 'Skin-Safe',
    description:
      'Hypoallergenic materials that are gentle on even the most sensitive skin. No irritation, just beauty.',
  },
  {
    icon: Sparkles,
    title: 'Everyday Luxury',
    description:
      'Anti-tarnish coating means your jewellery stays brilliant with proper care.',
  },
  {
    icon: Users,
    title: 'For Everyone',
    description:
      'From elegant pieces for women to playful jewelry for kids and custom accessories for pets.',
  },
]

const stats = [
  { value: '500+', label: 'Happy Customers' },
  { value: '50+', label: 'Unique Designs' },
  { value: '10+', label: 'Collections' },
  { value: '4.8', label: 'Star Rating' },
]

const qualityFeatures = [
  {
    icon: Gem,
    title: 'Anti-Tarnish Gold Stainless Steel',
    description: 'Our jewellery is crafted using high-quality stainless steel with a protective anti-tarnish layer — designed to resist discoloration and keep its shine longer.',
  },
  {
    icon: Droplets,
    title: 'Built for Everyday Wear',
    description: 'While our pieces are made to be durable, they still need a little TLC. Avoid prolonged exposure to water, sweat, perfumes, and chemicals for the best results.',
  },
  {
    icon: Shield,
    title: '6-Month Warranty',
    description: 'We stand behind our craftsmanship with a 6-month warranty against manufacturing defects.',
  },
]

function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-sm uppercase tracking-wider text-white/80">
            Our Story
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mt-4">
            Crafting Beauty with{' '}
            <span className="text-coral">Intention</span>
          </h1>
          <p className="mt-4 text-white/90 max-w-xl mx-auto">
            Mulyam Jewels was born from a simple belief: everyone deserves to
            wear beautiful jewelry that's gentle on skin and built to last.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-tan/20 rounded-lg flex items-center justify-center">
              <span className="text-8xl">✨</span>
            </div>
            <div>
              <h2 className="font-display font-semibold text-2xl md:text-3xl">
                The Beginning
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                What started as a passion for creating jewelry that combines
                elegance with everyday wearability has grown into a brand loved
                by customers across India.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We noticed a gap in the market - beautiful jewelry that was
                either too expensive or too delicate for daily wear. We set out
                to change that by creating demi-fine pieces that look luxurious
                but can handle your busy lifestyle.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Today, Mulyam Jewels offers collections for women, kids, and
                even pets - because every member of your family deserves to
                sparkle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="py-16 md:py-24 bg-tan/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-wider text-gray-500">
              Our Promise
            </span>
            <h2 className="font-display font-semibold text-2xl md:text-3xl mt-2">
              Quality Assurance & Anti-Tarnish Promise
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              At Mulyam, we believe good jewellery should last — and so should
              its shine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {qualityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg"
              >
                <div className="w-12 h-12 bg-tan/20 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-tan" />
                </div>
                <h3 className="font-display font-semibold text-lg mt-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              What We Promise
            </h3>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li>• Every piece is inspected for quality before dispatch</li>
              <li>• You'll receive exactly what you see — no surprises</li>
              <li>• If something's off, we'll make it right</li>
            </ul>
          </div>

          <div className="mt-6 bg-amber-50 p-6 rounded-lg">
            <h3 className="font-display font-semibold text-lg">A Gentle Reminder</h3>
            <p className="mt-3 text-gray-700">
              No jewellery lasts forever without care. Follow our Care Guide to extend
              the life and shine of your Mulyam pieces.
            </p>
            <p className="mt-2 text-gray-600 text-sm italic">
              A little love goes a long way — just like good jewellery.
            </p>
            <Link to="/care-guide" className="inline-block mt-4">
              <Button variant="outline" size="sm">
                View Care Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-wider text-gray-500">
              What We Believe
            </span>
            <h2 className="font-display font-semibold text-2xl md:text-3xl mt-2">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white p-6 rounded-lg text-center"
              >
                <div className="w-12 h-12 mx-auto bg-tan/10 rounded-full flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-tan" />
                </div>
                <h3 className="font-display font-semibold text-lg mt-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-4xl md:text-5xl text-coral">
                  {stat.value}
                </div>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-dark text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-sm uppercase tracking-wider text-white/60">
            Our Mission
          </span>
          <h2 className="font-display font-semibold text-2xl md:text-4xl mt-4">
            To make demi-fine jewelry accessible to everyone
          </h2>
          <p className="mt-6 text-white/70 leading-relaxed">
            We believe that beautiful, high-quality jewelry shouldn't come with
            a luxury price tag. Our mission is to create pieces that bring joy
            to everyday moments while being gentle on your skin and the
            environment.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl md:text-3xl">
            Ready to find your perfect piece?
          </h2>
          <p className="mt-4 text-gray-600">
            Explore our collections and discover jewelry that's made for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/diva">
              <Button variant="primary" size="lg">
                Shop DIVA
              </Button>
            </Link>
            <a
              href="https://wa.me/919523882449?text=Hi!%20I'd%20like%20to%20know%20more%20about%20Mulyam%20Jewels."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="coral" size="lg">
                Chat with Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default AboutPage
