import axios from '@/plugins/axios'

/**
 * Report Service
 * Provides operations for managing lawyer reports sent to admin
 */
class ReportService {
  constructor() {
    this.baseUrl = '/messages'
  }

  /**
   * Retrieve reports sent by current user
   * @param {string} messageType - Type of report ('case_report', 'report', etc.)
   * @returns {Promise<Array>} List of reports
   */
  async listMyReports(messageType = null) {
    try {
      const params = {
        from_current_user: true,
        to_role: 'admin'
      }
      if (messageType) {
        params.message_type = messageType
      }
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching my reports:', error)
      throw error
    }
  }

  /**
   * Send a report to admin
   * @param {Object} reportData - Report data
   * @returns {Promise<Object>} Created report
   */
  async sendToAdmin(reportData) {
    try {
      const response = await axios.post(this.baseUrl, {
        ...reportData,
        to_role: 'admin'
      })
      return response.data
    } catch (error) {
      console.error('Error sending report:', error)
      throw error
    }
  }

  /**
   * Get reports sent to admin (admin only)
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of reports
   */
  async getAdminReports(filters = {}) {
    try {
      const params = {
        to_role: 'admin',
        ...filters
      }
      const response = await axios.get(this.baseUrl, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching admin reports:', error)
      throw error
    }
  }

  /**
   * Update report status (admin only)
   * @param {string} id - Report ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated report
   */
  async updateStatus(id, updates) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}`, updates)
      return response.data
    } catch (error) {
      console.error(`Error updating report ${id}:`, error)
      throw error
    }
  }
}

export default new ReportService()