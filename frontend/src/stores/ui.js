import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const chatPanelOpen = ref(true)
  const commentsPanelOpen = ref(true)
  const mobileMenuOpen = ref(false)
  // Language / Regional preferences (persist to localStorage)
  const language = ref('en')
  const region = ref('')

  // initialize from localStorage when available
  try {
    const storedLang = localStorage.getItem('language_preference')
    if (storedLang) language.value = storedLang
  } catch (e) {}
  try {
    const storedRegion = localStorage.getItem('region_preference')
    if (storedRegion) region.value = storedRegion
  } catch (e) {}

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

  const setLanguage = (lang) => {
    language.value = lang
    try { localStorage.setItem('language_preference', lang) } catch (e) {}
  }

  const setRegion = (r) => {
    region.value = r
    try { localStorage.setItem('region_preference', r) } catch (e) {}
  }

  return {
    sidebarOpen,
    chatPanelOpen,
    commentsPanelOpen,
    mobileMenuOpen,
    language,
    region,
    toggleSidebar,
    toggleChatPanel,
    toggleCommentsPanel,
    toggleMobileMenu,
    setLanguage,
    setRegion,
  }
})
