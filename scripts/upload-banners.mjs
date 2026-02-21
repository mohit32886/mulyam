#!/usr/bin/env node

/**
 * Banner Upload Script
 *
 * Uploads hero banner images from /banner folder to Cloudinary
 * and outputs the URLs for use in the codebase.
 */

// Handle SSL cert issues (for development environments)
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

// Banner images to upload (WithoutShopNow versions only)
const BANNER_FILES = [
  {
    file: 'HomeScreenLaptopViewWithoutShopNow.webp',
    key: 'homepage_desktop'
  },
  {
    file: 'HomeScreenWithoutShopNowMobileView.webp',
    key: 'homepage_mobile'
  },
  {
    file: 'DivaScreenLaptopViewWithoutShopNow.webp',
    key: 'diva_desktop'
  },
  {
    file: 'DivaScreenMobileViewWithoutShopNow.webp',
    key: 'diva_mobile'
  }
]

const UPLOAD_FOLDER = 'mulyam/banners'

async function uploadBanner(fileName) {
  const filePath = path.join(__dirname, '../banner', fileName)

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return null
  }

  try {
    console.log(`Uploading: ${fileName}...`)

    const result = await cloudinary.uploader.upload(filePath, {
      folder: UPLOAD_FOLDER,
      public_id: fileName.replace('.webp', ''),
      resource_type: 'image',
      overwrite: true,
      format: 'webp'
    })

    console.log(`  ✓ Uploaded: ${result.secure_url}`)
    return result.secure_url
  } catch (error) {
    console.error(`  ✗ Failed:`, error)
    return null
  }
}

async function main() {
  console.log('=== Banner Upload Script ===\n')
  console.log(`Upload folder: ${UPLOAD_FOLDER}\n`)

  const urls = {}

  for (const banner of BANNER_FILES) {
    const url = await uploadBanner(banner.file)
    if (url) {
      urls[banner.key] = url
    }
  }

  console.log('\n=== Upload Complete ===\n')
  console.log('URLs for bannerImages.js:\n')
  console.log(`export const HERO_IMAGES = {
  homepage: {
    desktop: '${urls.homepage_desktop || 'UPLOAD_FAILED'}',
    mobile: '${urls.homepage_mobile || 'UPLOAD_FAILED'}',
  },
  diva: {
    desktop: '${urls.diva_desktop || 'UPLOAD_FAILED'}',
    mobile: '${urls.diva_mobile || 'UPLOAD_FAILED'}',
  },
}`)
}

main().catch(console.error)
