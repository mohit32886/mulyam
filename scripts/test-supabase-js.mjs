// Test Supabase JS client connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://erajddcokavyzuviikmw.supabase.co'
const supabaseKey = 'sb_publishable_fm9bO40dPbmTCZ-Klgbu2g_98kvh0-N'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔄 Testing Supabase connection...\n')

  try {
    // Test 1: Check if we can reach Supabase
    const { data, error } = await supabase.from('products').select('*').limit(1)

    if (error) {
      if (error.code === '42P01') {
        console.log('✅ Connection successful! (products table does not exist yet)')
        console.log('   We need to create the database schema.\n')
      } else {
        console.log('⚠️ Connection works but got error:', error.message)
        console.log('   Error code:', error.code)
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('   Products table exists with', data?.length || 0, 'rows')
    }

    // Test 2: Try to create a test table and insert data
    console.log('\n🔄 Testing write capability...')

    // Try to insert into a test table
    const testResult = await supabase
      .from('_test_connection')
      .insert({ test: 'hello', created_at: new Date().toISOString() })
      .select()

    if (testResult.error) {
      console.log('⚠️ Write test:', testResult.error.message)
      console.log('   (This is expected if table does not exist or RLS is enabled)')
    } else {
      console.log('✅ Write successful!')
      // Clean up
      await supabase.from('_test_connection').delete().eq('test', 'hello')
    }

    console.log('\n✅ Supabase POC complete!')
    console.log('\n📋 Next steps:')
    console.log('   1. Create database schema (products, coupons, banners, settings tables)')
    console.log('   2. Set up Row Level Security (RLS) policies')
    console.log('   3. Create Supabase client in React app')
    console.log('   4. Migrate localStorage logic to Supabase queries')

  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

testConnection()
