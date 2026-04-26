/**
 * Cloud Storage Utility Module
 * Uses GitHub Gist API for cloud storage of messages and ideas
 */

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''
const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`

/**
 * Check if cloud storage is configured
 */
const isCloudConfigured = () => {
  return Boolean(GITHUB_TOKEN && GIST_ID)
}

/**
 * Fetch data from GitHub Gist
 * @returns {Promise<Object>} - { messages: Array, ideas: Array }
 */
export const fetchCloudData = async () => {
  if (!isCloudConfigured()) {
    return {
      messages: [],
      ideas: [],
      fromCloud: false,
    }
  }

  try {
    const response = await fetch(GIST_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub Gist API error: ${response.status}`)
    }

    const gistData = await response.json()
    const files = gistData.files || {}

    let messages = []
    let ideas = []

    if (files['messages.json']) {
      try {
        messages = JSON.parse(files['messages.json'].content)
      } catch {
        messages = []
      }
    }

    if (files['ideas.json']) {
      try {
        ideas = JSON.parse(files['ideas.json'].content)
      } catch {
        ideas = []
      }
    }

    return { messages, ideas, fromCloud: true }
  } catch (error) {
    console.error('Failed to fetch cloud data:', error)
    return {
      messages: [],
      ideas: [],
      fromCloud: false,
      error: error.message,
    }
  }
}

/**
 * Save data to GitHub Gist
 * @param {Object} data - { messages?: Array, ideas?: Array }
 * @returns {Promise<boolean>}
 */
export const saveCloudData = async (data) => {
  if (!isCloudConfigured()) {
    console.warn('Cloud storage not configured. Set VITE_GITHUB_TOKEN and VITE_GIST_ID environment variables.')
    return false
  }

  try {
    const response = await fetch(GIST_API_URL, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          ...(data.messages !== undefined && {
            'messages.json': {
              content: JSON.stringify(data.messages, null, 2),
            },
          }),
          ...(data.ideas !== undefined && {
            'ideas.json': {
              content: JSON.stringify(data.ideas, null, 2),
            },
          }),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`GitHub Gist API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to save cloud data:', error)
    return false
  }
}

/**
 * Get messages list
 * @returns {Promise<Array>}
 */
export const getMessages = async () => {
  const data = await fetchCloudData()
  return data.messages
}

/**
 * Save a new message
 * @param {Object} message - { id, name, message, timestamp }
 * @returns {Promise<boolean>}
 */
export const saveMessage = async (message) => {
  const data = await fetchCloudData()
  const updatedMessages = [message, ...data.messages]
  return saveCloudData({ messages: updatedMessages })
}

/**
 * Delete a message
 * @param {number|string} messageId - Message ID
 * @returns {Promise<boolean>}
 */
export const deleteMessage = async (messageId) => {
  const data = await fetchCloudData()
  const updatedMessages = data.messages.filter(msg => msg.id !== messageId)
  return saveCloudData({ messages: updatedMessages })
}

/**
 * Get ideas list
 * @returns {Promise<Array>}
 */
export const getIdeas = async () => {
  const data = await fetchCloudData()
  return data.ideas
}

/**
 * Save a new idea
 * @param {Object} idea - { id, title, content, detailedContent, ... }
 * @returns {Promise<boolean>}
 */
export const saveIdea = async (idea) => {
  const data = await fetchCloudData()
  const updatedIdeas = [...data.ideas, idea]
  return saveCloudData({ ideas: updatedIdeas })
}

/**
 * Delete an idea
 * @param {number|string} ideaId - Idea ID
 * @returns {Promise<boolean>}
 */
export const deleteIdea = async (ideaId) => {
  const data = await fetchCloudData()
  const updatedIdeas = data.ideas.filter(idea => idea.id !== ideaId)
  return saveCloudData({ ideas: updatedIdeas })
}

/**
 * Edit an idea
 * @param {number|string} ideaId - Idea ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>}
 */
export const editIdea = async (ideaId, updates) => {
  const data = await fetchCloudData()
  const updatedIdeas = data.ideas.map(idea => {
    if (idea.id === ideaId) {
      return {
        ...idea,
        ...updates,
        updatedAt: Date.now(),
      }
    }
    return idea
  })
  return saveCloudData({ ideas: updatedIdeas })
}

/**
 * Initialize default ideas (only if no ideas exist)
 * @param {Array} defaultIdeas - Default ideas from content.js
 * @returns {Promise<boolean>} - Whether initialization was performed
 */
export const initializeDefaultIdeas = async (defaultIdeas) => {
  const data = await fetchCloudData()

  if (data.ideas.length > 0) {
    return false
  }

  const defaultIdeasWithMeta = defaultIdeas.map(idea => ({
    ...idea,
    isDefault: true,
    createdAt: Date.now(),
  }))

  return saveCloudData({ ideas: defaultIdeasWithMeta })
}

// ========== Loading State Management ==========

/**
 * Create a loading state manager for cloud operations
 * @returns {Object} - Loading state manager
 */
export const createLoadingManager = () => {
  let listeners = []
  let loadingStates = {}

  const notify = () => {
    listeners.forEach(fn => fn({ ...loadingStates }))
  }

  return {
    /**
     * Subscribe to loading state changes
     * @param {Function} callback - (loadingStates) => void
     * @returns {Function} - Unsubscribe function
     */
    subscribe(callback) {
      listeners.push(callback)
      callback({ ...loadingStates })
      return () => {
        listeners = listeners.filter(fn => fn !== callback)
      }
    },

    /**
     * Set loading state for a specific operation
     * @param {string} key - Operation key (e.g., 'messages', 'ideas')
     * @param {boolean} isLoading - Loading state
     */
    setLoading(key, isLoading) {
      loadingStates[key] = isLoading
      notify()
    },

    /**
     * Get current loading state
     * @param {string} key - Operation key
     * @returns {boolean}
     */
    isLoading(key) {
      return Boolean(loadingStates[key])
    },

    /**
     * Get all loading states
     * @returns {Object}
     */
    getStates() {
      return { ...loadingStates }
    },

    /**
     * Reset all loading states
     */
    reset() {
      loadingStates = {}
      notify()
    },
  }
}

export default {
  fetchCloudData,
  saveCloudData,
  getMessages,
  saveMessage,
  deleteMessage,
  getIdeas,
  saveIdea,
  deleteIdea,
  editIdea,
  initializeDefaultIdeas,
  createLoadingManager,
  isCloudConfigured,
}
