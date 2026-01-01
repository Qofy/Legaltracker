import axios from '../../plugins/axios'

export const documentsService = {
  async getDocuments(caseId, filters = {}) {
    const params = new URLSearchParams({ case_id: caseId })
    if (filters.documentType) params.append('document_type', filters.documentType)
    if (filters.search) params.append('search', filters.search)

    const response = await axios.get(`/documents?${params.toString()}`)
    return response.data
  },

  async getDocument(id) {
    const response = await axios.get(`/documents/${id}`)
    return response.data
  },

  async uploadDocument(formData) {
    const response = await axios.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async updateDocument(id, documentData) {
    const response = await axios.put(`/documents/${id}`, documentData)
    return response.data
  },

  async deleteDocument(id) {
    const response = await axios.delete(`/documents/${id}`)
    return response.data
  },

  async awardPoints(id, points) {
    const response = await axios.post(`/documents/${id}/points`, { points })
    return response.data
  },
}
