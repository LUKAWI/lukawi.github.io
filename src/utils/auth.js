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
const IDEAS_KEY = 'ai-ee-ideas'

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

/**
 * 保存 ideas 到 localStorage
 * @param {Array} ideas - ideas 数组
 */
export const saveIdeas = (ideas) => {
  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas))
}

/**
 * 从 localStorage 获取 ideas
 * @returns {Array} - ideas 数组
 */
export const getIdeas = () => {
  const ideasData = localStorage.getItem(IDEAS_KEY)
  if (!ideasData) return []
  
  try {
    return JSON.parse(ideasData)
  } catch {
    return []
  }
}

/**
 * 初始化默认 ideas（仅在首次访问时调用）
 * @param {Array} defaultIdeasData - 默认 ideas 数据数组
 * @returns {boolean} - 是否执行了初始化
 */
export const initializeDefaultIdeas = (defaultIdeasData) => {
  const ideasData = localStorage.getItem(IDEAS_KEY)
  
  // 如果已有数据，不执行初始化
  if (ideasData) {
    return false
  }
  
  // 使用传入的默认 ideas 数据初始化
  const defaultIdeas = defaultIdeasData.map(idea => ({
    ...idea,
    isDefault: true,
    createdAt: Date.now(),
  }))
  
  localStorage.setItem(IDEAS_KEY, JSON.stringify(defaultIdeas))
  return true
}

/**
 * 删除指定 idea
 * @param {number} ideaId - 要删除的 idea ID
 */
export const deleteIdea = (ideaId) => {
  const ideas = getIdeas()
  const filteredIdeas = ideas.filter(idea => idea.id !== ideaId)
  saveIdeas(filteredIdeas)
}

/**
 * 编辑指定 idea
 * @param {number} ideaId - idea ID
 * @param {Object} updates - 要更新的字段
 */
export const editIdea = (ideaId, updates) => {
  const ideas = getIdeas()
  const updatedIdeas = ideas.map(idea => {
    if (idea.id === ideaId) {
      return {
        ...idea,
        ...updates,
        updatedAt: Date.now(),
      }
    }
    return idea
  })
  saveIdeas(updatedIdeas)
}
