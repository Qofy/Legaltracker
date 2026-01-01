import axios from '../../plugins/axios'

export const chatMessagesService = {
  async getChatMessages(caseId, limit = 50) {
    const params = new URLSearchParams({ case_id: caseId, limit: limit.toString() })
    const response = await axios.get(`/chat-messages?${params.toString()}`)
    return response.data
  },

  async sendMessage(messageData) {
    const response = await axios.post('/chat-messages', messageData)
    return response.data
  },

  async updateMessage(id, content) {
    const response = await axios.put(`/chat-messages/${id}`, { content })
    return response.data
  },

  async deleteMessage(id) {
    const response = await axios.delete(`/chat-messages/${id}`)
    return response.data
  },
}
