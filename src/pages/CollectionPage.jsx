import { useState, useMemo } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Layout } from '../components/layout'
import { ProductCard, Badge } from '../components/ui'
import { collections } from '../data/products'
import { useCollectionProducts } from '../hooks'
import { Droplet, Shield, Sparkles, Sun, Loader2 } from 'lucide-react'

const featureIcons = {
  'Hypoallergenic': Shield,
  '18K Gold Plated': Sparkles,
  'Waterproof': Droplet,
  'Sweatproof': Sun,
  'Safe for Kids': Shield,
  'Lightweight': Sparkles,
  'Pet Safe': Shield,
  'Durable': Sparkles,
  'Adjustable': Sun,
  'Custom Engraving': Sparkles,
  'Premium Quality': Shield,
  'Gift Ready': Sparkles,
}

function CollectionPage() {
  const { collectionId: paramId } = useParams()
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Derive collection ID from URL path
  const collectionId = useMemo(() => {
    const path = location.pathname
    // Handle new /collections/:id format
    if (path.startsWith('/collections/')) {
      const id = path.replace('/collections/', '')
      // Map 'custom' to 'bond' for the BOND collection
      return id === 'custom' ? 'bond' : id
    }
    // Legacy URLs (redirects should handle these, but just in case)
    if (path === '/diva') return 'diva'
    if (path === '/mini') return 'mini'
    if (path === '/paws') return 'paws'
    return paramId
  }, [location.pathname, paramId])

  // Get collection metadata
  const collection = collections[collectionId]

  // Fetch products from Supabase
  const { products: allProducts, loading, error } = useCollectionProducts(collectionId)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category))]
    return ['all', ...cats]
  }, [allProducts])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory)
    }

    // Helper to check if product has a badge
    const hasBadge = (p) => p.isSellingFast || p.isTrending || p.isNewArrival || p.isBestseller

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // newest - keep original order
        break
    }

    // Always sort badged products to top (after primary sort)
    result.sort((a, b) => {
      const aBadge = hasBadge(a)
      const bBadge = hasBadge(b)
      if (aBadge && !bBadge) return -1
      if (!aBadge && bBadge) return 1
      return 0
    })

    return result
  }, [allProducts, activeCategory, sortBy])

  if (!collection) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">Collection not found</p>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-tan" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-700">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-tan mb-6 block">
            The Collection
          </span>
          <h1 className="font-display font-light text-5xl md:text-6xl text-white tracking-wide">
            {collection.name}
          </h1>
          <p className="mt-6 text-white/70 max-w-xl mx-auto text-lg">
            {collection.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6">
            {collection.features.map((feature, index) => (
              <span key={feature} className="flex items-center gap-2 text-white/60 text-sm">
                <span className="w-2 h-2 rounded-full bg-coral"></span>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-semibold text-xl">All Pieces</h2>
              <p className="text-gray-500 text-sm">{filteredProducts.length} products</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? 'bg-dark text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden md:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded bg-white"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quality Promise Section */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Our Promise</span>
            <h2 className="font-display font-semibold text-2xl mt-2">Quality You Can Trust</h2>
            <p className="mt-2 text-gray-600 max-w-xl mx-auto">
              Every piece is crafted with premium materials, ensuring lasting beauty and comfort for even the most sensitive skin.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'Hypoallergenic', desc: 'Safe for sensitive skin' },
              { icon: Sparkles, title: '18K Gold Plated', desc: 'Premium finish' },
              { icon: Droplet, title: 'Waterproof', desc: 'Everyday wear' },
              { icon: Sun, title: 'Sweatproof', desc: 'Active lifestyle' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <div className="w-10 h-10 rounded-full bg-tan/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-tan" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-12 md:py-16 bg-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display font-semibold text-2xl">Need Help Choosing?</h2>
          <p className="mt-2 text-white/70">
            Our team is here to help you find the perfect piece
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/919523882449?text=Hi!%20I%20need%20help%20choosing%20jewelry%20from%20${collection.name}%20collection.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-coral text-white px-6 py-3 font-medium hover:bg-coral-dark transition-colors"
            >
              💬 Chat on WhatsApp
            </a>
            <a
              href="https://instagram.com/mulyam_jewels"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 font-medium hover:bg-white/10 transition-colors"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default CollectionPage
