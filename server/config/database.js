const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance with safe password handling
const sequelize = new Sequelize(
  process.env.DB_NAME || 'toko_komputer_db',
  process.env.DB_USER || 'postgres',
  (process.env.DB_PASSWORD || 'postgres').toString(),
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      // Handle specific cases for authentication
      ssl: false
    }
  }
);

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