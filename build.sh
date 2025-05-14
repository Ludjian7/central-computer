#!/usr/bin/env bash
# Build script for Render deployment

# Exit on error
set -o errexit

# Install dependencies
npm install

# Build frontend if running in full-stack mode (comment out if deploying backend-only)
if [ -d "client" ]; then
  echo "Building frontend..."
  cd client
  npm install
  npm run build
  cd ..
fi

# Print message
echo "Build completed successfully!" 