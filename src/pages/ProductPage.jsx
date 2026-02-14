import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../components/layout'
import { Button, Badge, PriceDisplay, ProductCard, PlaceholderImage } from '../components/ui'
import { collections } from '../data/products'
import { useProduct, useRelatedProducts } from '../hooks/useStore'
import { useCart } from '../context/CartContext'
import { ProductSEO, BreadcrumbSchema } from '../seo'
import {
  ChevronRight,
  ChevronLeft,
  Shield,
  Sparkles,
  Droplet,
  Sun,
  MapPin,
  Package,
  RotateCcw,
  MessageCircle,
  Loader2,
  Check,
  X,
  Gem
} from 'lucide-react'

function ProductPage() {
  const { productId } = useParams()
  const [pincode, setPincode] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [deliveryStatus, setDeliveryStatus] = useState(null) // null | 'checking' | 'available' | 'unavailable'
  const { addToCart } = useCart()

  // Touch swipe state for mobile image gallery
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Minimum swipe distance to trigger navigation (in pixels)
  const minSwipeDistance = 50

  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && product?.images?.length > 1) {
      // Swipe left = next image
      setSelectedImageIndex(prev =>
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    } else if (isRightSwipe && product?.images?.length > 1) {
      // Swipe right = previous image
      setSelectedImageIndex(prev =>
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  // Handle pincode check
  const handlePincodeCheck = () => {
    if (pincode.length !== 6) return

    setDeliveryStatus('checking')

    // Simulate API call - in production, replace with actual delivery check API
    setTimeout(() => {
      // For demo: All pincodes starting with 1-8 are serviceable
      const isServiceable = /^[1-8]/.test(pincode)
      setDeliveryStatus(isServiceable ? 'available' : 'unavailable')
    }, 800)
  }

  // Fetch product and related products from Supabase
  const { product, loading, error } = useProduct(productId)
  const { products: relatedProducts } = useRelatedProducts(productId, 4)

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [productId])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-tan" />
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">Product not found</p>
        </div>
      </Layout>
    )
  }

  const collection = collections[product.collection]

  // Only calculate discount if: price > 0 AND originalPrice > 0 AND originalPrice > price
  const hasValidDiscount = product.price > 0 && product.originalPrice > 0 && product.originalPrice > product.price
  const discount = hasValidDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // SEO breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: collection?.name || product.collection?.toUpperCase(), url: `/collections/${product.collection === 'bond' ? 'custom' : product.collection}` },
    { name: product.category, url: `/collections/${product.collection === 'bond' ? 'custom' : product.collection}?category=${product.category}` },
    { name: product.name, url: `/products/${product.id}` }
  ]

  return (
    <Layout>
      <ProductSEO product={product} collection={collection} />
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Breadcrumbs */}
      <nav className="bg-light-gray py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-dark transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${product.collection}`} className="hover:text-dark transition-colors">
              {collection?.name || product.collection.toUpperCase()}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/${product.collection}?category=${product.category}`}
              className="hover:text-dark transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-dark">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Product Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <div
                  className="aspect-square bg-light-gray rounded-lg overflow-hidden touch-pan-y"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {product.images?.length > 0 && !product.images[0].includes('/images/products/') ? (
                    <img
                      src={product.images[selectedImageIndex] || product.images[0]}
                      alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable="false"
                    />
                  ) : (
                    <PlaceholderImage category={product.category} />
                  )}
                </div>

                {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors hidden md:block"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-dark" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors hidden md:block"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-dark" />
                    </button>
                  </>
                )}

                {/* Swipe Indicator Dots - Mobile only */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImageIndex === index
                            ? 'bg-white w-4'
                            : 'bg-white/50'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                {product.isBestseller && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="bestseller">Bestseller</Badge>
                  </div>
                )}

                {/* Image Counter - Desktop only */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 text-white text-xs rounded hidden md:block">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip - Show only if multiple images */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-dark'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-dark">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-dark">
                  Rs {product.price.toLocaleString('en-IN')}
                </span>
                {hasValidDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rs {product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-coral font-medium">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>

              {/* Description */}
              <p className="mt-4 text-gray-600">{product.description}</p>

              {/* Stock Status */}
              <div className="mt-6">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-red-500 font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Trust Badges - Return/Warranty */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-tan" />
                  4 Days Easy Returns and Exchange*
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-tan" />
                  6 Months Warranty
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
                <a
                  href={`https://wa.me/919523882449?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(${product.sku})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="coral" size="lg" className="w-full">
                    <MessageCircle className="w-5 h-5" />
                    Buy on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Feature Badges */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: 'Hypoallergenic', desc: 'Safe for sensitive skin' },
                  { icon: Sparkles, title: '18K Gold Plated', desc: 'Premium finish' },
                  { icon: Droplet, title: 'Waterproof', desc: 'Everyday wear' },
                  { icon: Sun, title: 'Sweatproof', desc: 'Active lifestyle' },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-tan" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pincode Checker */}
              <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ''))
                      setDeliveryStatus(null)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-tan"
                    maxLength={6}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={pincode.length !== 6 || deliveryStatus === 'checking'}
                    onClick={handlePincodeCheck}
                  >
                    {deliveryStatus === 'checking' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Check'
                    )}
                  </Button>
                </div>

                {/* Delivery Status Feedback */}
                {deliveryStatus === 'available' && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Delivery available to {pincode}! Expected in 3-5 business days.
                    </span>
                  </div>
                )}

                {deliveryStatus === 'unavailable' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">
                      Sorry, we don't deliver to {pincode} yet. Try a nearby pincode.
                    </span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Free shipping over Rs 1,499
                  </span>
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    4 Days Easy Returns and Exchange*
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Tips Section */}
      <section className="py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Gem className="w-5 h-5 text-tan" />
            <h2 className="font-display font-semibold text-xl">Jewelry Care Tips</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-light-gray rounded-lg">
              <p className="text-sm font-medium text-dark">Avoid Water</p>
              <p className="text-xs text-gray-500 mt-1">Remove before showering or swimming</p>
            </div>
            <div className="p-3 bg-light-gray rounded-lg">
              <p className="text-sm font-medium text-dark">Perfume First</p>
              <p className="text-xs text-gray-500 mt-1">Apply cosmetics before wearing</p>
            </div>
            <div className="p-3 bg-light-gray rounded-lg">
              <p className="text-sm font-medium text-dark">Store Safely</p>
              <p className="text-xs text-gray-500 mt-1">Keep in pouch away from humidity</p>
            </div>
            <div className="p-3 bg-light-gray rounded-lg">
              <p className="text-sm font-medium text-dark">Clean Gently</p>
              <p className="text-xs text-gray-500 mt-1">Use soft, dry cloth only</p>
            </div>
          </div>
          <Link to="/care-guide" className="inline-flex items-center gap-1 mt-4 text-sm text-tan hover:text-tan-dark transition-colors">
            View full care guide
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display font-semibold text-xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-dark truncate">{product.name}</p>
            <p className="text-lg font-bold text-dark">
              Rs {product.price.toLocaleString('en-IN')}
              {hasValidDiscount && (
                <span className="ml-2 text-sm font-normal text-gray-400 line-through">
                  Rs {product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            className="flex-shrink-0"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-24 md:hidden" />
    </Layout>
  )
}

export default ProductPage
