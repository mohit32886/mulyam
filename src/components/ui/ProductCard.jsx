import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Badge from './Badge'
import PriceDisplay from './PriceDisplay'
import PlaceholderImage from './PlaceholderImage'
import { useCart } from '../../context/CartContext'

// Get the highest priority badge for a product
const getProductBadge = (product) => {
  // Priority: Selling Fast > Trending > New Arrival > Bestseller
  if (product.isSellingFast) return { variant: 'sellingFast', text: 'Selling Fast' }
  if (product.isTrending) return { variant: 'trending', text: 'Trending' }
  if (product.isNewArrival) return { variant: 'newArrival', text: 'New' }
  if (product.isBestseller) return { variant: 'bestseller', text: 'Bestseller' }
  return null
}

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const {
    id,
    name,
    price,
    originalPrice,
    images,
    inStock,
    category,
  } = product

  const badge = getProductBadge(product)

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (inStock) {
      addToCart(product)
    }
  }

  return (
    <Link
      to={`/products/${id}`}
      className="group block bg-white rounded-lg overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-light-gray">
        {/* Product Image */}
        <div className="w-full h-full group-hover:scale-105 transition-transform duration-300">
          {images?.[0] && !images[0].includes('/images/products/') ? (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <PlaceholderImage category={category} />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {badge && (
            <Badge variant={badge.variant} size="sm">
              {badge.text}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {!inStock && (
            <Badge variant="outOfStock" size="sm">
              Out of Stock
            </Badge>
          )}
          {inStock && discount > 0 && (
            <Badge variant="discount" size="sm">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Quick Add Button - Always visible on mobile, hover on desktop */}
        {inStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 bg-white rounded-full shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4 text-dark" />
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-body font-medium text-dark text-sm line-clamp-2 group-hover:text-coral transition-colors">
          {name}
        </h3>
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          showDiscount={false}
          size="sm"
          className="mt-1"
        />
      </div>
    </Link>
  )
}

export default ProductCard
