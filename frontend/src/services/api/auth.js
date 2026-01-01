import axios from '../../plugins/axios'

export const authService = {
  async login(email, password) {
    const response = await axios.post('/auth/login', { email, password })
    const { access_token, user } = response.data

    // Store token and user in localStorage
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('user', JSON.stringify(user))

    return response.data
  },

  async register(userData) {
    const response = await axios.post('/auth/register', userData)
    const { access_token, user } = response.data

    // Store token and user in localStorage
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('user', JSON.stringify(user))

    return response.data
  },

  async logout() {
    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('pinnedCaseId')
  },

  async getCurrentUser() {
    const response = await axios.get('/auth/me')
    return response.data
  },

  async updateProfile(userData) {
    const response = await axios.put('/auth/profile', userData)

    // Update user in localStorage
    localStorage.setItem('user', JSON.stringify(response.data))

    return response.data
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  getStoredToken() {
    return localStorage.getItem('accessToken')
  },

  isAuthenticated() {
    return !!this.getStoredToken()
  },
}
