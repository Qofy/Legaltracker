import axios from '@/plugins/axios'

/**
 * Meeting Service
 * Provides CRUD operations for Meeting entities
 */
class MeetingService {
  constructor() {
    this.baseUrl = '/meetings'
  }

  /**
   * Retrieve all meetings with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of meetings
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching meetings:', error)
      throw error
    }
  }

  /**
   * Retrieve a single meeting by ID
   * @param {string} id - Meeting ID
   * @returns {Promise<Object>} Meeting data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching meeting ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new meeting
   * @param {Object} data - Meeting data
   * @returns {Promise<Object>} Created meeting
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating meeting:', error)
      throw error
    }
  }

  /**
   * Update an existing meeting
   * @param {string} id - Meeting ID
   * @param {Object} data - Updated meeting data
   * @returns {Promise<Object>} Updated meeting
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating meeting ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a meeting
   * @param {string} id - Meeting ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting meeting ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter meetings by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered meetings
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering meetings:', error)
      throw error
    }
  }
}

export default new MeetingService()
