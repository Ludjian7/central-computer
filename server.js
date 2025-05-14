const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration for Render, Vercel and Railway deployment
const whitelist = [
  'https://central-computer.vercel.app',
  'https://central-computers.vercel.app',
  'https://central-computer-4fhshk1di-ludjian7s-projects.vercel.app',
  'http://localhost:3000',
  // Render frontend URL (update when you have it)
  process.env.RENDER_EXTERNAL_URL,
  process.env.RENDER_EXTERNAL_HOSTNAME,
  // Railway URL
  process.env.RAILWAY_STATIC_URL
].filter(Boolean); // Filter out undefined values

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log("Origin not allowed by CORS:", origin);
      // still allow for development purposes
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version']
}));

// Pre-flight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Create a connection manager to handle pooling for serverless
const dbConnectionManager = {
  isConnected: false,
  connect: async function() {
    if (this.isConnected) {
      console.log('Already connected to database');
      return;
    }

    try {
      // Database
      const { testConnection } = require('./server/config/database');
      const { syncModels } = require('./server/models');
      
      // Test database connection
      const connected = await testConnection();
      
      if (connected) {
        this.isConnected = true;
        console.log('Database connection established');
        
        // Sync models with database - skip in production to avoid schema changes
        if (process.env.NODE_ENV !== 'production') {
          await syncModels();
        }
      }
    } catch (error) {
      console.error('Database connection error:', error);
      this.isConnected = false;
    }
  }
};

// Routes
const routes = require('./server/routes');

// Database connection middleware
app.use(async (req, res, next) => {
  // Skip database connection for static assets
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    return next();
  }
  
  // Only connect for API routes
  if (req.path.startsWith('/api')) {
    try {
      await dbConnectionManager.connect();
    } catch (error) {
      console.error('Database middleware error:', error);
    }
  }
  
  next();
});

// API Routes - ensure they're mounted at /api
app.use('/api', routes);

// Health check for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'central-computers-api',
    environment: process.env.NODE_ENV || 'development',
    platform: process.env.RENDER_EXTERNAL_URL ? 'render' : (process.env.RAILWAY_STATIC_URL ? 'railway' : 'local'),
    timestamp: new Date().toISOString()
  });
});

// Also add a root health check
app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Specify the correct path to client build directory
  const clientBuildPath = path.join(__dirname, 'client', 'build');
  
  // Serve static files with proper headers
  app.use(express.static(clientBuildPath, {
    setHeaders: (res, path) => {
      if (path.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      }
      // Add cache control headers for static assets
      if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  }));
  
  // Handle React routing, return all other requests to React app
  app.get('*', (req, res) => {
    // Only serve index.html for non-API requests
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Connect to database in development
dbConnectionManager.connect();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Platform: ${process.env.RENDER_EXTERNAL_URL ? 'Render' : (process.env.RAILWAY_STATIC_URL ? 'Railway' : 'Local')}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected via URL' : 'Using individual params'}`);
}); 