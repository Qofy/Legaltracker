import axios from '@/plugins/axios'

/**
 * Case Service
 * Provides CRUD operations for Case entities
 */
class CaseService {
  constructor() {
    this.baseUrl = '/cases'
  }

  /**
   * Retrieve all cases with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of cases
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching cases:', error)
      throw error
    }
  }

  /**
   * Retrieve a single case by ID
   * @param {string} id - Case ID
   * @returns {Promise<Object>} Case data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching case ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new case
   * @param {Object} data - Case data
   * @returns {Promise<Object>} Created case
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating case:', error)
      throw error
    }
  }

  /**
   * Update an existing case
   * @param {string} id - Case ID
   * @param {Object} data - Updated case data
   * @returns {Promise<Object>} Updated case
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating case ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a case
   * @param {string} id - Case ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting case ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter cases by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered cases
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering cases:', error)
      throw error
    }
  }
}

export default new CaseService()
