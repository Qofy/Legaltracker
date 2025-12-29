import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCasesStore = defineStore('cases', () => {
  const cases = ref([])
  const selectedCase = ref(null)
  const filters = ref({
    status: null,
    priority: null,
    caseType: null,
    search: '',
  })
  const loading = ref(false)

  const setCases = (newCases) => {
    cases.value = newCases
  }

  const setSelectedCase = (caseData) => {
    selectedCase.value = caseData
  }

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      status: null,
      priority: null,
      caseType: null,
      search: '',
    }
  }

  return {
    cases,
    selectedCase,
    filters,
    loading,
    setCases,
    setSelectedCase,
    updateFilters,
    clearFilters,
  }
})
