/**
 * OptimizedImage - Responsive image component with Cloudinary transformations
 *
 * Features:
 * - Automatic srcset generation for responsive images
 * - Cloudinary URL transformations for different viewport sizes
 * - Lazy loading by default
 * - Width and height attributes for CLS prevention
 */
function OptimizedImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  loading = 'lazy',
  width,
  height,
  priority = false,
  aspectRatio,
  ...props
}) {
  // If no src provided, return null
  if (!src) return null

  /**
   * Transform Cloudinary URL with specific parameters
   * @param {string} url - Original Cloudinary URL
   * @param {string} transform - Cloudinary transformation string
   * @returns {string} Transformed URL
   */
  const getCloudinaryUrl = (url, transform) => {
    // Only transform Cloudinary URLs
    if (!url?.includes('cloudinary.com')) return url

    // Split URL at /upload/ to insert transformation
    const parts = url.split('/upload/')
    if (parts.length !== 2) return url

    return `${parts[0]}/upload/${transform}/${parts[1]}`
  }

  /**
   * Check if URL is a Cloudinary URL
   */
  const isCloudinaryUrl = src?.includes('cloudinary.com')

  // Generate srcset for responsive images (only for Cloudinary URLs)
  const srcSet = isCloudinaryUrl
    ? [
        `${getCloudinaryUrl(src, 'w_400,q_auto,f_auto')} 400w`,
        `${getCloudinaryUrl(src, 'w_600,q_auto,f_auto')} 600w`,
        `${getCloudinaryUrl(src, 'w_800,q_auto,f_auto')} 800w`,
        `${getCloudinaryUrl(src, 'w_1000,q_auto,f_auto')} 1000w`,
        `${getCloudinaryUrl(src, 'w_1200,q_auto,f_auto')} 1200w`,
      ].join(', ')
    : undefined

  // Default src (optimized version)
  const optimizedSrc = isCloudinaryUrl
    ? getCloudinaryUrl(src, 'w_800,q_auto,f_auto')
    : src

  // Calculate aspect ratio style if provided
  const aspectRatioStyle = aspectRatio
    ? { aspectRatio: aspectRatio }
    : undefined

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : loading}
      width={width}
      height={height}
      decoding={priority ? 'sync' : 'async'}
      style={aspectRatioStyle}
      {...props}
    />
  )
}

export default OptimizedImage
