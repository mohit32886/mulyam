import { Helmet } from 'react-helmet-async'
import { SEO_CONFIG } from './config'

/**
 * PageSEO - Reusable component for page-level meta tags
 *
 * @param {string} title - Page title (will be appended with site name)
 * @param {string} description - Meta description (max 160 chars recommended)
 * @param {string} canonical - Canonical URL path (e.g., '/about')
 * @param {string} image - OG image URL
 * @param {string} type - OG type (website, product, article)
 * @param {boolean} noindex - Set to true to prevent indexing
 * @param {object} children - Additional meta tags
 */
export function PageSEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noindex = false,
  children
}) {
  const fullTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle

  const metaDescription = description || SEO_CONFIG.defaultDescription
  const metaImage = image || SEO_CONFIG.defaultImage
  const canonicalUrl = canonical
    ? `${SEO_CONFIG.siteUrl}${canonical}`
    : null

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {children}
    </Helmet>
  )
}

export default PageSEO
