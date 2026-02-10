/**
 * PlaceholderImage - Jewelry-themed SVG placeholders
 * Used when actual product images are not available
 */

function PlaceholderImage({ category = 'earrings', className = '' }) {
  const baseClasses = `w-full h-full flex items-center justify-center bg-gradient-to-br from-tan/20 to-tan/5 ${className}`

  // SVG icon based on product category
  const renderIcon = () => {
    switch (category) {
      case 'earrings':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-tan/60">
            {/* Hoop earring design */}
            <circle cx="50" cy="45" r="25" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="45" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <circle cx="50" cy="20" r="4" fill="currentColor" />
            <line x1="50" y1="24" x2="50" y2="30" stroke="currentColor" strokeWidth="2" />
          </svg>
        )

      case 'bracelets':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-tan/60">
            {/* Bangle bracelet design */}
            <ellipse cx="50" cy="50" rx="35" ry="20" fill="none" stroke="currentColor" strokeWidth="4" />
            <ellipse cx="50" cy="50" rx="30" ry="16" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            {/* Decorative dots */}
            <circle cx="25" cy="50" r="3" fill="currentColor" />
            <circle cx="50" cy="32" r="3" fill="currentColor" />
            <circle cx="75" cy="50" r="3" fill="currentColor" />
          </svg>
        )

      case 'chains':
      case 'necklaces':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-tan/60">
            {/* Chain necklace design */}
            <path
              d="M20 30 Q50 60 80 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M25 35 Q50 62 75 35"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.5"
            />
            {/* Pendant */}
            <circle cx="50" cy="65" r="8" fill="currentColor" opacity="0.8" />
            <circle cx="50" cy="65" r="4" fill="currentColor" />
          </svg>
        )

      case 'collars':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-tan/60">
            {/* Pet collar design */}
            <ellipse cx="50" cy="50" rx="38" ry="25" fill="none" stroke="currentColor" strokeWidth="5" />
            {/* Buckle */}
            <rect x="75" y="42" width="12" height="16" rx="2" fill="currentColor" opacity="0.8" />
            {/* Tag */}
            <circle cx="50" cy="75" r="8" fill="currentColor" />
            <circle cx="50" cy="75" r="4" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        )

      case 'pendants':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-tan/60">
            {/* Pendant design */}
            <circle cx="50" cy="15" r="3" fill="currentColor" />
            <line x1="50" y1="18" x2="50" y2="35" stroke="currentColor" strokeWidth="2" />
            {/* Heart-shaped pendant */}
            <path
              d="M50 40 C35 35 25 50 50 70 C75 50 65 35 50 40"
              fill="currentColor"
              opacity="0.8"
            />
          </svg>
        )

      case 'rings':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-tan/60">
            {/* Ring design */}
            <ellipse cx="50" cy="55" rx="25" ry="15" fill="none" stroke="currentColor" strokeWidth="4" />
            {/* Gemstone */}
            <polygon points="50,30 40,40 45,50 55,50 60,40" fill="currentColor" opacity="0.8" />
            <polygon points="50,32 43,40 47,48 53,48 57,40" fill="currentColor" />
          </svg>
        )

      default:
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-tan/60">
            {/* Generic jewelry icon - diamond */}
            <polygon
              points="50,15 20,40 50,85 80,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <line x1="20" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="2" />
            <line x1="50" y1="15" x2="35" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="50" y1="15" x2="65" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="35" y1="40" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="65" y1="40" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          </svg>
        )
    }
  }

  return (
    <div className={baseClasses}>
      <div className="flex flex-col items-center gap-2">
        {renderIcon()}
        <span className="text-xs text-tan/40 uppercase tracking-wider font-medium">
          {category}
        </span>
      </div>
    </div>
  )
}

export default PlaceholderImage
