import axios from '../../plugins/axios'

export const invitationsService = {
  async getInvitations() {
    const response = await axios.get('/invitations')
    return response.data
  },

  async sendInvitation(invitationData) {
    const response = await axios.post('/invitations', invitationData)
    return response.data
  },

  async updateInvitation(id, status) {
    const response = await axios.put(`/invitations/${id}`, { status })
    return response.data
  },

  async deleteInvitation(id) {
    const response = await axios.delete(`/invitations/${id}`)
    return response.data
  },
}
