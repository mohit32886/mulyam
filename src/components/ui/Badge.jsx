const variants = {
  discount: 'bg-red-500 text-white',
  bestseller: 'bg-caramel text-white',
  newArrival: 'bg-taupe text-white',
  trending: 'bg-caramel-dark text-white',
  sellingFast: 'bg-dark text-white',
  outOfStock: 'bg-gray-500 text-white',
  feature: 'bg-beige text-dark',
  tag: 'bg-cream text-dark border border-beige',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

function Badge({
  children,
  variant = 'feature',
  size = 'md',
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default Badge
