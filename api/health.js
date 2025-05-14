// Simple health check endpoint
module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}; 