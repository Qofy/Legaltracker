import axios from '@/plugins/axios'

/**
 * Document Service
 * Provides CRUD operations for Document entities
 */
class DocumentService {
  constructor() {
    this.baseUrl = '/documents'
  }

  /**
   * Retrieve all documents with optional sorting
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @returns {Promise<Array>} List of documents
   */
  async list(sortOrder = '-created_date') {
    try {
      console.log('Document.list() called with sortOrder:', sortOrder);
      const response = await axios.get(this.baseUrl, {
        params: { sort: sortOrder }
      })
      console.log('Document.list() response:', response.data);
      return response.data
    } catch (error) {
      console.error('Error fetching documents:', error)
      throw error
    }
  }

  /**
   * Retrieve a single document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Document data
   */
  async get(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    try {
      console.log('Document.create() called with data:', data);
      const response = await axios.post(this.baseUrl, data)
      console.log('Document.create() response:', response.data);
      return response.data
    } catch (error) {
      console.error('Error creating document:', error)
      console.error('Error details:', error.response?.data);
      throw error
    }
  }

  /**
   * Update an existing document
   * @param {string} id - Document ID
   * @param {Object} data - Updated document data
   * @returns {Promise<Object>} Updated document
   */
  async update(id, data) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating document ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a document
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error)
      throw error
    }
  }

  /**
   * Filter documents by criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order (default: '-created_date')
   * @param {number|null} limit - Result limit
   * @returns {Promise<Array>} Filtered documents
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    try {
      const params = { ...criteria, sort: sortOrder }
      if (limit) params.limit = limit
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error filtering documents:', error)
      throw error
    }
  }
}

export default new DocumentService()
