const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Set environment variables for build
process.env.VERCEL_BUILD_STEP = 'true';
process.env.CI = 'false';

console.log('Starting Vercel build process...');

// Ensure API directory exists
if (!fs.existsSync('./api')) {
  fs.mkdirSync('./api', { recursive: true });
  console.log('Created API directory for serverless functions');
}

// Ensure client/build directory exists
const clientBuildPath = path.join(__dirname, 'client', 'build');
if (!fs.existsSync(clientBuildPath)) {
  console.log('Building client application...');
  
  // Run client build script
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Client build error: ${error.message}`);
      process.exit(1);
    }
    
    if (stderr) {
      console.error(`Client build warnings: ${stderr}`);
    }
    
    console.log(stdout);
    console.log('Client build completed successfully');
  });
} else {
  console.log('Client build directory already exists');
}

console.log('Vercel build process completed'); 