import axios from '@/plugins/axios'

/**
 * User Service
 * Provides CRUD operations for User entities
 */
class UserService {
  constructor() {
    this.baseUrl = '/users'
  }

  /**
   * Retrieve all users with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of users
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  /**
   * Retrieve a single user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating user ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter users by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered users
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering users:', error)
      throw error
    }
  }

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} Current user data
   */
  async me() {
    try {
      const response = await axios.get('/auth/me')
      return response.data
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }
}

export default new UserService()
