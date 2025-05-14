// Database connection test for Vercel
const { testConnection } = require('../server/config/database');

module.exports = async (req, res) => {
  try {
    // Test database connection
    const connected = await testConnection();
    
    if (connected) {
      return res.status(200).json({
        success: true,
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error testing database connection',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
}; 