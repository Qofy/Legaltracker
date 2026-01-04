<template>
  <div>
    <div class="fixed top-3 right-3 z-50">
      <button
        @click="toggleTheme"
        class="p-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
        title="Toggle theme"
      >
        <component :is="iconComponent" class="w-5 h-5 text-gray-700" />
      </button>
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuth } from './composables/useAuth'
import { useTheme } from '@/stores/useTheme'
import { Sun, Moon } from 'lucide-vue-next'

const { loadUser, isAuthenticated } = useAuth()
const themeStore = useTheme()

const iconComponent = computed(() => (themeStore.theme === 'dark' ? Sun : Moon))
const toggleTheme = () => themeStore.toggleTheme()

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadUser()
  }
})
</script>
