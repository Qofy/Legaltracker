import axios from '@/plugins/axios'

/**
 * Lawyer Service
 * Provides CRUD operations for Lawyer entities
 */
class LawyerService {
  constructor() {
    this.baseUrl = '/lawyers'
  }

  /**
   * Retrieve all lawyers with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of lawyers
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching lawyers:', error)
      throw error
    }
  }

  /**
   * Retrieve a single lawyer by ID
   * @param {string} id - Lawyer ID
   * @returns {Promise<Object>} Lawyer data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching lawyer ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new lawyer
   * @param {Object} data - Lawyer data
   * @returns {Promise<Object>} Created lawyer
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating lawyer:', error)
      throw error
    }
  }

  /**
   * Update an existing lawyer
   * @param {string} id - Lawyer ID
   * @param {Object} data - Updated lawyer data
   * @returns {Promise<Object>} Updated lawyer
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating lawyer ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a lawyer
   * @param {string} id - Lawyer ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting lawyer ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter lawyers by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered lawyers
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering lawyers:', error)
      throw error
    }
  }
}

export default new LawyerService()
