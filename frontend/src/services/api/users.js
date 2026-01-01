import axios from '../../plugins/axios'

export const usersService = {
  async getUsers(filters = {}) {
    const params = new URLSearchParams()
    if (filters.role) params.append('role', filters.role)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)

    const response = await axios.get(`/users?${params.toString()}`)
    return response.data
  },

  async getUser(id) {
    const response = await axios.get(`/users/${id}`)
    return response.data
  },

  async createUser(userData) {
    const response = await axios.post('/users', userData)
    return response.data
  },

  async updateUser(id, userData) {
    const response = await axios.put(`/users/${id}`, userData)
    return response.data
  },

  async deleteUser(id) {
    const response = await axios.delete(`/users/${id}`)
    return response.data
  },
}
