import axios from '../../plugins/axios'

export const feedbackService = {
  async getBugReports() {
    const response = await axios.get('/feedback/bugs')
    return response.data
  },

  async createBugReport(bugData) {
    const response = await axios.post('/feedback/bugs', bugData)
    return response.data
  },

  async updateBugReport(id, bugData) {
    const response = await axios.put(`/feedback/bugs/${id}`, bugData)
    return response.data
  },

  async getFeatureRequests() {
    const response = await axios.get('/feedback/features')
    return response.data
  },

  async createFeatureRequest(featureData) {
    const response = await axios.post('/feedback/features', featureData)
    return response.data
  },

  async updateFeatureRequest(id, featureData) {
    const response = await axios.put(`/feedback/features/${id}`, featureData)
    return response.data
  },

  async voteFeatureRequest(id) {
    const response = await axios.post(`/feedback/features/${id}/vote`)
    return response.data
  },
}
