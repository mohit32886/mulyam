// Seed Supabase with initial product data
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const supabaseUrl = 'https://erajddcokavyzuviikmw.supabase.co'
const supabaseKey = 'sb_publishable_fm9bO40dPbmTCZ-Klgbu2g_98kvh0-N'

const supabase = createClient(supabaseUrl, supabaseKey)

// Read products from the JS file
// We'll import it dynamically
async function getProducts() {
  const { products } = await import('../src/data/products.js')
  return products
}

// Transform product from JS format to Supabase format (camelCase to snake_case)
function transformProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.id, // Use id as slug
    collection: product.collection,
    category: product.category,
    description: product.description || null,
    short_description: product.shortDescription || null,
    price: product.price,
    original_price: product.originalPrice || null,
    cost_price: product.costPrice || null,
    discount: product.originalPrice && product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null,
    color: product.color || 'Gold',
    material: product.material || 'Stainless Steel',
    plating: product.plating || '18K Gold Plated',
    size: product.size || null,
    weight: product.weight || null,
    sku: product.sku || null,
    images: product.images || [],
    in_stock: product.inStock !== false,
    is_live: true,
    is_bestseller: product.isBestseller || false,
    is_new: product.isNew || false,
    stock: product.stock || 10,
    tag: product.tag || null,
  }
}

async function seedProducts() {
  console.log('═'.repeat(60))
  console.log('🌱 SEEDING SUPABASE WITH PRODUCTS')
  console.log('═'.repeat(60))

  try {
    // Check if tables exist
    const { error: tableError } = await supabase.from('products').select('id').limit(1)
    if (tableError?.code === 'PGRST205') {
      console.log('\n❌ Products table does not exist!')
      console.log('   Please run the SQL migration first.')
      console.log('   See: supabase/migrations/001_initial_schema.sql')
      process.exit(1)
    }

    // Get existing products count
    const { count: existingCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    console.log(`\n📊 Existing products in database: ${existingCount || 0}`)

    if (existingCount > 0) {
      console.log('\n⚠️  Database already has products.')
      console.log('   Options:')
      console.log('   1. Run with --force to delete all and re-seed')
      console.log('   2. Run with --merge to add only new products')

      const args = process.argv.slice(2)
      if (args.includes('--force')) {
        console.log('\n🗑️  Deleting all existing products...')
        await supabase.from('products').delete().neq('id', '')
        console.log('   ✅ Deleted')
      } else if (!args.includes('--merge')) {
        console.log('\n   Exiting. Use --force or --merge flag.')
        process.exit(0)
      }
    }

    // Get products from static file
    const products = await getProducts()
    console.log(`\n📦 Products to seed: ${products.length}`)

    // Transform products
    const transformedProducts = products.map(transformProduct)

    // Insert in batches of 50
    const batchSize = 50
    let inserted = 0
    let skipped = 0
    let errors = 0

    for (let i = 0; i < transformedProducts.length; i += batchSize) {
      const batch = transformedProducts.slice(i, i + batchSize)

      const { data, error } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'id' })
        .select()

      if (error) {
        console.error(`   ❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message)
        errors += batch.length
      } else {
        inserted += data?.length || batch.length
        console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} products`)
      }
    }

    console.log('\n' + '─'.repeat(40))
    console.log('📊 Summary:')
    console.log(`   ✅ Inserted/Updated: ${inserted}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ❌ Errors: ${errors}`)

    // Verify
    const { count: finalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    console.log(`\n📊 Total products in database: ${finalCount}`)

    // Show sample
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('name, collection, price')
      .limit(5)

    console.log('\n📋 Sample products:')
    sampleProducts?.forEach(p => {
      console.log(`   - ${p.name} (${p.collection}) - ₹${p.price}`)
    })

    console.log('\n' + '═'.repeat(60))
    console.log('✅ SEEDING COMPLETE!')
    console.log('═'.repeat(60))

  } catch (err) {
    console.error('\n❌ Error:', err.message)
    process.exit(1)
  }
}

seedProducts()
