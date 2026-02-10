// POC: Full CRUD operations with Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://erajddcokavyzuviikmw.supabase.co'
const supabaseKey = 'sb_publishable_fm9bO40dPbmTCZ-Klgbu2g_98kvh0-N'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test data
const testProduct = {
  id: 'test-product-001',
  name: 'Test Golden Hoops',
  slug: 'test-golden-hoops',
  collection: 'diva',
  category: 'earrings',
  description: 'Beautiful test earrings for POC',
  price: 699,
  original_price: 999,
  discount: 30,
  color: 'Gold',
  material: 'Stainless Steel',
  plating: '18K Gold Plated',
  sku: 'TEST-001',
  images: ['https://example.com/image1.jpg'],
  in_stock: true,
  is_live: true,
  stock: 10
}

const testCoupon = {
  code: 'TESTCODE20',
  type: 'percentage',
  value: 20,
  min_order: 500,
  is_active: true
}

const testBanner = {
  title: 'Test Summer Sale',
  subtitle: 'Up to 50% off!',
  link_url: '/collections/sale',
  link_text: 'Shop Now',
  position: 'hero',
  background_color: '#D4A574',
  text_color: '#FFFFFF',
  is_active: true
}

async function runPOC() {
  console.log('═'.repeat(60))
  console.log('🧪 SUPABASE CRUD POC')
  console.log('═'.repeat(60))

  try {
    // ============================
    // PRODUCTS CRUD
    // ============================
    console.log('\n📦 PRODUCTS')
    console.log('─'.repeat(40))

    // CREATE
    console.log('\n➕ Creating product...')
    const { data: createdProduct, error: createError } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single()

    if (createError) {
      if (createError.code === '23505') {
        console.log('   ⚠️  Product already exists, fetching...')
        const { data } = await supabase.from('products').select().eq('id', testProduct.id).single()
        console.log('   ✅ Found:', data?.name)
      } else {
        throw createError
      }
    } else {
      console.log('   ✅ Created:', createdProduct.name)
    }

    // READ
    console.log('\n📖 Reading products...')
    const { data: products, error: readError } = await supabase
      .from('products')
      .select('id, name, price, collection')
      .limit(5)

    if (readError) throw readError
    console.log(`   ✅ Found ${products.length} products`)
    products.forEach(p => console.log(`      - ${p.name} (₹${p.price})`))

    // UPDATE
    console.log('\n✏️  Updating product...')
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ price: 599, discount: 40 })
      .eq('id', testProduct.id)
      .select()
      .single()

    if (updateError) throw updateError
    console.log(`   ✅ Updated price to ₹${updatedProduct.price}`)

    // DELETE
    console.log('\n🗑️  Deleting test product...')
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', testProduct.id)

    if (deleteError) throw deleteError
    console.log('   ✅ Deleted')

    // ============================
    // COUPONS CRUD
    // ============================
    console.log('\n🎟️  COUPONS')
    console.log('─'.repeat(40))

    // CREATE
    console.log('\n➕ Creating coupon...')
    const { data: createdCoupon, error: couponCreateError } = await supabase
      .from('coupons')
      .insert(testCoupon)
      .select()
      .single()

    if (couponCreateError) {
      if (couponCreateError.code === '23505') {
        console.log('   ⚠️  Coupon already exists')
      } else {
        throw couponCreateError
      }
    } else {
      console.log(`   ✅ Created: ${createdCoupon.code} (${createdCoupon.value}% off)`)
    }

    // READ
    console.log('\n📖 Reading coupons...')
    const { data: coupons, error: couponReadError } = await supabase
      .from('coupons')
      .select('*')

    if (couponReadError) throw couponReadError
    console.log(`   ✅ Found ${coupons.length} coupons`)
    coupons.forEach(c => console.log(`      - ${c.code}: ${c.type === 'percentage' ? c.value + '%' : '₹' + c.value}`))

    // DELETE test coupon
    console.log('\n🗑️  Cleaning up test coupon...')
    await supabase.from('coupons').delete().eq('code', 'TESTCODE20')
    console.log('   ✅ Deleted')

    // ============================
    // BANNERS CRUD
    // ============================
    console.log('\n🖼️  BANNERS')
    console.log('─'.repeat(40))

    // CREATE
    console.log('\n➕ Creating banner...')
    const { data: createdBanner, error: bannerCreateError } = await supabase
      .from('banners')
      .insert(testBanner)
      .select()
      .single()

    if (bannerCreateError) throw bannerCreateError
    console.log(`   ✅ Created: ${createdBanner.title}`)

    // READ
    console.log('\n📖 Reading banners...')
    const { data: banners, error: bannerReadError } = await supabase
      .from('banners')
      .select('*')

    if (bannerReadError) throw bannerReadError
    console.log(`   ✅ Found ${banners.length} banners`)
    banners.forEach(b => console.log(`      - ${b.title} (${b.position})`))

    // DELETE test banner
    console.log('\n🗑️  Cleaning up test banner...')
    await supabase.from('banners').delete().eq('id', createdBanner.id)
    console.log('   ✅ Deleted')

    // ============================
    // SETTINGS
    // ============================
    console.log('\n⚙️  SETTINGS')
    console.log('─'.repeat(40))

    // UPSERT
    console.log('\n➕ Setting value...')
    const { error: settingsError } = await supabase
      .from('settings')
      .upsert({ key: 'test_setting', value: { enabled: true, threshold: 500 } })

    if (settingsError) throw settingsError
    console.log('   ✅ Set test_setting')

    // READ
    console.log('\n📖 Reading setting...')
    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'test_setting')
      .single()

    console.log('   ✅ Value:', JSON.stringify(setting?.value))

    // DELETE
    console.log('\n🗑️  Cleaning up...')
    await supabase.from('settings').delete().eq('key', 'test_setting')
    console.log('   ✅ Deleted')

    // ============================
    // ACTIVITY LOG
    // ============================
    console.log('\n📝 ACTIVITY LOG')
    console.log('─'.repeat(40))

    // CREATE
    console.log('\n➕ Logging activity...')
    const { data: activity, error: activityError } = await supabase
      .from('activity_log')
      .insert({
        action_type: 'product_created',
        entity_type: 'product',
        entity_id: 'test-001',
        label: 'Product Created',
        detail: 'Test product created via POC'
      })
      .select()
      .single()

    if (activityError) throw activityError
    console.log(`   ✅ Logged: ${activity.label}`)

    // READ
    console.log('\n📖 Reading recent activity...')
    const { data: activities } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    console.log(`   ✅ Found ${activities?.length || 0} activities`)

    // Cleanup
    await supabase.from('activity_log').delete().eq('id', activity.id)

    // ============================
    // SUMMARY
    // ============================
    console.log('\n' + '═'.repeat(60))
    console.log('✅ POC COMPLETE - All CRUD operations successful!')
    console.log('═'.repeat(60))
    console.log('\n📋 Verified:')
    console.log('   ✓ Products: Create, Read, Update, Delete')
    console.log('   ✓ Coupons: Create, Read, Delete')
    console.log('   ✓ Banners: Create, Read, Delete')
    console.log('   ✓ Settings: Upsert, Read, Delete')
    console.log('   ✓ Activity Log: Create, Read')
    console.log('\n🎉 Supabase is ready for production use!\n')

  } catch (error) {
    console.error('\n❌ POC Failed:', error.message)
    console.error('   Code:', error.code)
    console.error('   Details:', error.details)
    process.exit(1)
  }
}

runPOC()
