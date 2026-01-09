/**
 * APD Auto-Login Server
 * 
 * A simple Express server that provides an endpoint to trigger Playwright
 * automation for logging into APD.
 * 
 * Usage:
 *   node scripts/apd-auto-login-server.js
 * 
 * Then the React app can call POST http://localhost:3001/api/apd-login
 */

const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
const PORT = 3001;

// APD Credentials - should match src/config/apdCredentials.ts
const APD_CREDENTIALS = {
  username: 'imran.khan21@cognizant.com',
  password: 'Centrica786#',
  loginUrl: 'https://mhclg.gpetoplanning.ai/login'
};

app.use(cors());
app.use(express.json());

// Store browser instance to reuse
let browserContext = null;

app.post('/api/apd-login', async (req, res) => {
  try {
    console.log('🚀 Starting APD auto-login...');
    
    // Launch browser (or reuse existing)
    const browser = await chromium.launch({ 
      headless: false,  // Show the browser so user can interact
      args: ['--start-maximized']
    });
    
    browserContext = await browser.newContext({
      viewport: null  // Use full window size
    });
    
    const page = await browserContext.newPage();
    
    // Navigate to login page
    console.log('📍 Navigating to APD login page...');
    await page.goto(APD_CREDENTIALS.loginUrl);
    
    // Fill in credentials
    console.log('✏️ Filling in credentials...');
    await page.getByRole('textbox', { name: 'Enter your Email' }).fill(APD_CREDENTIALS.username);
    await page.getByRole('textbox', { name: 'Enter your Password' }).fill(APD_CREDENTIALS.password);
    
    // Click login
    console.log('🔑 Clicking login...');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/');
    
    console.log('✅ Login successful!');
    
    res.json({ 
      success: true, 
      message: 'Login successful! Browser window is now open.',
      url: page.url()
    });
    
    // Don't close the browser - let user interact with it
    
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'APD Auto-Login Server' });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           APD Auto-Login Server Running                    ║
╠════════════════════════════════════════════════════════════╣
║  Server:  http://localhost:${PORT}                           ║
║  Health:  http://localhost:${PORT}/api/health                ║
║  Login:   POST http://localhost:${PORT}/api/apd-login        ║
╚════════════════════════════════════════════════════════════╝
  `);
});
