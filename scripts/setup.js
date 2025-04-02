// Setup script for Atomic Habits Tracker
// This script initializes the environment for a new installation

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

function createEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  // Check if .env file already exists
  if (fs.existsSync(envPath)) {
    console.log('ℹ️ .env file already exists, skipping creation');
    return;
  }
  
  // Generate a secure random session secret
  const sessionSecret = crypto.randomBytes(32).toString('hex');
  
  // Create .env file with necessary variables
  const envContent = `SESSION_SECRET=${sessionSecret}
PORT=3000
NODE_ENV=development
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with session secret');
}

function installDependencies() {
  try {
    console.log('📦 Installing dependencies (this may take a few minutes)...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

function setup() {
  console.log('🚀 Setting up Atomic Habits Tracker...');
  
  // Create necessary environment file
  createEnvFile();
  
  // Install dependencies
  installDependencies();
  
  console.log(`
✨ Setup complete! ✨

To start the development server:
  npm run dev

Your application will be available at:
  http://localhost:3000

Documentation can be found in the docs/ directory.

Happy habit tracking! 🎯
  `);
}

// Run setup
setup();