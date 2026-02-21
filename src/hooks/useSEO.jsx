import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Mulyam Jewels'
const SITE_URL = 'https://mulyamjewels.com'
const DEFAULT_DESCRIPTION = 'Shop demi-fine jewelry for women, kids & pets. 18K gold plated, hypoallergenic, waterproof pieces starting at ₹399. Free shipping above ₹1499.'
const DEFAULT_IMAGE = 'https://mulyamjewels.com/images/og-default.jpg'

export function useSEO({ title, description, image, url, type = 'website', product, noindex = false } = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Demi-fine Jewelry for Women, Kids & Pets`
  const metaDescription = description || DEFAULT_DESCRIPTION
  const metaImage = image || DEFAULT_IMAGE
  const canonicalUrl = url ? `${SITE_URL}${url}` : undefined

  // Build JSON-LD for product pages
  let jsonLd = null
  if (product) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || metaDescription,
      image: product.images?.[0] || product.thumbnail || metaImage,
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'INR',
        availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: canonicalUrl,
      },
    }
    if (product.originalPrice && product.originalPrice > product.price) {
      jsonLd.offers.priceSpecification = {
        '@type': 'PriceSpecification',
        price: product.originalPrice,
        priceCurrency: 'INR',
      }
    }
  }

  const SEOHelmet = (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content={type} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Noindex for private pages */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )

  return SEOHelmet
}
