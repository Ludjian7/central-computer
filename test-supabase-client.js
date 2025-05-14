// Script to test Supabase connection using the Supabase client library
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseClient() {
  console.log('Testing Supabase connection using the client library...');
  
  // Your Supabase URL and anon key
  // The URL is your project URL
  const supabaseUrl = 'https://zzqkrmcdnwuyfgxvjnmn.supabase.co';
  
  // We don't have your anon key, but let's use a placeholder
  // You need to replace this with your actual anon key from the Supabase dashboard
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with your anon key
  
  console.log('Using:');
  console.log(`- URL: ${supabaseUrl}`);
  console.log(`- Key: ${supabaseKey.substring(0, 10)}...`);
  
  try {
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test a simple query to the public schema
    console.log('\nTesting connection...');
    
    // Just checking connection - using system schema that should always exist
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .limit(5);
    
    if (error) {
      console.error('Error running query:', error.message);
      return false;
    }
    
    console.log('Connection successful!');
    console.log('Sample tables from system catalog:');
    console.log(data);
    
    return true;
  } catch (error) {
    console.error('Connection failed with error:');
    console.error('Message:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// Instructions for getting your Supabase credentials
function printInstructions() {
  console.log('\n=== IMPORTANT INSTRUCTIONS ===');
  console.log('To make this script work, you need to:');
  console.log('1. Go to https://supabase.com and log in to your project');
  console.log('2. Go to Project Settings > API');
  console.log('3. Copy the "Project URL" and update supabaseUrl in this script');
  console.log('4. Copy the "anon public" key and update supabaseKey in this script');
  console.log('5. Run this script again');
  console.log('\nAlternative approach:');
  console.log('Instead of direct PostgreSQL connection, consider updating your app to use:');
  console.log('1. The Supabase client library (recommended)');
  console.log('2. The Supabase Postgres REST API');
  console.log('Both methods work over HTTPS (port 443) instead of PostgreSQL (port 5432)');
  console.log('which helps avoid many firewall and network issues');
}

// Run the test
async function run() {
  await testSupabaseClient();
  printInstructions();
}

run(); 