#!/usr/bin/env node

/**
 * Update Product Images in Supabase
 *
 * Updates existing products with new SKUCODED image URLs
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

async function updateImages() {
  console.log('='.repeat(60))
  console.log('Updating Product Images in Supabase')
  console.log('='.repeat(60))

  // Get all products from database
  const { data: dbProducts, error } = await supabase
    .from('products')
    .select('id, sku, name, images')

  if (error) {
    console.error('Error fetching products:', error.message)
    return
  }

  console.log(`Found ${dbProducts.length} products in database\n`)

  let updatedCount = 0

  for (const product of dbProducts) {
    const skuData = productsData[product.sku]

    if (!skuData) {
      console.log(`  - No new images for: ${product.sku}`)
      continue
    }

    const newImages = skuData.images.map(img => img.url)

    // Update only if images changed
    const currentImages = product.images || []
    const imagesChanged = JSON.stringify(currentImages.sort()) !== JSON.stringify(newImages.sort())

    if (!imagesChanged && currentImages.length > 0) {
      console.log(`  - Images unchanged for: ${product.sku}`)
      continue
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: newImages })
      .eq('id', product.id)

    if (updateError) {
      console.error(`  ✗ Error updating ${product.sku}:`, updateError.message)
    } else {
      console.log(`  ✓ Updated: ${product.name} (${newImages.length} images)`)
      updatedCount++
    }

    await new Promise(r => setTimeout(r, 100))
  }

  console.log('\n' + '='.repeat(60))
  console.log(`Complete! Updated ${updatedCount} products`)
  console.log('='.repeat(60))
}

updateImages().catch(console.error)
