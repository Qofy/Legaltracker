import axios from '@/plugins/axios'

/**
 * BugReport Service
 * Provides CRUD operations for BugReport entities
 */
class BugReportService {
  constructor() {
    this.baseUrl = '/bug-reports'
  }

  /**
   * Retrieve all bug reports with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of bug reports
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching bug reports:', error)
      throw error
    }
  }

  /**
   * Retrieve a single bug report by ID
   * @param {string} id - BugReport ID
   * @returns {Promise<Object>} BugReport data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching bug report ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new bug report
   * @param {Object} data - BugReport data
   * @returns {Promise<Object>} Created bug report
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating bug report:', error)
      throw error
    }
  }

  /**
   * Update an existing bug report
   * @param {string} id - BugReport ID
   * @param {Object} data - Updated bug report data
   * @returns {Promise<Object>} Updated bug report
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating bug report ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a bug report
   * @param {string} id - BugReport ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting bug report ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter bug reports by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered bug reports
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering bug reports:', error)
      throw error
    }
  }
}

export default new BugReportService()
