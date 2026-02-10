#!/usr/bin/env node

/**
 * Update URLs Script
 *
 * Replaces old Cloudinary URLs with new ones in data files using the mapping.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read URL mapping
const mappingPath = path.join(__dirname, 'url-mapping.json')
const urlMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'))

// Files to update
const filesToUpdate = [
  path.join(__dirname, '../src/data/cloudinary-urls.json'),
  path.join(__dirname, '../src/data/products.js'),
]

let totalReplacements = 0

for (const filePath of filesToUpdate) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping (not found): ${filePath}`)
    continue
  }

  let content = fs.readFileSync(filePath, 'utf-8')
  let replacements = 0

  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    const count = (content.match(new RegExp(escapeRegExp(oldUrl), 'g')) || []).length
    if (count > 0) {
      content = content.replaceAll(oldUrl, newUrl)
      replacements += count
    }
  }

  if (replacements > 0) {
    fs.writeFileSync(filePath, content)
    console.log(`✓ Updated ${path.basename(filePath)}: ${replacements} URLs replaced`)
    totalReplacements += replacements
  } else {
    console.log(`- No changes: ${path.basename(filePath)}`)
  }
}

console.log(`\nTotal: ${totalReplacements} URLs updated`)

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
