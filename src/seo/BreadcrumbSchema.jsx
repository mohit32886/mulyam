import { Helmet } from 'react-helmet-async'
import { SEO_CONFIG } from './config'

/**
 * BreadcrumbSchema - JSON-LD structured data for breadcrumb navigation
 *
 * @param {Array} items - Array of breadcrumb items
 *   Each item: { name: string, url: string }
 *   Example: [{ name: 'Home', url: '/' }, { name: 'DIVA', url: '/collections/diva' }]
 */
export function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.siteUrl}${item.url}`
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

export default BreadcrumbSchema
