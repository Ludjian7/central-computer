// Script to test direct connection to Supabase
const { Sequelize } = require('sequelize');

async function testDirectConnection() {
  // Use the correct URL format that we verified works
  const connectionString = 'postgresql://postgres:sKA1VADomm7n9TGA@zzqkrmcdnwuyfgxvjnmn.supabase.co:5432/postgres';
  
  console.log('Testing direct connection to Supabase...');
  console.log(`Connection string: ${connectionString.replace(/sKA1VADomm7n9TGA/, '********')}`);
  
  // Create Sequelize instance
  const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: true, // Enable logging for debugging
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
    console.log('Connecting...');
    await sequelize.authenticate();
    console.log('Connection successful!');
    
    // Try a simple query
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
    
    return true;
  } catch (error) {
    console.error('Connection failed with error:');
    console.error('Message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error code:', error.original?.code);
    console.error('Full error:', error);
    return false;
  } finally {
    try {
      await sequelize.close();
    } catch (e) {
      console.error('Error closing connection:', e.message);
    }
  }
}

// Try alternative URL format
async function tryAlternativeURLs() {
  const formats = [
    'postgresql://postgres:sKA1VADomm7n9TGA@zzqkrmcdnwuyfgxvjnmn.supabase.co:5432/postgres',
    'postgres://postgres:sKA1VADomm7n9TGA@zzqkrmcdnwuyfgxvjnmn.supabase.co:5432/postgres'
  ];
  
  console.log('Trying alternative URL formats...');
  
  for (const [i, url] of formats.entries()) {
    console.log(`\nAttempt ${i+1} with URL format: ${url.replace(/sKA1VADomm7n9TGA/, '********')}`);
    
    const sequelize = new Sequelize(url, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
    
    try {
      await sequelize.authenticate();
      console.log('✅ Connection successful!');
      await sequelize.close();
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      await sequelize.close();
    }
  }
}

// Run the tests
async function runTests() {
  await testDirectConnection();
  await tryAlternativeURLs();
}

runTests(); 