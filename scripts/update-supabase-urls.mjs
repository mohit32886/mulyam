#!/usr/bin/env node

/**
 * Update Supabase URLs Script
 *
 * Updates product image URLs in Supabase database to use the new Cloudinary account.
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

// Old and new cloud names
const OLD_CLOUD = 'dltnwnz5i'
const NEW_CLOUD = 'daieejy7c'

async function updateProductUrls() {
  console.log('Fetching products from Supabase...')

  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, images')

  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  console.log(`Found ${products.length} products`)

  let updatedCount = 0

  for (const product of products) {
    if (!product.images || !Array.isArray(product.images)) continue

    let hasOldUrls = false
    const newImages = product.images.map(url => {
      if (url && url.includes(OLD_CLOUD)) {
        hasOldUrls = true
        return url.replace(OLD_CLOUD, NEW_CLOUD)
      }
      return url
    })

    if (hasOldUrls) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', product.id)

      if (updateError) {
        console.error(`Error updating ${product.name}:`, updateError)
      } else {
        console.log(`✓ Updated: ${product.name}`)
        updatedCount++
      }
    }
  }

  console.log(`\nTotal: ${updatedCount} products updated in Supabase`)
}

updateProductUrls().catch(console.error)
