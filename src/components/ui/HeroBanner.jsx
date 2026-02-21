import OptimizedImage from './OptimizedImage'

/**
 * HeroBanner - Responsive hero section with separate mobile/desktop images
 *
 * Features:
 * - Separate images for mobile and desktop viewports
 * - Uses OptimizedImage for Cloudinary srcset optimization
 * - Supports overlay content (children) for buttons/text
 * - Responsive breakpoint switching at md (768px)
 * - Full-width mode: image fills width, height is auto (no cropping)
 *
 * @param {string} desktopImage - Cloudinary URL for desktop (768px+)
 * @param {string} mobileImage - Cloudinary URL for mobile (<768px)
 * @param {string} alt - Alt text for accessibility
 * @param {string} minHeight - Minimum height class (e.g., "min-h-[60vh]") - ignored in fullWidth mode
 * @param {string} objectFit - Image fit: "cover" (crop to fill) or "contain" (show full image)
 * @param {boolean} fullWidth - If true, image fills width with auto height (no cropping)
 * @param {string} className - Additional container classes
 * @param {ReactNode} children - Overlay content (buttons, text)
 */
function HeroBanner({
  desktopImage,
  mobileImage,
  alt,
  minHeight = 'min-h-[60vh]',
  objectFit = 'cover',
  fullWidth = false,
  className = '',
  children,
}) {
  // Full width mode: image determines height, no cropping
  if (fullWidth) {
    return (
      <section className={`relative ${className}`}>
        {/* Desktop Image - hidden on mobile */}
        <OptimizedImage
          src={desktopImage}
          alt={alt}
          className="hidden md:block w-full h-auto"
          priority={true}
          sizes="100vw"
        />

        {/* Mobile Image - hidden on desktop */}
        <OptimizedImage
          src={mobileImage}
          alt={alt}
          className="block md:hidden w-full h-auto"
          priority={true}
          sizes="100vw"
        />

        {/* Content overlay */}
        {children && (
          <div className="absolute inset-0 z-10">
            {children}
          </div>
        )}
      </section>
    )
  }

  // Fixed height mode with object-fit
  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover'

  return (
    <section className={`relative overflow-hidden ${minHeight} ${className}`}>
      {/* Desktop Image - hidden on mobile */}
      <OptimizedImage
        src={desktopImage}
        alt={alt}
        className={`hidden md:block absolute inset-0 w-full h-full ${fitClass}`}
        priority={true}
        sizes="100vw"
      />

      {/* Mobile Image - hidden on desktop */}
      <OptimizedImage
        src={mobileImage}
        alt={alt}
        className={`block md:hidden absolute inset-0 w-full h-full ${fitClass}`}
        priority={true}
        sizes="100vw"
      />

      {/* Content overlay */}
      {children && (
        <div className="absolute inset-0 z-10">
          {children}
        </div>
      )}
    </section>
  )
}

export default HeroBanner
