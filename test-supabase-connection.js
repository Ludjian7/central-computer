// Script to test Supabase database connection
require('dotenv').config();
const { Sequelize } = require('sequelize');
const dns = require('dns').promises;

async function testSupabaseConnection() {
  console.log('Testing Supabase database connection...');
  
  // Create Sequelize instance with explicit credentials
  const DB_NAME = 'postgres';
  const DB_USER = 'postgres';
  const DB_PASSWORD = 'sKA1VADomm7n9TGA';
  // Direct Supabase host format: db.zzqkrmcdnwuyfgxvjnmn.supabase.co
  // Alternate format: zzqkrmcdnwuyfgxvjnmn.supabase.co
  const DB_HOST = 'db.zzqkrmcdnwuyfgxvjnmn.supabase.co';
  const DB_PORT = 5432;
  
  console.log('Connection info:');
  console.log(`- Database: ${DB_NAME}`);
  console.log(`- Host: ${DB_HOST}`);
  console.log(`- Port: ${DB_PORT}`);
  console.log(`- User: ${DB_USER}`);
  
  // Try to resolve the hostname first
  try {
    console.log(`Resolving hostname: ${DB_HOST}`);
    const addresses = await dns.lookup(DB_HOST);
    console.log(`Resolved to: ${JSON.stringify(addresses)}`);
  } catch (error) {
    console.error(`DNS resolution error: ${error.message}`);
    
    // Try alternate host
    const alternateHost = 'zzqkrmcdnwuyfgxvjnmn.supabase.co';
    try {
      console.log(`Trying alternate hostname: ${alternateHost}`);
      const altAddresses = await dns.lookup(alternateHost);
      console.log(`Resolved alternate to: ${JSON.stringify(altAddresses)}`);
    } catch (altError) {
      console.error(`DNS resolution error for alternate: ${altError.message}`);
    }
  }
  
  // Try with both host formats
  const hosts = [
    'db.zzqkrmcdnwuyfgxvjnmn.supabase.co',
    'zzqkrmcdnwuyfgxvjnmn.supabase.co'
  ];
  
  for (const host of hosts) {
    // Create a connection string
    const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${host}:${DB_PORT}/${DB_NAME}`;
    
    // Create Sequelize instance
    const sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 3,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    
    try {
      console.log(`\nAttempting to connect to Supabase with host: ${host}...`);
      await sequelize.authenticate();
      console.log('Connection to Supabase has been established successfully!');
      
      // Test with a simple query
      const [results] = await sequelize.query('SELECT NOW() as current_time');
      console.log('Supabase server time:', results[0].current_time);
      
      // List tables
      const [tables] = await sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
      );
      
      console.log('\nAvailable tables in Supabase:');
      if (tables.length === 0) {
        console.log('No tables found.');
      } else {
        tables.forEach(table => {
          console.log(`- ${table.table_name}`);
        });
      }
      
      // Connection successful, no need to try other hosts
      await sequelize.close();
      return;
      
    } catch (error) {
      console.error(`Unable to connect to Supabase with host ${host}:`, error.message);
      await sequelize.close();
    }
  }
  
  console.error('All connection attempts failed.');
}

testSupabaseConnection(); 