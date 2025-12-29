import axios from '@/plugins/axios'

/**
 * Comment Service
 * Provides CRUD operations for Comment entities
 */
class CommentService {
  constructor() {
    this.baseUrl = '/comments'
  }

  /**
   * Retrieve all comments with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of comments
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }

  /**
   * Retrieve a single comment by ID
   * @param {string} id - Comment ID
   * @returns {Promise<Object>} Comment data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new comment
   * @param {Object} data - Comment data
   * @returns {Promise<Object>} Created comment
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  }

  /**
   * Update an existing comment
   * @param {string} id - Comment ID
   * @param {Object} data - Updated comment data
   * @returns {Promise<Object>} Updated comment
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating comment ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a comment
   * @param {string} id - Comment ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter comments by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered comments
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering comments:', error)
      throw error
    }
  }
}

export default new CommentService()
