/**
 * Authentication Utility Module
 * Simple password-based authentication for admin features
 */

const ADMIN_PASSWORD = 'admin123'
const AUTH_STORAGE_KEY = 'admin_auth'

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!authData) return false
    
    const { timestamp, authenticated } = JSON.parse(authData)
    
    // Token expires after 24 hours
    const now = Date.now()
    if (now - timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return false
    }
    
    return authenticated === true
  } catch {
    return false
  }
}

/**
 * Login with password
 * @param {string} password
 * @returns {boolean} - Whether login was successful
 */
export const login = (password) => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      authenticated: true,
      timestamp: Date.now(),
    }))
    return true
  }
  return false
}

/**
 * Logout
 */
export const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

/**
 * Verify password without logging in
 * @param {string} password
 * @returns {boolean}
 */
export const verifyPassword = (password) => {
  return password === ADMIN_PASSWORD
}

export default {
  isLoggedIn,
  login,
  logout,
  verifyPassword,
}
