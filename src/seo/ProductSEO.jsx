import { Helmet } from 'react-helmet-async'
import { SEO_CONFIG } from './config'
import { generateMetaDescription, generateProductDescription } from './descriptions/productDescriptions'

/**
 * ProductSEO - Complete SEO for product pages including meta tags and Product schema
 *
 * @param {object} product - Product object with all product data
 * @param {object} collection - Collection object (optional)
 */
export function ProductSEO({ product, collection }) {
  if (!product) return null

  const description = generateMetaDescription(product, collection)
  const fullDescription = generateProductDescription(product, collection)
  const productUrl = `${SEO_CONFIG.siteUrl}/products/${product.id}`
  const collectionName = collection?.name || product.collection?.toUpperCase() || 'Mulyam'

  // Product Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: fullDescription,
    image: product.images || [],
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Mulyam Jewels'
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Mulyam Jewels'
      }
    }
  }

  // Add material if available
  if (product.material) {
    productSchema.material = product.material
  }

  // Add color if available
  if (product.color) {
    productSchema.color = product.color
  }

  // Add original price as discount context
  if (product.originalPrice && product.originalPrice > product.price) {
    productSchema.offers.priceValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString().split('T')[0]
  }

  const pageTitle = `${product.name} - ${collectionName} Collection`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{`${pageTitle} | ${SEO_CONFIG.siteName}`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={productUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={product.images?.[0] || SEO_CONFIG.defaultImage} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />

      {/* Product-specific OG tags */}
      <meta property="product:price:amount" content={product.price} />
      <meta property="product:price:currency" content="INR" />
      {product.inStock && <meta property="product:availability" content="in stock" />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={product.images?.[0] || SEO_CONFIG.defaultImage} />

      {/* Product Schema */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  )
}

export default ProductSEO
