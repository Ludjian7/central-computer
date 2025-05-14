// API routes map for the serverless functions
module.exports = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Central Computer API routes',
    routes: {
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        me: '/api/auth/me'
      },
      health: '/api/health',
      db: {
        test: '/api/db-test',
        info: '/api/db-info'
      }
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}; 