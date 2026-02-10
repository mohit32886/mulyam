#!/usr/bin/env node

/**
 * Cloudinary Migration Script
 *
 * Transfers images from old Cloudinary account (dltnwnz5i) to new account (daieejy7c)
 * by downloading from public URLs and re-uploading.
 */

// Handle SSL cert issues (for development environments)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// New Cloudinary credentials
cloudinary.config({
  cloud_name: 'daieejy7c',
  api_key: '182774687254377',
  api_secret: 'QJfXyCdhwRuGw0trbduKBeXiV5Y'
})

const OLD_CLOUD_NAME = 'dltnwnz5i'
const NEW_CLOUD_NAME = 'daieejy7c'

// Read the cloudinary URLs JSON
const urlsPath = path.join(__dirname, '../src/data/cloudinary-urls.json')
const cloudinaryUrls = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'))

// Store URL mappings
const urlMapping = {}
let successCount = 0
let errorCount = 0

/**
 * Extract public_id from Cloudinary URL
 */
function extractPublicId(url) {
  // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}
  const match = url.match(/\/upload\/v\d+\/(.+?)(?:\.[a-z]+)?$/i)
  if (match) {
    return match[1]
  }
  // Try without version
  const match2 = url.match(/\/upload\/(.+?)(?:\.[a-z]+)?$/i)
  return match2 ? match2[1] : null
}

/**
 * Upload image from URL to new Cloudinary account
 */
async function migrateImage(oldUrl, publicId) {
  try {
    console.log(`  Migrating: ${publicId}`)

    const result = await cloudinary.uploader.upload(oldUrl, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image'
    })

    const newUrl = result.secure_url
    urlMapping[oldUrl] = newUrl
    successCount++
    console.log(`  ✓ Success: ${newUrl}`)
    return newUrl
  } catch (error) {
    console.error(`  ✗ Error migrating ${publicId}:`, error.message || JSON.stringify(error))
    if (error.http_code) {
      console.error(`    HTTP Code: ${error.http_code}`)
    }
    if (error.error) {
      console.error(`    Details: ${JSON.stringify(error.error)}`)
    }
    errorCount++
    return null
  }
}

/**
 * Process all URLs in a category
 */
async function processCategory(collection, category, items) {
  console.log(`\n--- ${collection}/${category} (${items.length} items) ---`)

  for (const item of items) {
    const publicId = extractPublicId(item.url)
    if (publicId) {
      await migrateImage(item.url, publicId)
    } else {
      console.error(`  ✗ Could not extract public_id from: ${item.url}`)
      errorCount++
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('='.repeat(60))
  console.log('Cloudinary Migration: dltnwnz5i -> daieejy7c')
  console.log('='.repeat(60))

  // Process each collection
  for (const [collection, categories] of Object.entries(cloudinaryUrls)) {
    if (typeof categories !== 'object' || categories.note) {
      console.log(`\nSkipping ${collection}: ${categories.note || 'Not an object'}`)
      continue
    }

    for (const [category, items] of Object.entries(categories)) {
      if (Array.isArray(items)) {
        await processCategory(collection, category, items)
      }
    }
  }

  // Save URL mapping
  const mappingPath = path.join(__dirname, 'url-mapping.json')
  fs.writeFileSync(mappingPath, JSON.stringify(urlMapping, null, 2))

  console.log('\n' + '='.repeat(60))
  console.log('Migration Complete!')
  console.log(`  ✓ Success: ${successCount}`)
  console.log(`  ✗ Errors: ${errorCount}`)
  console.log(`  Mapping saved to: ${mappingPath}`)
  console.log('='.repeat(60))
}

// Run migration
migrate().catch(console.error)
