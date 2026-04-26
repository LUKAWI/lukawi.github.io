/**
 * 开发者登录认证工具
 * 简单的前端密码验证（不适用于高安全场景）
 */

const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const PASSWORD_HASH = 'e9ae0fd97bb62958cc1731e44f5ab37b9d8f6eb2a8bf15e8c8e935676f237f6d'
const AUTH_KEY = 'dev_login_status'

export const verifyPassword = async (password) => {
  const hash = await sha256(password)
  return hash === PASSWORD_HASH
}

/**
 * 登录
 * 将登录状态保存到 localStorage
 */
export const login = () => {
  const loginData = {
    isLoggedIn: true,
    loginTime: Date.now(),
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(loginData))
}

/**
 * 登出
 * 清除 localStorage 中的登录状态
 */
export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
}

/**
 * 检查是否已登录
 * @returns {boolean} - 是否已登录
 */
export const isLoggedIn = () => {
  const authData = localStorage.getItem(AUTH_KEY)
  if (!authData) return false
  
  try {
    const { isLoggedIn, loginTime } = JSON.parse(authData)
    return isLoggedIn === true
  } catch {
    return false
  }
}

/**
 * 获取登录时间
 * @returns {number|null} - 登录时间戳
 */
export const getLoginTime = () => {
  const authData = localStorage.getItem(AUTH_KEY)
  if (!authData) return null
  
  try {
    const { loginTime } = JSON.parse(authData)
    return loginTime
  } catch {
    return null
  }
}
