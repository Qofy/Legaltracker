import axios from '@/plugins/axios'

/**
 * GuestPass Service
 * Provides CRUD operations for GuestPass entities
 */
class GuestPassService {
  constructor() {
    this.baseUrl = '/guest-passes'
  }

  /**
   * Retrieve all guest passes with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of guest passes
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching guest passes:', error)
      throw error
    }
  }

  /**
   * Retrieve a single guest pass by ID
   * @param {string} id - GuestPass ID
   * @returns {Promise<Object>} GuestPass data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching guest pass ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new guest pass
   * @param {Object} data - GuestPass data
   * @returns {Promise<Object>} Created guest pass
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating guest pass:', error)
      throw error
    }
  }

  /**
   * Update an existing guest pass
   * @param {string} id - GuestPass ID
   * @param {Object} data - Updated guest pass data
   * @returns {Promise<Object>} Updated guest pass
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating guest pass ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a guest pass
   * @param {string} id - GuestPass ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting guest pass ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter guest passes by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered guest passes
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering guest passes:', error)
      throw error
    }
  }
}

export default new GuestPassService()
