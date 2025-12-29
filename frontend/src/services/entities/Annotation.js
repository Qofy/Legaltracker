import axios from '@/plugins/axios'

/**
 * Annotation Service
 * Provides CRUD operations for Annotation entities
 */
class AnnotationService {
  constructor() {
    this.baseUrl = '/annotations'
  }

  /**
   * Retrieve all annotations with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of annotations
   */
  async list(sortOrder = '-created_date') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching annotations:', error)
      throw error
    }
  }

  /**
   * Retrieve a single annotation by ID
   * @param {string} id - Annotation ID
   * @returns {Promise<Object>} Annotation data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching annotation ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new annotation
   * @param {Object} data - Annotation data
   * @returns {Promise<Object>} Created annotation
   */
  async create(data) {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating annotation:', error)
      throw error
    }
  }

  /**
   * Update an existing annotation
   * @param {string} id - Annotation ID
   * @param {Object} data - Updated annotation data
   * @returns {Promise<Object>} Updated annotation
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating annotation ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete an annotation
   * @param {string} id - Annotation ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting annotation ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter annotations by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered annotations
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering annotations:', error)
      throw error
    }
  }
}

export default new AnnotationService()
