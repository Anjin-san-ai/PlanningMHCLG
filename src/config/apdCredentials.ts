/**
 * APD Credentials Configuration
 * 
 * WARNING: Demo only - never commit real credentials to version control!
 * Replace the placeholder values below with your actual APD credentials.
 * 
 * NOTE: URL parameter auto-fill does NOT work on the APD login page.
 * For automatic login, use Playwright browser automation (see below).
 */

export const APD_CREDENTIALS = {
  username: 'imran.khan21@cognizant.com',
  password: 'Centrica786#',
  loginUrl: 'https://mhclg.gpetoplanning.ai/login'
}

/**
 * Playwright selectors for the APD login form
 * These are used for browser automation to fill and submit the login form.
 * 
 * Usage with Playwright MCP:
 * 1. Navigate to loginUrl
 * 2. Fill email field: getByRole('textbox', { name: 'Enter your Email' })
 * 3. Fill password field: getByRole('textbox', { name: 'Enter your Password' })
 * 4. Click login: getByRole('button', { name: 'Login' })
 */
export const APD_LOGIN_SELECTORS = {
  emailField: "textbox 'Enter your Email'",      // ref: e38
  passwordField: "textbox 'Enter your Password'", // ref: e42
  loginButton: "button 'Login'"                   // ref: e49
}
