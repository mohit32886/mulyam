function PriceDisplay({
  price,
  originalPrice,
  showDiscount = true,
  size = 'md',
  className = '',
}) {
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
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
      <span className={`${classes.price} text-dark`}>
        ₹{price.toLocaleString('en-IN')}
      </span>
      {hasDiscount && (
        <>
          <span className={`${classes.original} text-gray-400 line-through`}>
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
          {showDiscount && (
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
