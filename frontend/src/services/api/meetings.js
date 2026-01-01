import axios from '../../plugins/axios'

export const meetingsService = {
  async getMeetings(caseId) {
    const response = await axios.get(`/meetings?case_id=${caseId}`)
    return response.data
  },

  async getUpcomingMeetings(caseId) {
    const response = await axios.get(`/meetings?case_id=${caseId}&upcoming=true`)
    return response.data
  },

  async getMeeting(id) {
    const response = await axios.get(`/meetings/${id}`)
    return response.data
  },

  async createMeeting(meetingData) {
    const response = await axios.post('/meetings', meetingData)
    return response.data
  },

  async updateMeeting(id, meetingData) {
    const response = await axios.put(`/meetings/${id}`, meetingData)
    return response.data
  },

  async deleteMeeting(id) {
    const response = await axios.delete(`/meetings/${id}`)
    return response.data
  },
}
