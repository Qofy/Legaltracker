import axios from '@/plugins/axios'

/**
 * ChatMessage Service
 * Provides CRUD operations for ChatMessage entities
 */
class ChatMessageService {
  constructor() {
    this.baseUrl = '/chat-messages'
  }

  /**
   * Retrieve all chat messages with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of chat messages
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      throw error
    }
  }

  /**
   * Retrieve a single chat message by ID
   * @param {string} id - ChatMessage ID
   * @returns {Promise<Object>} ChatMessage data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching chat message ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new chat message
   * @param {Object} data - ChatMessage data
   * @returns {Promise<Object>} Created chat message
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating chat message:', error)
      throw error
    }
  }

  /**
   * Update an existing chat message
   * @param {string} id - ChatMessage ID
   * @param {Object} data - Updated chat message data
   * @returns {Promise<Object>} Updated chat message
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating chat message ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a chat message
   * @param {string} id - ChatMessage ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting chat message ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter chat messages by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered chat messages
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering chat messages:', error)
      throw error
    }
  }
}

export default new ChatMessageService()
