// Test Supabase PostgreSQL connection
import pg from 'pg'

const { Client } = pg

// Connection config - password has @ so we use object format
const client = new Client({
  host: 'db.erajddcokavyzuviikmw.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'supabase@123',
  ssl: { rejectUnauthorized: false }
})

async function testConnection() {
  try {
    console.log('Connecting to Supabase PostgreSQL...')
    await client.connect()
    console.log('✅ Connected successfully!')

    // Test query
    const result = await client.query('SELECT NOW() as current_time')
    console.log('✅ Query successful:', result.rows[0].current_time)

    // List existing tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `)
    console.log('\n📋 Existing tables in public schema:')
    if (tables.rows.length === 0) {
      console.log('   (no tables yet)')
    } else {
      tables.rows.forEach(row => console.log('   -', row.table_name))
    }

    await client.end()
    console.log('\n✅ Connection test complete!')
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}

testConnection()
