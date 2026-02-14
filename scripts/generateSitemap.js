import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import product data
const { products, collections } = await import('../src/data/products.js')

const SITE_URL = 'https://mulyamjewels.com'

// Page priority and change frequency
const pageConfig = {
  home: { priority: 1.0, changefreq: 'daily' },
  collection: { priority: 0.9, changefreq: 'daily' },
  product: { priority: 0.8, changefreq: 'weekly' },
  static: { priority: 0.6, changefreq: 'monthly' }
}

// Static pages
const staticPages = [
  { url: '/', ...pageConfig.home },
  { url: '/about', ...pageConfig.static },
  { url: '/faq', ...pageConfig.static },
  { url: '/contact', ...pageConfig.static },
  { url: '/shipping', ...pageConfig.static },
  { url: '/returns', ...pageConfig.static },
  { url: '/size-guide', ...pageConfig.static },
  { url: '/privacy', ...pageConfig.static },
  { url: '/terms', ...pageConfig.static },
  { url: '/warranty', ...pageConfig.static },
  { url: '/care-guide', ...pageConfig.static },
  { url: '/cancellation', ...pageConfig.static },
  { url: '/collaborations', ...pageConfig.static },
]

// Collection pages
const collectionPages = Object.keys(collections).map(id => ({
  url: `/collections/${id === 'bond' ? 'custom' : id}`,
  ...pageConfig.collection
}))

// Product pages (only in-stock products with valid prices)
const productPages = products
  .filter(p => p.inStock && p.price > 0)
  .map(p => ({
    url: `/products/${p.id}`,
    ...pageConfig.product,
    images: p.images?.slice(0, 3) || [] // Include up to 3 images
  }))

// Generate sitemap XML
function generateSitemap() {
  const allPages = [...staticPages, ...collectionPages, ...productPages]
  const today = new Date().toISOString().split('T')[0]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

  for (const page of allPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`
    // Add images for product pages
    if (page.images && page.images.length > 0) {
      for (const img of page.images) {
        xml += `    <image:image>
      <image:loc>${img}</image:loc>
    </image:image>
`
      }
    }
    xml += `  </url>
`
  }

  xml += '</urlset>'

  return xml
}

// Write sitemap
const sitemap = generateSitemap()
const outputPath = path.resolve(__dirname, '../public/sitemap.xml')
fs.writeFileSync(outputPath, sitemap)

console.log(`Sitemap generated successfully!`)
console.log(`- Static pages: ${staticPages.length}`)
console.log(`- Collection pages: ${collectionPages.length}`)
console.log(`- Product pages: ${productPages.length}`)
console.log(`- Total URLs: ${staticPages.length + collectionPages.length + productPages.length}`)
console.log(`- Output: ${outputPath}`)
