// Database information endpoint for debugging
const { sequelize } = require('../server/config/database');
const { User, Product, Supplier, Sale, SaleItem } = require('../server/models');

module.exports = async (req, res) => {
  try {
    // First test the database connection
    try {
      await sequelize.authenticate();
      
      // Get table counts
      const counts = await Promise.all([
        User.count(),
        Product.count(),
        Supplier.count(),
        Sale.count(),
        SaleItem.count()
      ]);
      
      // Get database info
      const dbInfo = {
        dialect: sequelize.options.dialect,
        host: sequelize.config.host,
        port: sequelize.config.port,
        database: sequelize.config.database,
        username: sequelize.config.username,
        ssl: sequelize.options.dialectOptions?.ssl ? 'enabled' : 'disabled',
        tables: {
          users: counts[0],
          products: counts[1],
          suppliers: counts[2],
          sales: counts[3],
          saleItems: counts[4]
        }
      };
      
      return res.status(200).json({
        success: true,
        message: 'Database connection successful',
        dbInfo,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }
  } catch (error) {
    console.error('Database info error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving database information',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
}; 