import axios from '../../plugins/axios'

/**
 * Base Entity Service class providing CRUD operations
 */
class BaseEntityService {
  constructor(entityName, baseUrl = null) {
    this.entityName = entityName
    this.baseUrl = baseUrl || `/api/${entityName.toLowerCase()}s`
  }

  /**
   * List all entities with optional sorting
   * @param {string} sortOrder - Sort order (e.g., '-created_date')
   * @returns {Promise<Array>}
   */
  async list(sortOrder = '-created_date') {
    const response = await axios.get(this.baseUrl, {
      params: { sort: sortOrder }
    })
    return response.data
  }

  /**
   * Get a single entity by ID
   * @param {string} id - Entity ID
   * @returns {Promise<Object>}
   */
  async get(id) {
    const response = await axios.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const response = await axios.post(this.baseUrl, data)
    return response.data
  }

  /**
   * Update an existing entity
   * @param {string} id - Entity ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Delete an entity
   * @param {string} id - Entity ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await axios.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Filter entities with criteria
   * @param {Object} criteria - Filter criteria
   * @param {string} sortOrder - Sort order
   * @param {number} limit - Result limit
   * @returns {Promise<Array>}
   */
  async filter(criteria, sortOrder = '-created_date', limit = null) {
    const params = { ...criteria, sort: sortOrder }
    if (limit) params.limit = limit

    const response = await axios.get(this.baseUrl, { params })
    return response.data
  }
}

export default BaseEntityService
