/**
 * PriceDisplay Component
 *
 * PRICING LOGIC:
 * - Case 1 (Discounted): If Selling Price < MRP → Show MRP (striked), Selling Price, Discount %
 * - Case 2 (No MRP): If MRP = 0 or empty → Only show Selling Price
 * - Case 3 (No Discount): If MRP = Selling Price → Only show Selling Price
 *
 * Validation:
 * - Never show ₹0 or 0 on frontend
 * - Only show discount if MRP > Selling Price (both must be > 0)
 */
function PriceDisplay({
  price,
  originalPrice,
  showDiscount = true,
  size = 'md',
  className = '',
}) {
  // Validate: Don't render if price is 0 or invalid
  if (!price || price <= 0) {
    return null
  }

  // Only show discount if: originalPrice exists, is > 0, AND is greater than selling price
  const hasValidDiscount = originalPrice && originalPrice > 0 && originalPrice > price

  const discountPercent = hasValidDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const sizeClasses = {
    sm: {
      price: 'text-sm font-semibold',
      original: 'text-xs',
      discount: 'text-xs',
    },
    md: {
      price: 'text-base font-semibold',
      original: 'text-sm',
      discount: 'text-sm',
    },
    lg: {
      price: 'text-xl font-bold',
      original: 'text-base',
      discount: 'text-base',
    },
  }

  const classes = sizeClasses[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Selling Price - always shown if valid */}
      <span className={`${classes.price} text-dark`}>
        ₹{price.toLocaleString('en-IN')}
      </span>

      {/* MRP (striked) and Discount - only if valid discount exists */}
      {hasValidDiscount && (
        <>
          <span className={`${classes.original} text-gray-400 line-through`}>
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
          {showDiscount && discountPercent > 0 && (
            <span className={`${classes.discount} text-green-600`}>
              {discountPercent}% off
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default PriceDisplay
