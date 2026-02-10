#!/usr/bin/env node

/**
 * Upload SKUCODED Assets Script
 *
 * Uploads all images from SKUCODED folder to Cloudinary
 * and generates URL mapping for products.
 */

// Handle SSL cert issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Cloudinary credentials
cloudinary.config({
  cloud_name: 'daieejy7c',
  api_key: '182774687254377',
  api_secret: 'QJfXyCdhwRuGw0trbduKBeXiV5Y'
})

const SKUCODED_PATH = '/Users/mohitgupta/Desktop/dev/personal/SKUCODED'

// Results storage
const uploadedUrls = {}
const productGroups = {}
let successCount = 0
let errorCount = 0

/**
 * Parse filename to extract SKU info
 * MLMDB0001_0.png -> { type: 'bracelets', sku: 'MLM-DB-0001', variant: '0' }
 */
function parseFilename(filename) {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '')

  // Match pattern: MLMDB0001 or MLMDB0001_1 or MLMDE0001
  const match = nameWithoutExt.match(/^(MLM)(DB|DE)(\d+)(?:_(\d+|[a-z]+))?/i)

  if (!match) {
    return null
  }

  const [, prefix, type, number, variant] = match
  const typeFolder = type.toUpperCase() === 'DB' ? 'bracelets' : 'earrings'
  const paddedNumber = number.padStart(4, '0')
  const sku = `${prefix}-${type.toUpperCase()}-${paddedNumber}`

  return {
    type: typeFolder,
    sku,
    variant: variant || '00',
    publicId: `mulyam/diva/${typeFolder}/${sku}_${variant || '00'}`
  }
}

/**
 * Upload single image to Cloudinary
 */
async function uploadImage(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      format: 'webp',
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    })

    return result.secure_url
  } catch (error) {
    throw new Error(error.message || JSON.stringify(error))
  }
}

/**
 * Main upload function
 */
async function uploadAll() {
  console.log('='.repeat(60))
  console.log('SKUCODED Assets Upload to Cloudinary')
  console.log('='.repeat(60))

  // Get all files
  const files = fs.readdirSync(SKUCODED_PATH)
    .filter(f => /\.(png|jpg|jpeg|webp|heic|avif)$/i.test(f))
    .sort()

  console.log(`\nFound ${files.length} image files\n`)

  for (const filename of files) {
    const filePath = path.join(SKUCODED_PATH, filename)
    const parsed = parseFilename(filename)

    if (!parsed) {
      console.log(`  ✗ Skipping (invalid name): ${filename}`)
      errorCount++
      continue
    }

    console.log(`  Uploading: ${filename} -> ${parsed.publicId}`)

    try {
      const url = await uploadImage(filePath, parsed.publicId)

      // Store URL
      uploadedUrls[filename] = url

      // Group by SKU for products
      if (!productGroups[parsed.sku]) {
        productGroups[parsed.sku] = {
          type: parsed.type,
          images: []
        }
      }
      productGroups[parsed.sku].images.push({
        variant: parsed.variant,
        url
      })

      console.log(`  ✓ Success: ${url}`)
      successCount++

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300))
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`)
      errorCount++
    }
  }

  // Sort images within each product group
  for (const sku of Object.keys(productGroups)) {
    productGroups[sku].images.sort((a, b) => a.variant.localeCompare(b.variant))
  }

  // Save results
  const uploadedPath = path.join(__dirname, 'skucoded-uploads.json')
  fs.writeFileSync(uploadedPath, JSON.stringify(uploadedUrls, null, 2))

  const productsPath = path.join(__dirname, 'skucoded-products.json')
  fs.writeFileSync(productsPath, JSON.stringify(productGroups, null, 2))

  console.log('\n' + '='.repeat(60))
  console.log('Upload Complete!')
  console.log(`  ✓ Success: ${successCount}`)
  console.log(`  ✗ Errors: ${errorCount}`)
  console.log(`  URLs saved to: ${uploadedPath}`)
  console.log(`  Products saved to: ${productsPath}`)
  console.log('='.repeat(60))
}

// Run upload
uploadAll().catch(console.error)
