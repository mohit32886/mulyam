#!/usr/bin/env node

/**
 * Add New Products to Supabase
 *
 * Adds new bracelet products (DB-0020 to DB-0026, DB-0033 to DB-0039) to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Supabase credentials
const supabaseUrl = 'https://erajddcokavyzuviikmw.supabase.co'
const supabaseKey = 'sb_publishable_fm9bO40dPbmTCZ-Klgbu2g_98kvh0-N'

const supabase = createClient(supabaseUrl, supabaseKey)

// Read SKUCODED products data
const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'skucoded-products.json'), 'utf-8')
)

// New products to add (those not in existing database)
const newProducts = [
  {
    sku: 'MLM-DB-0020',
    name: 'Aurora Bead Bracelet',
    description: 'A stunning bracelet featuring aurora-inspired beads with a delicate gold finish.',
    price: 1299,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0021',
    name: 'Moonlight Chain Bracelet',
    description: 'Elegant chain bracelet with moonlight-inspired links that catch the light beautifully.',
    price: 1499,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0022',
    name: 'Diamond Cluster Bracelet',
    description: 'A luxurious bracelet featuring clustered crystals for maximum sparkle.',
    price: 1799,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0023',
    name: 'Pearl Cascade Bangle',
    description: 'Classic bangle adorned with cascading pearl accents.',
    price: 1399,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0024',
    name: 'Gleam Link Bracelet',
    description: 'Modern link bracelet with a gleaming polished finish.',
    price: 1199,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0025',
    name: 'Radiant Stone Band',
    description: 'Band bracelet featuring radiant stone settings in a sleek design.',
    price: 1599,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0026',
    name: 'Crystal Line Bracelet',
    description: 'Elegant bracelet with a continuous line of crystals for everyday glamour.',
    price: 1499,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0033',
    name: 'Emerald Twist Bracelet',
    description: 'Twisted design bracelet with emerald-colored accents.',
    price: 1699,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0034',
    name: 'Classic Wave Bangle',
    description: 'Timeless wave-patterned bangle with a polished gold finish.',
    price: 1399,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0035',
    name: 'Luxe Diamond Band',
    description: 'Premium band bracelet studded with diamond-like crystals.',
    price: 1899,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0036',
    name: 'Starlight Cuff Bracelet',
    description: 'Open cuff bracelet with starlight-inspired crystal detailing.',
    price: 1599,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0037',
    name: 'Sunset Glow Bangle',
    description: 'Warm-toned bangle that captures the essence of a golden sunset.',
    price: 1299,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0038',
    name: 'Crystal Weave Bracelet',
    description: 'Intricately woven bracelet with crystal embellishments.',
    price: 1499,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
  {
    sku: 'MLM-DB-0039',
    name: 'Golden Rope Bangle',
    description: 'Classic rope design bangle in lustrous gold finish.',
    price: 1199,
    category: 'bracelets',
    collection: 'diva',
    is_live: true,
    in_stock: true,
  },
]

async function addProducts() {
  console.log('='.repeat(60))
  console.log('Adding New Products to Supabase')
  console.log('='.repeat(60))

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const product of newProducts) {
    // Get images from SKUCODED data
    const skuData = productsData[product.sku]
    const images = skuData ? skuData.images.map(img => img.url) : []

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .single()

    if (existing) {
      console.log(`  - Skipping ${product.sku}: Already exists`)
      skipCount++
      continue
    }

    // Generate id and slug from name
    const id = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Add product with images
    const { error } = await supabase.from('products').insert({
      id,
      slug: id,
      ...product,
      images,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error(`  ✗ Error adding ${product.sku}:`, error.message)
      errorCount++
    } else {
      console.log(`  ✓ Added: ${product.name} (${product.sku})`)
      successCount++
    }

    // Small delay
    await new Promise(r => setTimeout(r, 200))
  }

  console.log('\n' + '='.repeat(60))
  console.log('Complete!')
  console.log(`  ✓ Added: ${successCount}`)
  console.log(`  - Skipped: ${skipCount}`)
  console.log(`  ✗ Errors: ${errorCount}`)
  console.log('='.repeat(60))
}

addProducts().catch(console.error)
