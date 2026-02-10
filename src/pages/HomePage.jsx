import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Layout } from '../components/layout'
import { Button, ProductCard } from '../components/ui'
import { useFeaturedProducts } from '../hooks'
import { collections } from '../data/products'

const storeCards = [
  {
    id: 'diva',
    name: 'DIVA',
    subtitle: "Women's Collection",
    description: 'Elegant jewelry for the modern woman',
    path: '/diva',
    image: '/images/collections/diva.webp',
  },
  {
    id: 'mini',
    name: 'MINI',
    subtitle: "Kids' Collection",
    description: 'Safe & playful pieces for little ones',
    path: '/mini',
    image: '/images/collections/mini.webp',
  },
  {
    id: 'paws',
    name: 'PAWS',
    subtitle: 'Pet Collection',
    description: 'Custom accessories for your pets',
    path: '/paws',
    image: '/images/collections/paws.webp',
  },
  {
    id: 'bond',
    name: 'BOND',
    subtitle: 'Personalized',
    description: 'Jewelry that tells your story',
    path: '/collections/custom',
    image: '/images/collections/bond.webp',
  },
]

function HomePage() {
  const { products: featuredProducts, loading } = useFeaturedProducts(8)

  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center text-center bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <span className="text-sm uppercase tracking-wider text-white/80">
            Curated for You
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl mt-4 text-white">
            Unleash Your Inner{' '}
            <span className="text-coral">DIVA</span>
          </h1>
          <p className="mt-4 text-white/90 max-w-xl mx-auto">
            Discover elegant, statement jewelry crafted for the modern woman.
            From everyday essentials to show-stopping pieces.
          </p>
          <Link to="/diva">
            <Button variant="primary" size="lg" className="mt-8">
              Shop Mulyam DIVA
            </Button>
          </Link>
          <p className="mt-6 text-white/70 text-sm">
            Trusted by happy customers across India
          </p>
        </div>
      </section>

      {/* Shop by Store */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-semibold text-2xl md:text-3xl">
              Shop by Store
            </h2>
            <p className="mt-2 text-gray-600">
              Discover pieces crafted for every member of your family
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {storeCards.map((store) => (
              <Link
                key={store.id}
                to={store.path}
                className="relative aspect-[4/5] rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={store.image}
                  alt={store.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase tracking-wider opacity-80">
                    {store.subtitle}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-semibold mt-1">{store.name}</h3>
                  <p className="text-xs md:text-sm text-white/80 mt-1">
                    {store.description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-semibold text-2xl md:text-3xl">
                Featured Products
              </h2>
              <p className="text-gray-600">Handpicked just for you</p>
            </div>
            <Link to="/diva" className="text-sm text-coral hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-tan" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* The Demi-Fine Standard */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl md:text-3xl">
            The Demi-Fine Standard
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { title: 'Lasting Brilliance', desc: 'Stays true over time' },
              { title: 'Gentle on Skin', desc: 'Hypoallergenic care' },
              { title: 'Sweatproof', desc: 'Wear it anywhere' },
              { title: 'Endlessly Versatile', desc: 'Layer, stack, gift' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="px-6 py-3 bg-white border border-gray-200 rounded-full"
              >
                <span className="font-medium text-sm">{feature.title}</span>
                <span className="text-gray-500 text-sm ml-2">{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-sm uppercase tracking-wider text-white/60">
            Let's Connect
          </span>
          <h2 className="font-display font-semibold text-2xl md:text-4xl mt-4">
            Find your next{' '}
            <span className="text-coral">favorite piece</span>
          </h2>
          <p className="mt-4 text-white/70">
            Chat with us to place your order or follow along for new arrivals,
            styling tips, and behind-the-scenes moments.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919523882449?text=Hi!%20I'm%20interested%20in%20Mulyam%20Jewels."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-coral text-white px-6 py-3 font-medium hover:bg-coral-dark transition-colors"
            >
              Chat on WhatsApp
            </a>
            <a
              href="https://instagram.com/mulyam_jewels"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 font-medium hover:bg-white/10 transition-colors"
            >
              @mulyam_jewels
            </a>
          </div>
          <p className="mt-8 text-white/50 text-sm">
            Free shipping on orders above Rs 1,499 | Easy 7-day returns
          </p>
        </div>
      </section>
    </Layout>
  )
}

export default HomePage
