// Script to test the database connection
require('dotenv').config();
const { testConnection, sequelize } = require('./server/config/database');

async function testDB() {
  console.log('Testing database connection...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? 'Yes (from .env)' : 'No');
  
  // Log connection parameters (without sensitive info)
  const connectionInfo = {
    database: sequelize.config.database,
    username: sequelize.config.username,
    host: sequelize.config.host,
    port: sequelize.config.port,
    dialect: sequelize.options.dialect,
    ssl: sequelize.options.dialectOptions?.ssl ? 'enabled' : 'disabled'
  };
  
  console.log('Connection parameters:', connectionInfo);
  
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('Successfully connected to the database!');
      
      // Test a query
      try {
        const [results] = await sequelize.query('SELECT NOW() as current_time');
        console.log('Database time:', results[0].current_time);
        
        // Check database tables
        const [tables] = await sequelize.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
        );
        
        console.log('Available tables:');
        if (tables.length === 0) {
          console.log('No tables found in the database.');
        } else {
          tables.forEach(table => {
            console.log(`- ${table.table_name}`);
          });
        }
        
        // Check if models are synced
        console.log('\nInitializing and syncing models...');
        const { syncModels } = require('./server/models');
        await syncModels();
        
        // Check tables again after sync
        const [syncedTables] = await sequelize.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
        );
        
        console.log('\nTables after sync:');
        syncedTables.forEach(table => {
          console.log(`- ${table.table_name}`);
        });
      } catch (error) {
        console.error('Error running test query:', error.message);
      }
    } else {
      console.error('Failed to connect to the database.');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
  } finally {
    await sequelize.close();
  }
}

// Set NODE_ENV to development if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

testDB(); 