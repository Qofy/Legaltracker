import axios from '@/plugins/axios'

/**
 * DirectMessage Service
 * Provides CRUD operations for DirectMessage entities
 */
class DirectMessageService {
  constructor() {
    this.baseUrl = '/direct-messages'
  }

  /**
   * Send a direct message
   * @param {Object} data - Message data (content, recipient_id)
   * @returns {Promise<Object>} Created message
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
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
   * @returns {Promise<Array>} List of all messages
   */
  async list() {
    try {
      const response = await axios.get(this.baseUrl)
      return response.data
    } catch (error) {
      console.error('Error fetching direct messages:', error)
      throw error
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
