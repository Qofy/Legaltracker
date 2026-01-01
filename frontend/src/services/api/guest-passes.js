import axios from '../../plugins/axios'

export const guestPassesService = {
  async getGuestPasses() {
    const response = await axios.get('/guest-passes')
    return response.data
  },

  async createGuestPass(guestPassData) {
    const response = await axios.post('/guest-passes', guestPassData)
    return response.data
  },

  async validateGuestPass(token) {
    const response = await axios.post('/guest-passes/validate', { token })
    return response.data
  },

  async updateGuestPass(id, guestPassData) {
    const response = await axios.put(`/guest-passes/${id}`, guestPassData)
    return response.data
  },

  async deleteGuestPass(id) {
    const response = await axios.delete(`/guest-passes/${id}`)
    return response.data
  },
}
