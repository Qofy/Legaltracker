import axios from '../../plugins/axios'

export const actionItemsService = {
  async getActionItems(caseId, filters = {}) {
    const params = new URLSearchParams({ case_id: caseId })
    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.assignedTo) params.append('assigned_to', filters.assignedTo)

    const response = await axios.get(`/action-items?${params.toString()}`)
    return response.data
  },

  async getActionItem(id) {
    const response = await axios.get(`/action-items/${id}`)
    return response.data
  },

  async createActionItem(actionItemData) {
    const response = await axios.post('/action-items', actionItemData)
    return response.data
  },

  async updateActionItem(id, actionItemData) {
    const response = await axios.put(`/action-items/${id}`, actionItemData)
    return response.data
  },

  async deleteActionItem(id) {
    const response = await axios.delete(`/action-items/${id}`)
    return response.data
  },

  async markComplete(id) {
    const response = await axios.post(`/action-items/${id}/complete`)
    return response.data
  },
}
