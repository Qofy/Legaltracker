import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '../plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const accessToken = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const userType = computed(() => user.value?.user_type || user.value?.userType)

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials)
      setAuthData(response.data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const fakeLogin = (userType = 'admin') => {
    const fakeData = {
      user: {
        id: 'fake-user-id-123',
        email: 'demo@legalhub.com',
        fullName: 'Demo User',
        userType: userType,
        profilePicture: null,
      },
      accessToken: 'fake-jwt-token-' + Date.now(),
      refreshToken: 'fake-refresh-token-' + Date.now(),
    }
    setAuthData(fakeData)
    return fakeData
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData)
      setAuthData(response.data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const loadUser = async () => {
    if (!accessToken.value) return

    // Skip API call if using fake token
    if (accessToken.value.startsWith('fake-jwt-token-')) {
      return
    }

    try {
      const response = await axios.get('/auth/me')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      logout()
    }
  }

  const setAuthData = (data) => {
    user.value = data.user
    accessToken.value = data.access_token || data.accessToken
    refreshToken.value = data.refresh_token || data.refreshToken
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('accessToken', data.access_token || data.accessToken)
    if (data.refresh_token || data.refreshToken) {
      localStorage.setItem('refreshToken', data.refresh_token || data.refreshToken)
    }
  }

  const hasRole = (...roles) => {
    return roles.includes(userType.value)
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    userType,
    login,
    fakeLogin,
    register,
    logout,
    loadUser,
    hasRole,
  }
})
