import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing')
console.log('Service Key:', process.env.SUPABASE_SERVICE_KEY !== 'your-supabase-service-role-key-here' ? '✅ Present' : '⚠️  Using placeholder')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
async function testConnection() {
  try {
    console.log('\n📡 Testing database connection...')
    
    // Try to query a table (will fail if tables don't exist yet)
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('⚠️  Connection successful, but tables not created yet')
        console.log('   Run the SQL schema in Supabase SQL Editor first!')
      } else if (error.message.includes('JWT')) {
        console.log('❌ Invalid credentials')
      } else {
        console.log('⚠️  Error:', error.message)
      }
    } else {
      console.log('✅ Database connection successful!')
      console.log('✅ Tables exist and are accessible')
    }

    // Test storage bucket
    console.log('\n📦 Testing storage connection...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.log('⚠️  Storage error:', bucketError.message)
    } else {
      console.log('✅ Storage connection successful!')
      const productsBucket = buckets.find(b => b.name === 'products')
      if (productsBucket) {
        console.log('✅ Products bucket exists')
      } else {
        console.log('⚠️  Products bucket not found - run the SQL schema to create it')
      }
    }

    console.log('\n✨ Connection test complete!')
    
  } catch (err) {
    console.error('\n❌ Connection test failed:', err.message)
  }
}

testConnection()
