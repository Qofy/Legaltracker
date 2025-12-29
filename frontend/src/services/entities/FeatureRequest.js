import axios from '@/plugins/axios'

/**
 * FeatureRequest Service
 * Provides CRUD operations for FeatureRequest entities
 */
class FeatureRequestService {
  constructor() {
    this.baseUrl = '/feature-requests'
  }

  /**
   * Retrieve all feature requests with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of feature requests
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching feature requests:', error)
      throw error
    }
  }

  /**
   * Retrieve a single feature request by ID
   * @param {string} id - FeatureRequest ID
   * @returns {Promise<Object>} FeatureRequest data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching feature request ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new feature request
   * @param {Object} data - FeatureRequest data
   * @returns {Promise<Object>} Created feature request
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating feature request:', error)
      throw error
    }
  }

  /**
   * Update an existing feature request
   * @param {string} id - FeatureRequest ID
   * @param {Object} data - Updated feature request data
   * @returns {Promise<Object>} Updated feature request
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating feature request ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a feature request
   * @param {string} id - FeatureRequest ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting feature request ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter feature requests by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered feature requests
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering feature requests:', error)
      throw error
    }
  }
}

export default new FeatureRequestService()
