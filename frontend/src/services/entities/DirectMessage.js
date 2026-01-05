import axios from '@/plugins/axios'

/**
 * DirectMessage Service
 * Provides CRUD operations for DirectMessage entities
 */
class DirectMessageService {
  constructor() {
    this.baseUrl = '/direct-messages'
    this.cacheKey = 'direct_messages_cache'
    this.cacheExpiry = 30 * 60 * 1000 // 30 minutes
  }

  /**
   * Get messages from localStorage cache
   * @returns {Array|null} Cached messages or null if expired/missing
   */
  getCachedMessages() {
    try {
      const cached = localStorage.getItem(this.cacheKey)
      if (!cached) return null
      
      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()
      
      if (now - timestamp > this.cacheExpiry) {
        localStorage.removeItem(this.cacheKey)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error reading cached messages:', error)
      return null
    }
  }

  /**
   * Save messages to localStorage cache
   * @param {Array} messages - Messages to cache
   */
  setCachedMessages(messages) {
    try {
      const cacheData = {
        data: messages,
        timestamp: Date.now()
      }
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error caching messages:', error)
    }
  }

  /**
   * Add a message to cache immediately
   * @param {Object} message - Message to add to cache
   */
  addToCache(message) {
    try {
      const cached = this.getCachedMessages() || []
      // Avoid duplicates
      if (!cached.find(m => m.id === message.id)) {
        cached.push(message)
        this.setCachedMessages(cached)
      }
    } catch (error) {
      console.error('Error adding message to cache:', error)
    }
  }

  /**
   * Send a direct message
   * @param {Object} data - Message data (content, recipient_id)
   * @returns {Promise<Object>} Created message
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      const message = response.data
      
      // Immediately cache the new message for instant availability
      this.addToCache(message)
      
      return message
    } catch (error) {
      console.error('Error creating direct message:', error)
      throw error
    }
  }

  /**
   * Get conversation with another user
   * @param {string} otherUserId - The other user's ID
   * @returns {Promise<Array>} List of messages
   */
  async getConversation(otherUserId) {
    try {
      const response = await axios.get(`${this.baseUrl}/conversation/${otherUserId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching conversation:', error)
      throw error
    }
  }

  /**
   * Get all conversations for current user
   * @param {boolean} forceRefresh - Force refresh from server
   * @returns {Promise<Array>} List of all messages
   */
  async list(forceRefresh = false) {
    try {
      // Return cached data immediately if available and not forcing refresh
      if (!forceRefresh) {
        const cached = this.getCachedMessages()
        if (cached && cached.length > 0) {
          console.log('Using cached direct messages:', cached.length)
          // Fetch fresh data in background
          this.refreshCache()
          return cached
        }
      }
      
      // Fetch from server
      const response = await axios.get(this.baseUrl)
      const messages = response.data || []

      // Merge server messages with existing cache instead of blindly
      // replacing the cache. This prevents dropping client-only or
      // unsynced messages when the server returns fewer items.
      try {
        const existing = this.getCachedMessages() || [];

        if (Array.isArray(messages) && messages.length > 0) {
          const serverById = {};
          messages.forEach(m => { if (m && m.id) serverById[m.id] = m; });

          // Keep existing items that either have no id (local-only) or
          // whose id is missing from the server results.
          const remaining = (existing || []).filter(e => !e || !e.id || !serverById[e.id]);

          const merged = [...messages, ...remaining];
          this.setCachedMessages(merged);
          console.log('Fetched and merged direct messages: total=', merged.length, 'server=', messages.length, 'keptLocal=', remaining.length);
        } else {
          console.log('Fetched no messages from server; preserving existing cache')
        }
      } catch (e) {
        console.error('Failed to merge server messages with cache:', e);
      }

      return messages
    } catch (error) {
      console.error('Error fetching direct messages:', error)
      // Fallback to cache if server fails
      const cached = this.getCachedMessages()
      if (cached) {
        console.log('Server failed, using cached messages:', cached.length)
        return cached
      }
      throw error
    }
  }

  /**
   * Refresh cache in background
   */
  async refreshCache() {
    try {
      setTimeout(async () => {
        try {
          const response = await axios.get(this.baseUrl)
          const messages = response.data || []
          const existing = this.getCachedMessages() || [];

          if (Array.isArray(messages) && messages.length > 0) {
            const serverById = {};
            messages.forEach(m => { if (m && m.id) serverById[m.id] = m; });
            const remaining = (existing || []).filter(e => !e || !e.id || !serverById[e.id]);
            const merged = [...messages, ...remaining];
            this.setCachedMessages(merged);
            console.log('Background cache refresh completed: merged=', merged.length, 'server=', messages.length, 'keptLocal=', remaining.length);
          } else {
            console.log('Background refresh returned no messages; cache unchanged')
          }
        } catch (e) {
          console.error('Background cache refresh failed:', e);
        }
      }, 1000)
    } catch (error) {
      console.error('Background cache refresh failed:', error)
    }
  }

  /**
   * Mark a message as read
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Updated message
   */
  async markAsRead(id) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/read`)
      return response.data
    } catch (error) {
      console.error(`Error marking message ${id} as read:`, error)
      throw error
    }
  }
}

export default new DirectMessageService()
