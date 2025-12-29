import axios from '@/plugins/axios'

/**
 * ActionItem Service
 * Provides CRUD operations for ActionItem entities
 */
class ActionItemService {
  constructor() {
    this.baseUrl = '/action-items'
  }

  /**
   * Retrieve all action items with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of action items
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching action items:', error)
      throw error
    }
  }

  /**
   * Retrieve a single action item by ID
   * @param {string} id - ActionItem ID
   * @returns {Promise<Object>} ActionItem data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching action item ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new action item
   * @param {Object} data - ActionItem data
   * @returns {Promise<Object>} Created action item
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating action item:', error)
      throw error
    }
  }

  /**
   * Update an existing action item
   * @param {string} id - ActionItem ID
   * @param {Object} data - Updated action item data
   * @returns {Promise<Object>} Updated action item
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating action item ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete an action item
   * @param {string} id - ActionItem ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting action item ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter action items by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered action items
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering action items:', error)
      throw error
    }
  }
}

export default new ActionItemService()
