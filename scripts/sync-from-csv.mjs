// Sync products from CSV (source of truth) to products.js
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// CSV column indices (0-based)
const COL = {
  SKU: 0,
  SLUG: 1,
  NAME: 2,
  SELLING_PRICE: 3,
  COMPARE_PRICE: 4,
  COST_PRICE: 5,
  COLLECTION: 6,
  CATEGORY: 7,
  SUB_CATEGORY: 8,
  SIZE: 9,
  DIMENSIONS: 10,
  COLOR: 11,
  MATERIAL: 12,
  PLATING: 13,
  WEIGHT: 14,
  STOCK: 15,
  TAG: 16,
  DESCRIPTION: 17,
  SHORT_DESCRIPTION: 18,
  IMAGES: 19,
  IMAGE_COUNT: 20,
  STATUS: 21,
}

// Load skucoded-products.json for image URL mapping
const skucodedPath = path.join(__dirname, 'skucoded-products.json')
const skucodedProducts = JSON.parse(readFileSync(skucodedPath, 'utf-8'))

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())

  return result
}

// Get image URLs for a SKU from skucoded-products.json
function getImageUrls(sku, imageRefs) {
  const skuData = skucodedProducts[sku]
  if (!skuData || !skuData.images || skuData.images.length === 0) {
    console.warn(`  Warning: No images found for SKU ${sku}`)
    return []
  }

  // If no specific refs, return all images for the SKU
  if (!imageRefs || imageRefs.length === 0) {
    return skuData.images.map(img => img.url)
  }

  // Parse image refs to get variant numbers
  // Format: "MLM-DB-0001_00|MLM-DB-0001_02" → ["00", "02"]
  const requestedVariants = imageRefs.map(ref => {
    const match = ref.match(/_(\d+)$/)
    return match ? match[1] : null
  }).filter(Boolean)

  if (requestedVariants.length === 0) {
    // No specific variants, return all
    return skuData.images.map(img => img.url)
  }

  // Match requested variants to available images
  const urls = []
  for (const variant of requestedVariants) {
    // Try to find matching variant (could be "00", "0", "1", etc.)
    const normalizedVariant = variant.replace(/^0+/, '') || '0'
    const image = skuData.images.find(img => {
      const imgVariant = img.variant.replace(/^0+/, '') || '0'
      return imgVariant === normalizedVariant || img.variant === variant
    })
    if (image) {
      urls.push(image.url)
    }
  }

  // If no matches found, return all images
  return urls.length > 0 ? urls : skuData.images.map(img => img.url)
}

// Generate product name if not provided
function generateName(sku, category) {
  // Extract the suffix like "DB-0001" from "MLM-DB-0001"
  const suffix = sku.replace('MLM-', '')

  if (category === 'bracelets') {
    return `Bracelet ${suffix}`
  } else if (category === 'earrings') {
    return `Earring ${suffix}`
  }
  return suffix
}

// Main sync function
function syncFromCSV() {
  console.log('═'.repeat(60))
  console.log('📊 SYNCING PRODUCTS FROM CSV')
  console.log('═'.repeat(60))

  // Read CSV file
  const csvPath = path.join(__dirname, '..', 'product_catalogue_data - product_catalogue_data.csv')
  const csvContent = readFileSync(csvPath, 'utf-8')
  const lines = csvContent.split('\n')

  console.log(`\n📄 CSV file: ${lines.length} lines (including header)`)

  // Skip header
  const dataLines = lines.slice(1)

  const products = []
  let skipped = 0

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim()
    if (!line) continue

    const cols = parseCSVLine(line)
    const sku = cols[COL.SKU]?.trim()

    // Skip empty SKU rows
    if (!sku) {
      console.log(`  ⏭️  Skipping row ${i + 2}: Empty SKU`)
      skipped++
      continue
    }

    // Fix known issues
    let actualSku = sku
    if (sku === 'MLM-DB-0039') {
      // Row 55: SKU shows DB-0039 but should be DB-0038
      actualSku = 'MLM-DB-0038'
      console.log(`  🔧 Fixed row ${i + 2}: ${sku} → ${actualSku}`)
    }

    const slug = cols[COL.SLUG]?.trim() || actualSku.toLowerCase()
    const name = cols[COL.NAME]?.trim()
    const category = cols[COL.CATEGORY]?.trim() || 'bracelets'
    const collection = cols[COL.COLLECTION]?.trim()?.toLowerCase() || 'diva'
    const status = cols[COL.STATUS]?.trim()?.toLowerCase()

    // Parse image references
    const imageField = cols[COL.IMAGES]?.trim() || ''
    const imageRefs = imageField ? imageField.split('|').map(s => s.trim()).filter(Boolean) : []

    // Get actual image URLs
    const images = getImageUrls(actualSku, imageRefs)

    // Parse numeric fields
    const price = parseInt(cols[COL.SELLING_PRICE]) || 0
    const originalPrice = parseInt(cols[COL.COMPARE_PRICE]) || null
    const costPrice = parseInt(cols[COL.COST_PRICE]) || null
    const stock = parseInt(cols[COL.STOCK]) || 0

    const product = {
      id: slug,
      name: name || generateName(actualSku, category),
      price,
      originalPrice,
      costPrice,
      collection,
      category,
      material: cols[COL.MATERIAL]?.trim() || 'Stainless Steel',
      plating: cols[COL.PLATING]?.trim() || '18K Gold Plated',
      color: cols[COL.COLOR]?.trim() || 'Gold',
      size: cols[COL.SIZE]?.trim() || null,
      sku: actualSku,
      description: cols[COL.DESCRIPTION]?.trim() || null,
      images,
      inStock: stock > 0,
      stock,
      isBestseller: false,
      isNew: status === 'new',
    }

    products.push(product)
  }

  console.log(`\n✅ Parsed ${products.length} products (skipped ${skipped})`)

  // Group by category for stats
  const byCategory = {}
  products.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1
  })
  console.log('\n📊 By category:')
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`)
  })

  // Check for products without images
  const noImages = products.filter(p => p.images.length === 0)
  if (noImages.length > 0) {
    console.log(`\n⚠️  ${noImages.length} products without images:`)
    noImages.forEach(p => console.log(`   - ${p.sku}`))
  }

  return products
}

// Generate products.js content
function generateProductsJS(products) {
  const lines = [
    'export const products = [',
  ]

  // Group products by category for better organization
  const bracelets = products.filter(p => p.category === 'bracelets')
  const earrings = products.filter(p => p.category === 'earrings')

  function addProducts(prods, comment) {
    lines.push(`  // ${comment}`)
    prods.forEach((p, idx) => {
      lines.push('  {')
      lines.push(`    id: "${p.id}",`)
      lines.push(`    name: "${p.name}",`)
      lines.push(`    price: ${p.price},`)
      lines.push(`    originalPrice: ${p.originalPrice || 'null'},`)
      lines.push(`    collection: "${p.collection}",`)
      lines.push(`    category: "${p.category}",`)
      lines.push(`    material: "${p.material}",`)
      lines.push(`    plating: "${p.plating}",`)
      lines.push(`    color: "${p.color}",`)
      if (p.size) {
        lines.push(`    size: "${p.size}",`)
      }
      lines.push(`    sku: "${p.sku}",`)
      if (p.description) {
        lines.push(`    description: "${p.description.replace(/"/g, '\\"')}",`)
      }
      lines.push(`    images: ${JSON.stringify(p.images)},`)
      lines.push(`    inStock: ${p.inStock},`)
      lines.push(`    stock: ${p.stock},`)
      lines.push(`    isBestseller: ${p.isBestseller},`)
      lines.push(`    isNew: ${p.isNew},`)
      lines.push('  },')
    })
  }

  addProducts(bracelets, `DIVA Collection - Bracelets (${bracelets.length})`)
  lines.push('')
  addProducts(earrings, `DIVA Collection - Earrings (${earrings.length})`)

  lines.push(']')
  lines.push('')

  // Add collections metadata
  lines.push(`export const collections = {
  diva: {
    id: "diva",
    name: "DIVA",
    title: "Mulyam DIVA",
    subtitle: "Women's Collection",
    description: "Elegant jewelry crafted for the modern woman",
    longDescription: "Elegant jewelry crafted for the modern woman. From everyday essentials to show-stopping pieces.",
    features: ["Hypoallergenic", "18K Gold Plated", "Waterproof"],
  },
  mini: {
    id: "mini",
    name: "MINI",
    title: "Mulyam MINI",
    subtitle: "Kids' Collection",
    description: "Safe & playful pieces for little ones",
    longDescription: "Adorable jewelry designed for little ones. Safe, comfortable, and perfect for making every day special.",
    features: ["Hypoallergenic", "Safe for Kids", "Lightweight"],
  },
  paws: {
    id: "paws",
    name: "PAWS",
    title: "Mulyam PAWS",
    subtitle: "Pet Collection",
    description: "Custom accessories for your pets",
    longDescription: "Stylish accessories designed for your furry friends. Safe, comfortable, and Instagram-worthy.",
    features: ["Pet Safe", "Durable", "Adjustable"],
  },
  bond: {
    id: "bond",
    name: "BOND",
    title: "Mulyam BOND",
    subtitle: "Personalized",
    description: "Jewelry that tells your story",
    longDescription: "Create meaningful pieces that tell your unique story. Perfect for gifting or treating yourself.",
    features: ["Custom Engraving", "Premium Quality", "Gift Ready"],
  },
}`)
  lines.push('')

  // Add helper functions
  lines.push(`// Helper functions
export const getProductsByCollection = (collectionId) => {
  return products.filter((p) => p.collection === collectionId)
}

export const getProductsByCategory = (collectionId, category) => {
  return products.filter(
    (p) => p.collection === collectionId && p.category === category
  )
}

export const getProductById = (id) => {
  return products.find((p) => p.id === id)
}

export const getProductBySku = (sku) => {
  return products.find((p) => p.sku === sku)
}

export const getBestsellers = (limit = 8) => {
  return products.filter((p) => p.isBestseller).slice(0, limit)
}

export const getNewArrivals = (limit = 8) => {
  return products.filter((p) => p.isNew).slice(0, limit)
}

export const getRelatedProducts = (productId, limit = 4) => {
  const product = getProductById(productId)
  if (!product) return []

  return products
    .filter((p) => p.id !== productId && p.collection === product.collection)
    .slice(0, limit)
}
`)

  return lines.join('\n')
}

// Main execution
const products = syncFromCSV()

// Generate and save products.js
const productsJS = generateProductsJS(products)
const outputPath = path.join(__dirname, '..', 'src', 'data', 'products.js')
writeFileSync(outputPath, productsJS)

console.log(`\n✅ Generated: ${outputPath}`)
console.log(`   Total products: ${products.length}`)

// Also output JSON for reference
const jsonPath = path.join(__dirname, 'synced-products.json')
writeFileSync(jsonPath, JSON.stringify(products, null, 2))
console.log(`   JSON backup: ${jsonPath}`)

console.log('\n' + '═'.repeat(60))
console.log('✅ SYNC COMPLETE!')
console.log('═'.repeat(60))
