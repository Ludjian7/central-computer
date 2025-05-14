const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if running in production (for Supabase) or development (local PostgreSQL)
const isProduction = process.env.NODE_ENV === 'production';

// Prioritize DATABASE_URL if available
let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: isProduction ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Fallback to individual connection parameters
  const dbName = process.env.DB_NAME || (isProduction ? 'postgres' : 'toko_komputer_db');
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = (process.env.DB_PASSWORD || (isProduction ? '' : 'postgres')).toString();
  // For Supabase, use the proper hostname format without 'db.' prefix
  let dbHost = process.env.DB_HOST || (isProduction ? 'zzqkrmcdnwuyfgxvjnmn.supabase.co' : 'localhost');
  if (isProduction && dbHost && dbHost.startsWith('db.')) {
    dbHost = dbHost.replace('db.', '');
  }
  const dbPort = process.env.DB_PORT || 5432;
  
  // Log connection parameters for debugging
  console.log('Database connection parameters:');
  console.log(`- Name: ${dbName}`);
  console.log(`- Host: ${dbHost}`);
  console.log(`- Port: ${dbPort}`);
  console.log(`- User: ${dbUser}`);
  console.log(`- Production mode: ${isProduction}`);
  
  sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        // SSL for Supabase (only in production)
        ssl: isProduction ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    }
  );
}

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
}; 