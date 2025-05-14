const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Database
const { testConnection } = require('./server/config/database');
const { syncModels } = require('./server/models');

// Routes
const routes = require('./server/routes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        'https://central-computer.vercel.app', 
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Test database connection
testConnection();

// Sync models with database
syncModels();

// API Routes
app.use('/api', routes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Specify the correct path to client build directory
  const clientBuildPath = path.join(__dirname, 'client', 'build');
  app.use(express.static(clientBuildPath));
  
  // Handle React routing, return all other requests to React app
  app.get('*', (req, res) => {
    // Serve index.html for any request that doesn't start with /api
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// For Vercel serverless functions
if (process.env.VERCEL) {
  // Export the Express app as a module
  module.exports = app;
} else {
  // Start server for local development
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 