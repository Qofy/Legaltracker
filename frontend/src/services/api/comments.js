import axios from '../../plugins/axios'

export const commentsService = {
  async getComments(caseId) {
    const response = await axios.get(`/comments?case_id=${caseId}`)
    return response.data
  },

  async createComment(commentData) {
    const response = await axios.post('/comments', commentData)
    return response.data
  },

  async updateComment(id, commentData) {
    const response = await axios.put(`/comments/${id}`, commentData)
    return response.data
  },

  async deleteComment(id) {
    const response = await axios.delete(`/comments/${id}`)
    return response.data
  },
}
