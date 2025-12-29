import axios from '@/plugins/axios'

/**
 * Invitation Service
 * Provides CRUD operations for Invitation entities
 */
class InvitationService {
  constructor() {
    this.baseUrl = '/invitations'
  }

  /**
   * Retrieve all invitations with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of invitations
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching invitations:', error)
      throw error
    }
  }

  /**
   * Retrieve a single invitation by ID
   * @param {string} id - Invitation ID
   * @returns {Promise<Object>} Invitation data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching invitation ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new invitation
   * @param {Object} data - Invitation data
   * @returns {Promise<Object>} Created invitation
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating invitation:', error)
      throw error
    }
  }

  /**
   * Update an existing invitation
   * @param {string} id - Invitation ID
   * @param {Object} data - Updated invitation data
   * @returns {Promise<Object>} Updated invitation
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating invitation ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete an invitation
   * @param {string} id - Invitation ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting invitation ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter invitations by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered invitations
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering invitations:', error)
      throw error
    }
  }
}

export default new InvitationService()
