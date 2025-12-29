import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const { user, isAuthenticated, userType } = storeToRefs(authStore)

  const login = async (credentials) => {
    await authStore.login(credentials)
    router.push({ name: 'Dashboard' })
  }

  const fakeLogin = (userType = 'admin') => {
    authStore.fakeLogin(userType)
    router.push({ name: 'Dashboard' })
  }

  const register = async (userData) => {
    await authStore.register(userData)
    router.push({ name: 'Dashboard' })
  }

  const logout = () => {
    authStore.logout()
    router.push({ name: 'Login' })
  }

  return {
    user,
    isAuthenticated,
    userType,
    login,
    fakeLogin,
    register,
    logout,
    hasRole: authStore.hasRole,
    loadUser: authStore.loadUser,
  }
}
