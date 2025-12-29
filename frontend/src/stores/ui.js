import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const chatPanelOpen = ref(true)
  const commentsPanelOpen = ref(true)
  const mobileMenuOpen = ref(false)

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const toggleChatPanel = () => {
    chatPanelOpen.value = !chatPanelOpen.value
  }

  const toggleCommentsPanel = () => {
    commentsPanelOpen.value = !commentsPanelOpen.value
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  return {
    sidebarOpen,
    chatPanelOpen,
    commentsPanelOpen,
    mobileMenuOpen,
    toggleSidebar,
    toggleChatPanel,
    toggleCommentsPanel,
    toggleMobileMenu,
  }
})
