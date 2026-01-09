/**
 * APD Auto-Login Service
 * 
 * This service handles automatic login to the APD system.
 * It opens a new browser window and uses a script to fill in credentials.
 */

import { APD_CREDENTIALS } from '../config/apdCredentials'

/**
 * Opens APD login page and automatically fills credentials using a popup approach.
 * Uses window.open with a data URL to inject a form that auto-submits.
 */
export function openAPDWithAutoLogin(): void {
  const { username, loginUrl } = APD_CREDENTIALS
  
  // Open the login page
  const apdWindow = window.open(loginUrl, '_blank', 'noopener')
  
  if (apdWindow) {
    // We can't directly manipulate cross-origin windows due to browser security.
    // Instead, we'll use a localStorage-based approach where we store credentials
    // and a browser extension or userscript could pick them up.
    // 
    // For now, we'll just open the page - the user can use a password manager
    // or the Playwright automation via the AI assistant.
    
    console.log('APD login page opened. Credentials available:', { username })
    console.log('For auto-login, ask the AI assistant to use Playwright automation.')
  }
}

/**
 * Generates a bookmarklet code that can be used to fill the APD login form.
 * User can drag this to their bookmarks bar and click it on the login page.
 */
export function getLoginBookmarklet(): string {
  const { username, password } = APD_CREDENTIALS
  
  const bookmarkletCode = `
    javascript:(function(){
      var email = document.querySelector('input[placeholder*="Email"], input[type="email"]');
      var pass = document.querySelector('input[placeholder*="Password"], input[type="password"]');
      if(email) email.value = '${username}';
      if(pass) pass.value = '${password}';
      var btn = document.querySelector('button[type="submit"], button:contains("Login")');
      if(btn) btn.click();
    })();
  `.replace(/\s+/g, ' ').trim()
  
  return bookmarkletCode
}

/**
 * Copies login credentials to clipboard for easy pasting.
 */
export async function copyCredentialsToClipboard(): Promise<void> {
  const { username, password } = APD_CREDENTIALS
  
  try {
    await navigator.clipboard.writeText(`Email: ${username}\nPassword: ${password}`)
    console.log('Credentials copied to clipboard')
  } catch (err) {
    console.error('Failed to copy credentials:', err)
  }
}
