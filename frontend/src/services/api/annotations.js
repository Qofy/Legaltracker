import axios from '../../plugins/axios'

export const annotationsService = {
  async getAnnotations(documentId) {
    const response = await axios.get(`/annotations?document_id=${documentId}`)
    return response.data
  },

  async createAnnotation(annotationData) {
    const response = await axios.post('/annotations', annotationData)
    return response.data
  },

  async updateAnnotation(id, annotationData) {
    const response = await axios.put(`/annotations/${id}`, annotationData)
    return response.data
  },

  async deleteAnnotation(id) {
    const response = await axios.delete(`/annotations/${id}`)
    return response.data
  },
}
