// Setup Supabase - Check tables and provide instructions
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const supabaseUrl = 'https://erajddcokavyzuviikmw.supabase.co'
const supabaseKey = 'sb_publishable_fm9bO40dPbmTCZ-Klgbu2g_98kvh0-N'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n')

  const tables = ['products', 'coupons', 'banners', 'settings', 'activity_log', 'featured_products']
  const results = {}

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1)

    if (error?.code === 'PGRST205') {
      results[table] = '❌ Not found'
    } else if (error) {
      results[table] = `⚠️ Error: ${error.message}`
    } else {
      results[table] = '✅ Exists'
    }
  }

  console.log('📋 Table Status:')
  for (const [table, status] of Object.entries(results)) {
    console.log(`   ${table}: ${status}`)
  }

  const missingTables = Object.entries(results).filter(([_, s]) => s.includes('Not found'))

  if (missingTables.length > 0) {
    console.log('\n⚠️  Some tables are missing!')
    console.log('\n📝 To create them:')
    console.log('   1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/erajddcokavyzuviikmw')
    console.log('   2. Click "SQL Editor" in the left sidebar')
    console.log('   3. Copy and paste the contents of:')
    console.log('      supabase/migrations/001_initial_schema.sql')
    console.log('   4. Click "Run" to execute the SQL')
    console.log('\n   Or run: cat supabase/migrations/001_initial_schema.sql | pbcopy')
    console.log('   (This copies the SQL to your clipboard)\n')
    return false
  }

  console.log('\n✅ All tables exist!')
  return true
}

async function main() {
  const tablesExist = await checkTables()

  if (!tablesExist) {
    console.log('\n🔧 Run this script again after creating the tables to seed initial data.')
    process.exit(0)
  }

  // If tables exist, show count
  console.log('\n📊 Current data:')

  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: couponsCount } = await supabase.from('coupons').select('*', { count: 'exact', head: true })
  const { count: bannersCount } = await supabase.from('banners').select('*', { count: 'exact', head: true })

  console.log(`   Products: ${productsCount || 0}`)
  console.log(`   Coupons: ${couponsCount || 0}`)
  console.log(`   Banners: ${bannersCount || 0}`)

  console.log('\n✅ Supabase is ready!')
}

main().catch(console.error)
