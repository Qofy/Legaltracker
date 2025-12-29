import axios from '../../plugins/axios'

export const casesService = {
  async getCases(filters = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.caseType) params.append('caseType', filters.caseType)
    if (filters.search) params.append('search', filters.search)

    const response = await axios.get(`/cases?${params.toString()}`)
    return response.data
  },

  async getCase(id) {
    const response = await axios.get(`/cases/${id}`)
    return response.data
  },

  async createCase(caseData) {
    const response = await axios.post('/cases', caseData)
    return response.data
  },

  async updateCase(id, caseData) {
    const response = await axios.put(`/cases/${id}`, caseData)
    return response.data
  },

  async deleteCase(id) {
    const response = await axios.delete(`/cases/${id}`)
    return response.data
  },

  async shareCase(id, userIds) {
    const response = await axios.post(`/cases/${id}/share`, { userIds })
    return response.data
  },

  async addOwner(id, userId) {
    const response = await axios.post(`/cases/${id}/owners`, { userId })
    return response.data
  },
}
